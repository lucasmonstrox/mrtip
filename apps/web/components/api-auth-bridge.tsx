"use client"

import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"

import { setApiAuthTokenGetter } from "@/shared/api/eden"

/**
 * Ponte sessão Clerk → cliente Eden: registra o getToken() pra todo request da
 * API sair com Authorization: Bearer. Montar 1× dentro do ClerkProvider.
 */
export function ApiAuthBridge() {
  const { getToken } = useAuth()

  useEffect(() => {
    setApiAuthTokenGetter(() => getToken())
  }, [getToken])

  return null
}
