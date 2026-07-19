import { t } from "elysia"

// Query da rota de auditoria: `runId` opcional escolhe UMA run específica do prognóstico daquela
// partida; sem ele a rota devolve a run mais recente (mesmo critério da aba). Uuid validado na borda.
// @feature MOD-011
export const prognosisAuditQuery = t.Object({
  runId: t.Optional(t.String({ format: "uuid", error: "invalid_run_id" })),
})
