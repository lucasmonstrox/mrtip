# Debugging de UI com chrome-devtools MCP

Apoio do `/bug` — carregue só quando a triagem apontar bug de navegador. Tools com prefixo `mcp__chrome-devtools__`.

## Receita de triagem UI (ordem fixa, do barato ao profundo)

`navigate_page` (url) → `take_snapshot` (árvore a11y com uids — é o que se LÊ; screenshot é só evidência visual) → `list_console_messages` com `types: ["error","warn"]` → `list_network_requests` com `resourceTypes: ["fetch","xhr"]` → só então `evaluate_script`.

- Nunca conclua de snapshot precoce: após a ação, `wait_for` com `text: ["<esperado>", "<texto de erro>"]` e `timeout: 5000` ANTES do snapshot — caiu no erro = o bug; timeout = loading infinito (vá pra network).
- "Às vezes some" → `navigate_page` com `type: "reload", ignoreCache: true`: sumiu com hard reload = cache, não código.
- Erro que some num redirect (login, action com redirect): `list_console_messages` com `includePreservedMessages: true` recupera mensagens das últimas navegações; stack completo de uma mensagem → `get_console_message` com o `msgid`.

## Chamada de API falhando

`list_network_requests` → pegue o `reqid` da request ruim → `get_network_request`; body grande → `responseFilePath`/`requestFilePath` pra salvar em disco e ler com Read. Compare o payload REAL com o que o schema/handler da rota espera (validação de runtime: ver `bun.md`).

## Race de rede intermitente

`emulate` com `networkConditions: "Slow 3G"` e `cpuThrottlingRate: 4` pra alargar a janela da race → repita a ação → `list_network_requests`: duas requests iguais pro mesmo endpoint = double-fetch/sem abort. Desfaça com `cpuThrottlingRate: 1` e `networkConditions` default ao final.

## Reproduzir o contexto exato do usuário

`emulate` — `colorScheme: "dark"` (bug de tema), `extraHttpHeaders: '{"x-debug":"1"}'` (header custom que vai em TODA request da página), `geolocation`. Limpe ao final (`colorScheme: "auto"`, `extraHttpHeaders: ""`).

## Hydration mismatch (React 19)

O React 19 emite UM erro consolidado com DIFF server/client ("Hydration failed because the server rendered HTML didn't match the client") — leia o diff, não o stack: o nó com +/- é a evidência primária. No componente apontado: `rg "typeof window|Date\.now\(|Math\.random\(|toLocale|new Date\("`. Pra cravar a causa: re-navegue congelando o suspeito via script de init (ex.: `Date.now = () => 1700000000000`) — sumiu, achou. Teste de isolamento (não fix): `suppressHydrationWarning` no nó. Extensão de navegador sujando o DOM? Rode o MCP com `--isolated`.

## Tool do MCP pendurada

Provável dialog pendente: `handle_dialog` com `action: "accept"` antes de matar o navegador. Fluxo que dispara confirm de propósito → antecipe com `dialogAction: "accept"` no `evaluate_script` e `handleBeforeUnload: "accept"` no `navigate_page`.

## Gotchas deste repo

1. `browser already running` → mate os processos Chrome do profile do MCP (ou suba com `--isolated`); em loop, dirija por CDP puro (`claude-cdp/cls-check.ts`).
2. Confirme a PORTA real no banner do turbo (TUI do `bun run dev`) antes do `navigate_page` — não chute 3000.
3. `fill` em `<input type=time>`/input controlado não dispara onChange — use `evaluate_script` com o native setter: `Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(el, v); el.dispatchEvent(new Event('input', {bubbles: true}))`.
4. HTTP 431 = cookie bloat do localhost, não bug do app — confirme o tamanho do header Cookie via `get_network_request`; limpe dados de site ou rode `--isolated`.
