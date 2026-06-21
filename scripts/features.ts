#!/usr/bin/env bun
/**
 * CLI do registro de features (docs/features). Zero-dependency.
 *
 *   bun run features check          valida todos os arquivos de feature
 *   bun run features build          (re)gera docs/features/INDEX.md
 *   bun run features impact <ID>    quem re-testar se <ID> mudar
 *   bun run features lines <ID>     commits e arquivos que carregam [<ID>]
 *
 * Convenções: docs/features/README.md.
 */

import { execSync } from "node:child_process"
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, dirname, join, relative } from "node:path"

// scripts/features.ts → raiz do repo (argv[1] é o caminho deste script)
const ROOT = join(dirname(process.argv[1] ?? process.cwd()), "..")
const FEATURES_DIR = join(ROOT, "docs", "features")
const INDEX_PATH = join(FEATURES_DIR, "INDEX.md")

const STATUS = ["ideia", "investigado", "planejado", "em-andamento", "feito", "verificado"] as const
const PRIORIDADE = ["P1", "P2", "P3"] as const
const TESTADA = ["nao", "parcial", "sim"] as const
const FACETAS = ["dados", "api", "ia", "ui"] as const
const ANCORA_CATS = ["settings", "tabelas", "tools", "funcoes", "rotas"] as const
const ID_RE = /^[A-Z]{2,}-\d{3,}$/
const EXCLUDE = new Set(["_template.md", "README.md", "INDEX.md"])

type Frontmatter = Record<string, unknown>
type Feature = {
  path: string // relativo à raiz do repo
  fm: Frontmatter
  id: string
  titulo: string
  modulo: string
  status: string
  prioridade: string
  testada: string
  facetas: Record<string, string>
  ancoras: Record<string, string[]>
  depende_de: string[]
  impacta: string[]
  docs: string[]
}

// ---------- parser de frontmatter (subset YAML controlado pelo _template) ----------

function stripComment(s: string): string {
  let inSingle = false
  let inDouble = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '"' && !inSingle) inDouble = !inDouble
    else if (c === "'" && !inDouble) inSingle = !inSingle
    else if (c === "#" && !inSingle && !inDouble && (i === 0 || s[i - 1] === " ")) return s.slice(0, i)
  }
  return s
}

function unquote(s: string): string {
  const t = s.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1)
  }
  return t
}

function splitInline(inner: string): string[] {
  const out: string[] = []
  let cur = ""
  let inSingle = false
  let inDouble = false
  for (const c of inner) {
    if (c === '"' && !inSingle) inDouble = !inDouble
    else if (c === "'" && !inDouble) inSingle = !inSingle
    if (c === "," && !inSingle && !inDouble) {
      out.push(cur)
      cur = ""
    } else cur += c
  }
  if (cur.trim() !== "") out.push(cur)
  return out.map((x) => unquote(x)).filter((x) => x !== "")
}

function parseValue(raw: string): unknown {
  const s = stripComment(raw).trim()
  if (s === "" || s === "null" || s === "~") return null
  if (s.startsWith("[") && s.endsWith("]")) return splitInline(s.slice(1, -1))
  if (/^-?\d+$/.test(s)) return Number(s)
  return unquote(s)
}

function parseFrontmatter(text: string): Frontmatter | null {
  if (!text.startsWith("---")) return null
  const end = text.indexOf("\n---", 3)
  if (end === -1) return null
  const body = text.slice(text.indexOf("\n") + 1, end)
  const lines = body.split("\n")
  const fm: Frontmatter = {}
  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ""
    if (stripComment(line).trim() === "") {
      i++
      continue
    }
    const m = /^(\S[\w-]*):\s*(.*)$/.exec(line)
    if (!m) {
      i++
      continue
    }
    const key = m[1]!
    const rest = stripComment(m[2]!).trim()
    if (rest !== "") {
      fm[key] = parseValue(rest)
      i++
      continue
    }
    // bloco indentado: mapa (subchave:) ou lista (- item)
    const block: string[] = []
    let j = i + 1
    while (j < lines.length && (lines[j]!.startsWith("  ") || lines[j]!.trim() === "")) {
      if (lines[j]!.trim() !== "") block.push(lines[j]!)
      j++
    }
    if (block.length === 0) {
      fm[key] = null
    } else if (block.every((b) => b.trim().startsWith("- "))) {
      fm[key] = block.map((b) => parseValue(b.trim().slice(2)))
    } else {
      const map: Record<string, unknown> = {}
      for (const b of block) {
        const bm = /^\s*([\w-]+):\s*(.*)$/.exec(b)
        if (bm) map[bm[1]!] = parseValue(bm[2]!)
      }
      fm[key] = map
    }
    i = j
  }
  return fm
}

// ---------- carregamento ----------

function listFeatureFiles(): string[] {
  let entries: string[]
  try {
    entries = readdirSync(FEATURES_DIR, { recursive: true }) as string[]
  } catch {
    return []
  }
  return entries
    .map((e) => join(FEATURES_DIR, e))
    .filter((p) => p.endsWith(".md") && !EXCLUDE.has(basename(p)))
}

function asStr(v: unknown, fallback = ""): string {
  return v === null || v === undefined ? fallback : String(v)
}
function asList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).filter((x) => x !== "")
  if (v === null || v === undefined || v === "") return []
  return [String(v)]
}

function loadFeatures(): { features: Feature[]; parseErrors: string[] } {
  const features: Feature[] = []
  const parseErrors: string[] = []
  for (const p of listFeatureFiles()) {
    const rel = relative(ROOT, p).replace(/\\/g, "/")
    const fm = parseFrontmatter(readFileSync(p, "utf8"))
    if (!fm) {
      parseErrors.push(`${rel}: sem frontmatter YAML válido`)
      continue
    }
    const facetasRaw = (fm.facetas ?? {}) as Record<string, unknown>
    const ancorasRaw = (fm.ancoras ?? {}) as Record<string, unknown>
    const facetas: Record<string, string> = {}
    for (const [k, v] of Object.entries(facetasRaw)) facetas[k] = asStr(v)
    const ancoras: Record<string, string[]> = {}
    for (const cat of ANCORA_CATS) ancoras[cat] = asList(ancorasRaw[cat])
    features.push({
      path: rel,
      fm,
      id: asStr(fm.id),
      titulo: asStr(fm.titulo),
      modulo: asStr(fm.modulo),
      status: asStr(fm.status),
      prioridade: asStr(fm.prioridade),
      testada: asStr(fm.testada),
      facetas,
      ancoras,
      depende_de: asList(fm.depende_de),
      impacta: asList(fm.impacta),
      docs: asList(fm.docs),
    })
  }
  return { features, parseErrors }
}

// ---------- check ----------

function detectCycle(features: Feature[]): string[] {
  const byId = new Map(features.map((f) => [f.id, f]))
  const state = new Map<string, number>() // 0=visitando, 1=ok
  const cycles: string[] = []
  const stack: string[] = []
  function visit(id: string) {
    if (state.get(id) === 1) return
    if (state.get(id) === 0) {
      const at = stack.indexOf(id)
      cycles.push(stack.slice(at).concat(id).join(" → "))
      return
    }
    state.set(id, 0)
    stack.push(id)
    for (const dep of byId.get(id)?.depende_de ?? []) {
      if (byId.has(dep)) visit(dep)
    }
    stack.pop()
    state.set(id, 1)
  }
  for (const f of features) visit(f.id)
  return [...new Set(cycles)]
}

function check(): number {
  const { features, parseErrors } = loadFeatures()
  const errors = [...parseErrors]
  const ids = new Map<string, string[]>()

  for (const f of features) {
    const at = f.path
    if (!f.id) errors.push(`${at}: falta 'id'`)
    else {
      if (!ID_RE.test(f.id)) errors.push(`${at}: id '${f.id}' fora do padrão XXX-000`)
      ids.set(f.id, [...(ids.get(f.id) ?? []), at])
    }
    if (!f.titulo) errors.push(`${at}: falta 'titulo'`)
    if (!f.modulo) errors.push(`${at}: falta 'modulo'`)
    if (!STATUS.includes(f.status as never)) errors.push(`${at}: status inválido '${f.status}'`)
    if (f.prioridade && !PRIORIDADE.includes(f.prioridade as never))
      errors.push(`${at}: prioridade inválida '${f.prioridade}'`)
    if (f.testada && !TESTADA.includes(f.testada as never))
      errors.push(`${at}: testada inválida '${f.testada}'`)
    for (const [k, v] of Object.entries(f.facetas)) {
      if (!FACETAS.includes(k as never)) errors.push(`${at}: faceta desconhecida '${k}'`)
      if (v && !STATUS.includes(v as never)) errors.push(`${at}: faceta ${k} com status inválido '${v}'`)
    }
    if (f.status === "verificado") {
      if (f.testada !== "sim") errors.push(`${at}: status=verificado exige testada=sim`)
      if (!f.fm.verificado_em) errors.push(`${at}: status=verificado exige verificado_em`)
    }
  }

  // ids únicos
  for (const [id, paths] of ids) {
    if (paths.length > 1) errors.push(`id duplicado '${id}': ${paths.join(", ")}`)
  }
  // refs existentes
  const known = new Set(ids.keys())
  for (const f of features) {
    for (const dep of f.depende_de)
      if (!known.has(dep)) errors.push(`${f.path}: depende_de '${dep}' não existe`)
    for (const imp of f.impacta)
      if (!known.has(imp)) errors.push(`${f.path}: impacta '${imp}' não existe`)
  }
  // ciclos
  for (const c of detectCycle(features)) errors.push(`ciclo em depende_de: ${c}`)

  if (errors.length) {
    console.error(`✗ ${errors.length} problema(s):`)
    for (const e of errors) console.error(`  - ${e}`)
    return 1
  }
  console.log(`✓ ${features.length} feature(s) OK`)
  return 0
}

// ---------- build (INDEX.md) ----------

function buildIndex(): number {
  const { features, parseErrors } = loadFeatures()
  if (parseErrors.length) {
    console.error("✗ corrija o parsing antes do build:")
    for (const e of parseErrors) console.error(`  - ${e}`)
    return 1
  }
  features.sort((a, b) => a.id.localeCompare(b.id))

  const facetasStr = (f: Feature) =>
    Object.entries(f.facetas)
      .map(([k, v]) => `${k}:${v}`)
      .join(" ") || "—"

  const rows = features
    .map(
      (f) =>
        `| ${f.id} | ${f.titulo} | ${f.modulo} | ${f.status} | ${f.prioridade || "—"} | ${facetasStr(f)} | ${f.testada || "—"} | ${f.depende_de.join(", ") || "—"} |`,
    )
    .join("\n")

  // índice de âncoras
  const anchorBlocks: string[] = []
  for (const cat of ANCORA_CATS) {
    const map = new Map<string, string[]>()
    for (const f of features)
      for (const a of f.ancoras[cat] ?? []) map.set(a, [...(map.get(a) ?? []), f.id])
    if (map.size === 0) continue
    const lines = [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([a, fids]) => `- \`${a}\` → ${fids.join(", ")}${fids.length > 1 ? " ⚠️ compartilhada" : ""}`)
    anchorBlocks.push(`### ${cat}\n\n${lines.join("\n")}`)
  }

  // índice doc → features
  const docMap = new Map<string, string[]>()
  for (const f of features) for (const d of f.docs) docMap.set(d, [...(docMap.get(d) ?? []), f.id])
  const docLines = [...docMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([d, fids]) => `- [${d}](../../${d}) → ${fids.join(", ")}`)

  const out = `<!-- GERADO por \`bun run features build\` — NÃO editar à mão -->

# INDEX de features

${features.length} feature(s). Fonte: arquivos em \`docs/features/\`. Convenções: [README.md](README.md).

## Features

| ID | Título | Módulo | Status | Prio | Facetas | Testada | Depende de |
|---|---|---|---|---|---|---|---|
${rows || "| — | — | — | — | — | — | — | — |"}

## Índice de âncoras

_Pontos compartilhados; ⚠️ = tocado por 2+ features (mudar exige re-testar todas)._

${anchorBlocks.join("\n\n") || "_(nenhuma âncora registrada)_"}

## Índice doc → features

${docLines.join("\n") || "_(nenhum doc vinculado)_"}
`

  writeFileSync(INDEX_PATH, out, "utf8")
  console.log(`✓ INDEX.md gerado (${features.length} feature(s))`)
  return 0
}

// ---------- impact ----------

function impact(id: string): number {
  const { features } = loadFeatures()
  const target = features.find((f) => f.id === id)
  if (!target) {
    console.error(`✗ feature '${id}' não encontrada`)
    return 1
  }
  const dependentes = features.filter((f) => f.depende_de.includes(id)).map((f) => f.id)
  const declaraImpacto = target.impacta
  const impactamEle = features.filter((f) => f.impacta.includes(id)).map((f) => f.id)
  const myAnchors = new Set(ANCORA_CATS.flatMap((c) => (target.ancoras[c] ?? []).map((a) => `${c}:${a}`)))
  const sharing = features
    .filter((f) => f.id !== id)
    .filter((f) => ANCORA_CATS.some((c) => (f.ancoras[c] ?? []).some((a) => myAnchors.has(`${c}:${a}`))))
    .map((f) => f.id)

  const all = [...new Set([...dependentes, ...declaraImpacto, ...impactamEle, ...sharing])]
  console.log(`Impacto de ${id} — ${target.titulo}`)
  console.log(`  dependentes (depende_de: ${id}): ${dependentes.join(", ") || "—"}`)
  console.log(`  declarados em impacta: ${declaraImpacto.join(", ") || "—"}`)
  console.log(`  declaram impactar ${id}: ${impactamEle.join(", ") || "—"}`)
  console.log(`  compartilham âncora: ${sharing.join(", ") || "—"}`)
  console.log(`  → re-testar: ${all.join(", ") || "(nada)"}`)
  return 0
}

// ---------- lines ----------

function lines(id: string): number {
  try {
    const log = execSync(`git log --grep="\\[${id}\\]" --oneline`, { cwd: ROOT, encoding: "utf8" }).trim()
    const files = execSync(`git log --grep="\\[${id}\\]" --name-only --pretty=format:`, {
      cwd: ROOT,
      encoding: "utf8",
    })
    const uniqueFiles = [...new Set(files.split("\n").map((s) => s.trim()).filter(Boolean))].sort()
    console.log(`Commits com [${id}]:`)
    console.log(log ? log.split("\n").map((l) => `  ${l}`).join("\n") : "  (nenhum)")
    console.log(`\nArquivos tocados:`)
    console.log(uniqueFiles.length ? uniqueFiles.map((f) => `  ${f}`).join("\n") : "  (nenhum)")
    return 0
  } catch (e) {
    console.error(`✗ git falhou: ${(e as Error).message}`)
    return 1
  }
}

// ---------- main ----------

const [cmd, arg] = process.argv.slice(2)
let code = 0
switch (cmd) {
  case "check":
    code = check()
    break
  case "build":
    code = buildIndex()
    break
  case "impact":
    if (!arg) {
      console.error("uso: bun run features impact <ID>")
      code = 1
    } else code = impact(arg)
    break
  case "lines":
    if (!arg) {
      console.error("uso: bun run features lines <ID>")
      code = 1
    } else code = lines(arg)
    break
  default:
    console.error("comandos: check | build | impact <ID> | lines <ID>")
    code = 1
}
process.exit(code)
