import type { NextConfig } from "next"
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
}

export default nextConfig

// Habilita os bindings da Cloudflare (via getCloudflareContext) durante `next dev`.
initOpenNextCloudflareForDev()
