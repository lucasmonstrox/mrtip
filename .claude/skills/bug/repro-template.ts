/**
 * Template de reprodução mínima pro /bug — exit 0 = comportamento bom, exit 1 = bug presente.
 * Nesse formato o script serve direto de detector pro `git bisect run bun tmp-repro.ts`.
 *
 * Copie pro app afetado (ex.: tmp-repro.ts na raiz do app afetado), preencha SETUP/AÇÃO/ASSERT
 * e rode com `bun tmp-repro.ts`. Apague ao final — a versão definitiva vira teste de regressão
 * na pasta da feature.
 */

// SETUP — o mínimo de estado pro bug existir. Bug de dado: cole aqui o row_to_json REAL do banco,
// nunca fixture bonita.
// import { calcularEV } from "../packages/core/src/odds"
const input = {} as unknown

// AÇÃO — um único caminho, uma única variável.
const resultado = input // await suaFuncao(input)

// ASSERT — a pergunta binária que este detector responde (escreva-a no comentário).
// Pergunta: "<o valor X já chega errado aqui? S/N>"
const ok = resultado !== undefined // troque pela condição que define "bom"

if (!ok) {
  console.error("BUG presente:", JSON.stringify(resultado))
  process.exit(1)
}
console.log("ok")
process.exit(0)
