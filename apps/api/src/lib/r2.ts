import { mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

// Espelha imagens (logos de liga/time, fotos de jogador, bandeiras) pro bucket R2 `mrtip`.
// Roda só nos scripts de sync, sob Bun. Estratégia: baixa do CDN da SportMonks, grava num temp
// e faz `wrangler r2 object put` (já autenticado — sem tokens S3). Devolve a URL pública r2.dev.

const BUCKET = "mrtip"
// Conta do João (joao.galiano.silva@gmail.com) — fixada pra não subir na conta do Fabiano.
const ACCOUNT_ID = "162bc07e4cb66f1b14ec76e52f8f2f21"
// Domínio público r2.dev do bucket (habilitado via `wrangler r2 bucket dev-url enable mrtip`).
// Subdomínio é gerado pela Cloudflare; overridável por env se um dia trocar pra domínio custom.
const PUBLIC_BASE = process.env.R2_PUBLIC_BASE ?? "https://pub-fe48d025c90f48428f377ce1b933d8dc.r2.dev"

function contentType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase()
  return ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png"
}

/**
 * Espelha `imagePath` (CDN SportMonks) em `mrtip/<key>` e devolve a URL pública (r2.dev).
 * Idempotente e barato em re-run: se a key já existe no bucket (HEAD 200), pula o download/upload.
 * `key` é o caminho dentro do bucket, ex.: "times/arsenal.png" ou "jogadores/alisson-129820.png".
 */
export async function uploadImagem(imagePath: string, key: string): Promise<string | null> {
  const publicUrl = `${PUBLIC_BASE}/${key}`

  // Pula se já está no bucket — deixa o re-run quase instantâneo.
  const head = await fetch(publicUrl, { method: "HEAD" })
  if (head.ok) return publicUrl

  const res = await fetch(imagePath)
  // 404 na origem = entidade sem imagem (comum em jogadores) → grava null, não quebra o sync.
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`imagem download ${imagePath} → ${res.status}`)
  const bytes = new Uint8Array(await res.arrayBuffer())

  const dir = join(tmpdir(), "mrtip-img")
  await mkdir(dir, { recursive: true })
  const file = join(dir, key.replace(/\//g, "_"))
  await writeFile(file, bytes)

  try {
    const proc = Bun.spawn(
      ["wrangler", "r2", "object", "put", `${BUCKET}/${key}`, `--file=${file}`, `--content-type=${contentType(key)}`, "--remote"],
      { env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID }, stdout: "pipe", stderr: "pipe" },
    )
    const code = await proc.exited
    if (code !== 0) {
      const err = await new Response(proc.stderr).text()
      throw new Error(`wrangler r2 put ${key} → exit ${code}\n${err}`)
    }
  } finally {
    await rm(file, { force: true })
  }

  return publicUrl
}

/** Remove um objeto do bucket (usado pra limpar keys antigas). Ignora se não existe. */
export async function deleteObjeto(key: string): Promise<void> {
  const proc = Bun.spawn(["wrangler", "r2", "object", "delete", `${BUCKET}/${key}`, "--remote"], {
    env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID },
    stdout: "ignore",
    stderr: "ignore",
  })
  await proc.exited
}
