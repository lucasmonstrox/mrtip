# Regulação BR de apostas — o que molda o produto mrtip

> Investigação (`/rs`, tier comparação/focado, main loop). As-of: **2026-06-18**. Tema cross-feature: o que a **Lei 14.790/2023** + **Portaria SPA/MF 1.231/2024** (e a fiscalização 2025-2026) exigem/proíbem que afeta o **design do produto** mrtip — não como rodapé jurídico, mas como regra de como picks/value-bets são apresentados e monetizados. Resolve parcialmente a decisão #8 da [visão](../visao-geral.md#15-decisões-em-aberto). Feature: [COMP-001](../features/conformidade/COMP-001-conformidade-jogo-responsavel.md).
> Rótulos: `verificado-fetch` · `snippet` (busca, não aberto) · `inferência`.

## TL;DR + recomendação cravada

A regulação BR **não é footnote — é restrição de produto de primeira ordem**, e bate de frente com o marketing-padrão do nicho ("90% de acerto", "renda extra"). Três regras duras: (1) **proibido prometer/insinuar ganho** — ganho fácil/garantido, "aposte grátis", aposta como **renda/investimento/solução financeira**, sucesso por habilidade extraordinária [`snippet`+`verificado-fetch`]; (2) **afiliado = quem é remunerado por resultado** (capta apostador/depósito) → se o mrtip monetiza por afiliação (modelo dominante do nicho, ver [panorama](../research/panorama-concorrentes.md)), **é afiliado e está sujeito às regras de publicidade**, com **responsabilidade solidária** do operador [`verificado-fetch`, Baptista Luz]; (3) **quem divulga operador NÃO autorizado responde pelos tributos** dele [`snippet`, iGaming Brazil 2026]. **Recomendação cravada:** o posicionamento de "honestidade auditável" do panorama **é também a estratégia de conformidade** — enquadrar tudo como **"probabilidade calibrada + risco explícito", nunca "lucro/renda"**; **+18 + jogo responsável como produto** (limites prudenciais, autoexclusão), **não rodapé**; e **só linkar/afiliar casas .bet.br licenciadas** (whitelist de operadores autorizados). A fiscalização está **ativa e mirando afiliados/influenciadores em 2026** — desenhar conservador.

---

## Contexto e brief

mrtip dá picks/insights/value-bets e (futuro) marketplace de tipsters — atividades que esbarram na publicidade de apostas regulada. Brief: o que é proibido afirmar? disclaimers? o mrtip (conteúdo/tips, não-operador) é alcançado? jogo responsável como requisito? riscos pro discurso "value bet/EV+". Requisito implícito do repo: "sem promessa de ganho" já está na [visão §13](../visao-geral.md#13-riscos-e-considerações).

## Estado real no código
**Greenfield** — não há gate +18, disclaimer, limites de RG nem whitelist de operadores. A [visão §13](../visao-geral.md#13-riscos-e-considerações) já lista jogo responsável/+18/sem-promessa como risco a endereçar; o [plano DOS-001](../planos/DOS-001-dossie-por-partida.md) prevê que "gate +18/disclaimer é camada de produto futura, schema preparado". Esta investigação dá o conteúdo dessa camada.

## Estado da arte / regras (claims atômicos)

- **Proibido sugerir ganho fácil/sucesso.** Portaria 1.231: comunicação não pode "sugerir ganho fácil ou associar a ideia de sucesso ou habilidades extraordinárias", nem usar celebridades implicando que apostar traz sucesso pessoal/social/financeiro [`snippet`, LegisWeb/gov.br]. 2025: vedados "ganhos garantidos", "aposte grátis", "solução de problemas financeiros" e estímulo à impulsividade [`snippet`, CONAR/Migalhas].
- **Aposta ≠ renda/investimento.** Lei 14.790 veda apresentar aposta como "fonte de renda adicional ou forma de investimento" [`snippet`/prior-session planalto — reverificar no texto integral]. **Impacto direto no discurso "value bet/EV+".**
- **Afiliado definido e responsabilizado.** Portaria 1.231 define **afiliado** como quem faz publicidade para operador "mediante compensação atrelada a resultados" (capta apostadores/depósitos) — abrange criador de conteúdo com rev-share; "os agentes são **solidariamente responsáveis** pelos anúncios dos afiliados" [`verificado-fetch`, Baptista Luz].
- **Identificação publicitária obrigatória.** Anúncio por afiliado/influenciador/"embaixador" exige menção explícita: "publicidade", "parceria paga" ou similar [`snippet`, iGaming Brazil 2026].
- **Responsabilidade tributária por operador ilegal.** Quem divulgar operador **não autorizado** pode responder solidariamente pelos tributos devidos; SPA já fez 1.500+ notificações, ~400 perfis removidos [`snippet`, iGaming Brazil/PlatôBR 2026].
- **Cláusula de advertência.** Aviso de jogo responsável ≥ **10%** do tamanho/duração da peça, falado e escrito quando o meio permitir [`snippet`, Souto Correa/Baptista Luz].
- **Jogo responsável é mecanismo, não aviso.** Operador deve oferecer **limites prudenciais** (tempo, perda financeira, depósito, nº de apostas; diário/semanal/mensal) e **autoexclusão simplificada**; vedada "chamada para ação sugerindo ato imediato" [`verificado-fetch` Baptista Luz + `snippet`]. Fiscalização/sanções desde 01/01/2025.
- **Paisagem móvel (2026).** Fazenda revisa as normas de **afiliados/influenciadores no 1º tri/2026**; Senado discute **vedar imagem de atletas/influenciadores** em publicidade. Risco regulatório em movimento [`snippet`, iGaming Brazil/Estratégia 2026].

## Implicações de produto (a entrega — regras pro mrtip)
1. **Linguagem dos picks/value-bets:** banir "lucro", "renda", "ganho garantido", "aposta certa", "EV+ = dinheiro". Usar **"probabilidade calibrada", "estimativa", "valor esperado positivo com risco"**, sempre com incerteza explícita. → o diferencial de **honestidade** do [panorama](../research/panorama-concorrentes.md) **é** a conformidade.
2. **Gate +18** na entrada + **disclaimer de jogo responsável** nativo (≥10% em peças de marketing).
3. **Jogo responsável como feature:** limites prudenciais + autoexclusão + sem call-to-action impulsivo (COMP-001).
4. **Whitelist de operadores licenciados (.bet.br):** só linkar/afiliar casas autorizadas — evita responsabilidade tributária solidária. (Bônus: resolve parte do problema de odds BR — as casas .bet.br são exatamente o mercado-alvo do SIN-012/DOS-001.)
5. **Rotular publicidade:** picks patrocinados/afiliados marcados como "publicidade/parceria paga".
6. **Histórico de acerto ≠ promessa:** o histórico auditável (diferencial do produto) deve ser apresentado como **desempenho passado sem garantia futura**.

## Riscos e gotchas
1. **"value bet/EV+" pode ser lido como promessa de renda/investimento** — o conceito central do produto é o de maior risco de linguagem. Mitigar com enquadramento de probabilidade+risco e revisão jurídica.
2. **Modelo de monetização define o enquadramento:** afiliação atrelada a resultado = afiliado regulado; assinatura SaaS pura tem exposição diferente. Decisão de produto com efeito legal.
3. **Responsabilidade solidária tributária** se linkar operador ilegal — whitelist é obrigatória, não opcional.
4. **Regras em revisão (2026)** — desenhar conservador; o que é permitido hoje pode endurecer.
5. **Fiscalização ativa mirando afiliados/influenciadores** — não é risco teórico.

## Refutado (com evidência)
- **"mrtip é só conteúdo/tips, a regulação de publicidade não o alcança"** — REFUTADO: se monetiza por afiliação atrelada a resultado, **é afiliado** sujeito às regras, e responde solidariamente por divulgar operador não-licenciado [`verificado-fetch` Baptista Luz + `snippet`].
- **"Disclaimer no rodapé resolve"** — REFUTADO (parcial): aviso exige ≥10% + falado/escrito, e jogo responsável é **mecanismo obrigatório** (limites/autoexclusão), não só texto [`snippet`+`verificado-fetch`].
- **"Pode vender o pick como renda extra/lucro"** — REFUTADO: vedado apresentar aposta como renda/investimento e sugerir ganho fácil [`snippet`].

## Perguntas Abertas / lacunas
- **Texto integral da Lei 14.790 e da Portaria 1.231** (`verificação parcial`) — a nota oficial gov.br não abriu (homepage JS); confirmar a redação literal da proibição "renda/investimento" e do art. de afiliados no Planalto/DOU antes de cravar copy.
- **Novas normas de afiliado/influenciador (1º tri 2026)** (`NEI`) — ainda não publicadas; monitorar.
- **Enquadramento exato do mrtip** (afiliado × veículo × plataforma de tips) — depende do modelo de monetização final (decisão de produto + parecer jurídico).
- **CONAR self-regulation** — diretrizes específicas não fetchadas em detalhe.
- **Counter-review independente** não rodou (limite de sessão nos subagentes).

## Evidências decisivas
- [web] https://baptistaluz.com.br/publicidade-de-apostas-novidades-da-portaria-spa-mf-n-1-231-2024/ — `verificado-fetch`: afiliado = compensação por resultado; responsabilidade solidária; vedada call-to-action de ato imediato.
- [web] https://www.legisweb.com.br/legislacao/?id=462714 — texto da Portaria SPA/MF 1.231/2024 (`snippet`).
- [web] https://www.gov.br/fazenda/.../nova-portaria-da-fazenda-...-publicidade-abusiva — operador responde por publicidade abusiva de influenciador (`snippet`; fetch caiu na homepage, reverificar).
- [web] https://igamingbrazil.com/legislacao/2026/02/19/ministerio-da-fazenda-prioriza-fiscalizacao-da-publicidade-de-bets-e-mira-influenciadores-em-2026/ — fiscalização mira afiliados/influenciadores; responsabilidade tributária por operador ilegal (`snippet`).
- [web] http://www.conar.org.br/pdf/conar-regras-apostas-folder-web.pdf — diretrizes CONAR de publicidade de apostas (`snippet`).
- [doc] docs/research/panorama-concorrentes.md — honestidade/jogo-responsável-como-produto é diferencial E conformidade.
