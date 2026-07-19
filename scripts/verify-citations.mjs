#!/usr/bin/env node
/**
 * verify-citations — o oráculo externo de citações de um artefato markdown.
 *
 * Uso:  node verify-citations.mjs <doc.md> [--repo <raiz>] [--offline] [--json]
 *
 * Verifica mecanicamente:
 *  1. path:linha  — o arquivo existe na raiz dada? a linha existe? se a MESMA linha do doc
 *     contém um trecho entre aspas/crases (>=12 chars), o trecho aparece no arquivo citado
 *     numa janela de ±8 linhas? (tolerância a drift)
 *  2. URLs http(s) — resolvem? (HEAD, fallback GET; >=400 = morta). --offline pula.
 *
 * Saída: relatório por citação + resumo. Exit 1 se qualquer FAIL. --json para máquina.
 * Vereditos: OK · QUOTE_OK · QUOTE_FAIL · NO_FILE · BAD_LINE · DEAD_URL · UNKNOWN(rede) · SKIPPED
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, isAbsolute } from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const docPath = args.find((a) => !a.startsWith("--"));
if (!docPath) {
  console.error("uso: verify-citations.mjs <doc.md> [--repo <raiz>] [--offline] [--json]");
  process.exit(2);
}
const repoIdx = args.indexOf("--repo");
const repoRoot = repoIdx >= 0 ? args[repoIdx + 1] : process.cwd();
const OFFLINE = args.includes("--offline");
const AS_JSON = args.includes("--json");

const doc = readFileSync(docPath, "utf8");
const docLines = doc.split(/\r?\n/);
const findings = [];

// Pino temporal: --commit <sha>, ou auto-detectado de "Base: commit `abc1234`" no doc.
const commitIdx = args.indexOf("--commit");
let PIN =
  commitIdx >= 0 ? args[commitIdx + 1] : doc.match(/Base:\s*commit\s*`?([0-9a-f]{7,40})`?/i)?.[1];
if (PIN) {
  try {
    execFileSync("git", ["-C", repoRoot, "cat-file", "-e", `${PIN}^{commit}`], { stdio: "pipe" });
  } catch {
    console.error(`aviso: pino ${PIN} não existe em ${repoRoot} — verificando contra o working tree.`);
    PIN = undefined;
  }
}
/** Lê o arquivo citado no pino (git show) ou no working tree. Retorna null se não existe. */
function readCited(rel, abs) {
  if (PIN) {
    try {
      return execFileSync("git", ["-C", repoRoot, "show", `${PIN}:${rel}`], {
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      });
    } catch {
      return null;
    }
  }
  return existsSync(abs) ? readFileSync(abs, "utf8") : null;
}

// ---------------------------------------------------------------- path:linha
// ex.: apps/api/src/modules/leagues/get-player/get-player.service.ts:12  ·  packages/ui/package.json:16-40
const PATH_RE =
  /(?<![\w.$])((?:[A-Za-z0-9_.()\[\]-]+\/)+[A-Za-z0-9_.()\[\]-]+\.(?:ts|tsx|js|jsx|mjs|cjs|py|md|json|ya?ml|sql|go|rs|css|html|txt)):(\d+)(?:-(\d+))?/g;
// trecho verbatim na mesma linha do doc: "..." ou `...` ou “...”
const QUOTE_RE_G = /["“`]([^"”`]{12,})["”`]/g;
// um candidato a trecho NÃO pode ser ele mesmo um path:linha (crase em volta de citação é comum)
const LOOKS_LIKE_PATH = /^[A-Za-z0-9_.\/-]+\.(?:ts|tsx|js|jsx|mjs|cjs|py|md|json|ya?ml|sql|go|rs|css|html|txt)(?::\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)?$/;
function extractQuote(line) {
  for (const m of line.matchAll(QUOTE_RE_G)) {
    if (/^\s|\s$/.test(m[1])) continue; // span entre aspas de palavras distintas, não um trecho
    const q = m[1].trim();
    if (LOOKS_LIKE_PATH.test(q)) continue;
    if (!q.includes(" ") && q.includes("/")) continue; // token path-like (dir, import), não prosa
    return q;
  }
  return undefined;
}

const seenPaths = new Set();
docLines.forEach((line, i) => {
  const citesOnLine = [...line.matchAll(PATH_RE)].length;
  for (const m of line.matchAll(PATH_RE)) {
    const [, rel, startS, endS] = m;
    const key = `${rel}:${startS}${endS ? "-" + endS : ""}`;
    if (seenPaths.has(key)) continue;
    seenPaths.add(key);
    const start = Number(startS);
    const end = endS ? Number(endS) : start;
    const abs = isAbsolute(rel) ? rel : resolve(repoRoot, rel);
    const f = { type: "path", cite: key, docLine: i + 1 };
    if (rel.includes("...")) {
      f.verdict = "SKIPPED";
      f.detail = "path abreviado com reticências no doc";
      findings.push(f);
      continue;
    }
    let content = readCited(rel, abs);
    if (content === null && rel.split("/").length >= 2) {
      // convenção do repo: primeira menção com path completo, repetições encurtadas — resolve por sufixo
      try {
        const list = PIN
          ? execFileSync("git", ["-C", repoRoot, "ls-tree", "-r", "--name-only", PIN], {
              encoding: "utf8",
              maxBuffer: 32 * 1024 * 1024,
            })
          : execFileSync("git", ["-C", repoRoot, "ls-files"], {
              encoding: "utf8",
              maxBuffer: 32 * 1024 * 1024,
            });
        const hits = list.split("\n").filter((p) => p.endsWith("/" + rel));
        if (hits.length === 1) {
          content = readCited(hits[0], resolve(repoRoot, hits[0]));
          f.detail = `resolvido por sufixo → ${hits[0]}`;
        }
      } catch {
        /* sem git: segue como NO_FILE */
      }
    }
    if (content === null) {
      f.verdict = "NO_FILE";
      f.detail = `não existe ${PIN ? `no commit ${PIN}` : `sob ${repoRoot}`}`;
    } else {
      const fileLines = content.split(/\r?\n/);
      if (start > fileLines.length) {
        f.verdict = "BAD_LINE";
        f.detail = `linha ${start} > total ${fileLines.length}`;
      } else {
        // trecho só é atribuível quando a linha tem UMA citação — com várias, é ambíguo
        const q = citesOnLine === 1 ? extractQuote(line) : undefined;
        if (q) {
          const lo = Math.max(0, start - 1 - 8);
          const hi = Math.min(fileLines.length, end + 8);
          const windowTxt = fileLines.slice(lo, hi).join("\n").replace(/\s+/g, " ");
          const needle = q.replace(/\s+/g, " ");
          if (windowTxt.includes(needle)) {
            f.verdict = "QUOTE_OK";
          } else if (content.replace(/\s+/g, " ").includes(needle)) {
            f.verdict = "QUOTE_OK";
            f.detail = "trecho existe no arquivo, mas fora da janela ±8 da linha citada (drift?)";
          } else {
            f.verdict = "QUOTE_FAIL";
            f.detail = `trecho "${q.slice(0, 50)}…" não encontrado no arquivo`;
          }
        } else {
          f.verdict = "OK";
          f.detail = "arquivo e linha existem (sem trecho verbatim na linha do doc para conferir)";
        }
      }
    }
    findings.push(f);
  }
});

// ------------------------------------------------------------------- URLs
const URL_RE = /https?:\/\/[^\s)\]>"'`,]+/g;
const SKIP_HOSTS = /^(localhost|127\.|0\.0\.0\.0|example\.(com|org))/;
const urls = [...new Set([...doc.matchAll(URL_RE)].map((m) => m[0].replace(/[.,;:!?]+$/, "")))];

async function checkUrl(u) {
  const f = { type: "url", cite: u };
  let host = "";
  try {
    host = new URL(u).host;
  } catch {
    f.verdict = "SKIPPED";
    f.detail = "URL malformada";
    return f;
  }
  if (SKIP_HOSTS.test(host)) {
    f.verdict = "SKIPPED";
    f.detail = "host local/exemplo";
    return f;
  }
  if (OFFLINE) {
    f.verdict = "SKIPPED";
    f.detail = "--offline";
    return f;
  }
  const attempt = async (method) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 12000);
    try {
      const r = await fetch(u, { method, redirect: "follow", signal: ctl.signal });
      return r.status;
    } finally {
      clearTimeout(t);
    }
  };
  try {
    let status = await attempt("HEAD");
    if (status === 405 || status === 403 || status === 501) status = await attempt("GET");
    f.status = status;
    f.verdict = status < 400 ? "OK" : "DEAD_URL";
    if (status >= 400) f.detail = `HTTP ${status}`;
  } catch (e) {
    f.verdict = "UNKNOWN";
    f.detail = `rede: ${e.name === "AbortError" ? "timeout" : e.message}`;
  }
  return f;
}

const urlFindings = await Promise.all(urls.map(checkUrl));
findings.push(...urlFindings);

// ---------------------------------------------------------------- relatório
const FAILS = new Set(["NO_FILE", "BAD_LINE", "QUOTE_FAIL", "DEAD_URL"]);
const summary = {};
for (const f of findings) summary[f.verdict] = (summary[f.verdict] ?? 0) + 1;
const failed = findings.filter((f) => FAILS.has(f.verdict));

if (AS_JSON) {
  console.log(JSON.stringify({ doc: docPath, repoRoot, summary, findings }, null, 2));
} else {
  for (const f of findings) {
    const mark = FAILS.has(f.verdict) ? "✗" : f.verdict === "UNKNOWN" ? "?" : "✓";
    console.log(
      `${mark} [${f.verdict}] ${f.cite}${f.docLine ? ` (doc:${f.docLine})` : ""}${f.detail ? ` — ${f.detail}` : ""}`
    );
  }
  console.log(
    `\n${docPath}: ${findings.length} citações · ` +
      Object.entries(summary)
        .map(([k, v]) => `${k}=${v}`)
        .join(" · ")
  );
  if (failed.length) console.log(`FAIL: ${failed.length} citação(ões) quebrada(s).`);
}
process.exit(failed.length ? 1 : 0);
