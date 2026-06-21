import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// Cache pode ser configurado aqui (KV/R2 incremental cache, tag cache, queue).
// Docs: https://opennext.js.org/cloudflare/caching
const config = defineCloudflareConfig()

export default {
  ...config,
  // Next 16 usa Turbopack por padrão no `next build`, mas o OpenNext precisa do
  // build standalone (webpack) — senão dá ChunkLoadError no runtime do Worker.
  buildCommand: "next build --webpack",
}
