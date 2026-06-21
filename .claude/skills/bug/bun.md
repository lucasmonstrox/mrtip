# Debugging de Bun (runtime)

Apoio do `/bug` — carregue só quando a triagem apontar bug de runtime/API/processo. (Há uma camada de API dedicada com framework próprio? Acrescente os gotchas dela aqui quando ela existir.)

## Bun — observar e isolar

- **Chamada a API externa (provedor de stats/odds, LLM)**: `BUN_CONFIG_VERBOSE_FETCH=curl bun run dev` — todo fetch/node:http sai como comando curl copiável + headers de ida (`[fetch] >`) e volta (`[fetch] <`). Re-execute o curl isolado: separa bug nosso × bug da API externa (fonte fora do ar, contrato mudou, rate limit).
- **Breakpoint de verdade**: `bun --inspect-brk src/index.ts` e abra a URL `https://debug.bun.sh/#...` impressa (protocolo WebKit — `chrome://inspect` NÃO conecta). Bug no startup → `--inspect-wait`. Dentro de teste: `bun test --inspect-brk ./repro.test.ts -t "nome"` + `debugger;` na linha suspeita.
- **Afunilar teste**: `bun test ./arquivo.test.ts -t "trecho do nome"` (regex) ou `test.only()` + `--only`; teste que "trava" com rede/LLM → `--timeout 30000` distingue lento × deadlock (default 5000); `--bail` para na 1ª falha; `--rerun-each 50` é o detector de flaky.
- **GOTCHA de versão**: `--randomize`/`--seed`/`--retry`/`--concurrent` são bun 1.3+ — o repo roda **1.2.20** (`unknown option`). Antes de sugerir flag de doc, `bun test --help | grep <flag>`. Dependência de ordem em 1.2: rode os arquivos isolados vs suite inteira e compare.
- Saída do `bun test` "cortada" (sem listar os que passam) não é bug: Bun detecta `CLAUDECODE=1` e mostra só falhas. Ver tudo: `CLAUDECODE= bun test ...`.
- **Repro de 1 linha**: `bun -e "import { x } from './packages/...'; console.log(x(...))"`. Objeto fundo truncado em `[Object]` → `bun --console-depth 8` ou `Bun.inspect(obj, { depth: 10 })`.
- `bun why <pacote>` (cadeia de dependência) e mapa de compat Bun×Node: ver §5 do `/bug`.

## Compat Bun × Node

- Pacote alega "works on Node" mas quebra no Bun? Mapa oficial: https://bun.com/docs/runtime/nodejs-apis. Suspeitos clássicos: `node:http` bufferiza request body (streaming/proxy quebram sutil), `worker_threads` incompleto, `child_process` sem socket por IPC.
- Confirme com a MESMA repro isolada em `bun x.ts` vs `node x.js` — divergiu = gap de runtime, não bug nosso. A repro mínima fora do app separa "bug nosso de uso" × "bug deles".
