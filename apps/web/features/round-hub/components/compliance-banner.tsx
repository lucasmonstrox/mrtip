import { AlertTriangleIcon } from "lucide-react"

// Faixa de jogo responsável — obrigatória por Lei 14.790/2023 em toda superfície ligada a apostas.
// É identidade, não rodapé escondido: fica sticky no topo da página. Texto pendente de revisão jurídica.
export function ComplianceBanner() {
  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[11px] text-amber-700 backdrop-blur md:px-6 dark:text-amber-300">
      <AlertTriangleIcon className="size-3.5 shrink-0" />
      <span className="font-semibold">+18 · Aposte com responsabilidade.</span>
      <span className="text-amber-700/80 dark:text-amber-300/80">
        Apostas envolvem risco de perda financeira e podem causar dependência. Análise não é garantia de resultado.
      </span>
      <a href="/jogo-responsavel" className="ml-auto shrink-0 font-medium underline underline-offset-2">
        Jogo responsável
      </a>
    </div>
  )
}
