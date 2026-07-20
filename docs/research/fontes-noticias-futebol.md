# Fontes de Notícia de Futebol — delta 2026-07

Catálogo de **veículos que publicam texto noticioso sobre futebol**, levantado para alimentar a camada de evidência narrativa do mrtip (lesão, desfalque, suspensão, clima de vestiário, coletiva, viagem, motivação). O critério de inclusão é *publica notícia*, não *mostra placar* — um portal que só exibe resultado não move um prognóstico; um que publica "titular treinou separado" move.

## O que este arquivo é (e o que não é)

Este é um **delta**, não um catálogo do zero. O repo já tinha [`sites-futebol-masculino.md`](./sites-futebol-masculino.md) e [`sites-futebol-masculino.csv`](./sites-futebol-masculino.csv) com **852 domínios únicos**. Este levantamento rodou por cima daquela base e lista apenas o que **não estava lá**.

| Medida | Valor |
|---|---|
| Baseline pré-existente | 852 domínios |
| Colhidos neste levantamento | 612 únicos |
| Já presentes na baseline | 219 |
| **Novos (listados abaixo)** | **393** |
| **União total do repo** | **1245** |

## Método

82 agentes Claude Sonnet em workflow paralelo, particionados numa matriz `região × categoria` de 56 células, seguidos de 4 agentes críticos de completude e 22 agentes de preenchimento de lacuna.

A partição é o que dá valor ao fan-out: 56 agentes com o mesmo prompt convergiriam para o mesmo top-20. Com células disjuntas, a sobreposição interna ficou em **~15%** (596 brutos → 508 únicos na varredura), contra os 70–80% esperados de um fan-out não particionado.

**Verificação:** cada site precisou aparecer num resultado de busca ao vivo (`WebSearch`), e o agente registrou a query que o trouxe. `WebFetch` foi testado e **recusado** por vários domínios grandes (`ge.globo.com` bloqueou), então não houve HEAD-check de URL — a busca ao vivo é a única trava contra domínio alucinado. **As URLs não foram validadas por requisição HTTP.**

## Limitações conhecidas

Reportadas explicitamente para não superestimar a cobertura:

- **Alemanha praticamente ausente (3 sites).** As células `ger-mainstream` e `ger-analise-club` voltaram quase vazias, e o agente de preenchimento `alemanha-bundesliga` também falhou. Kicker, Bild Sport, Sport1 e Sportschau **não** foram capturados. É buraco real e precisa de rodada manual.
- **Itália (9) e Portugal (6) subcobertos** para o peso das suas ligas.
- **26 dos 82 agentes retornaram resultado vazio.** Não houve erro de execução (0 falhas), mas ~32% do fan-out não produziu dado — o custo real por site útil é maior que o nominal.
- O campo `has_rss` ficou majoritariamente `desconhecido`: os agentes não testaram feeds. **Nenhuma conclusão sobre ingestibilidade** pode ser tirada daqui.
- Sem verificação de paywall, `robots.txt` ou viabilidade de scraping. Este é um mapa de *existência*, não de *acesso*.

## Leitura dos dados

Dos 393 novos, **185 são do Brasil** — quase dois terços. A baseline de 852 tinha ~41 entradas brasileiras contra ~62 inglesas e 154 globais: o buraco não era o tamanho do catálogo, era a profundidade no mercado de casa.

| Categoria | Novos |
|---|---|
| `clube-torcida` | 75 |
| `nicho` | 72 |
| `jornal-tradicional` | 63 |
| `esporte-dedicado` | 44 |
| `apostas-odds` | 25 |
| `portal-generalista` | 25 |
| `tatico-analise` | 24 |
| `jornalista-individual` | 15 |
| `transferencias` | 11 |
| `podcast-video` | 11 |
| `agencia-noticias` | 11 |
| `estatisticas-dados` | 8 |
| `orgao-disciplinar-oficial` | 7 |
| `agregador-rss` | 2 |

`clube-torcida` na liderança é o achado com mais valor por item: são fontes que cobrem um único clube em profundidade, publicam bastidor de CT e raramente aparecem em catálogo global. Também são as de pior infraestrutura técnica (sem RSS, HTML instável). Maior sinal, maior custo de ingestão.

## Legenda

**Tier 1** = referência nacional/grande · **Tier 2** = sólido/secundário · **Tier 3** = nicho/especialista

## Brasil (187)

### Brasil (185)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| A Crítica | `acritica.com` | 1 | jornal-tradicional | Principal jornal de Manaus, com seção de esportes cobrindo o Campeonato Amazonense |
| A Tarde - Esportes (E.C. Bahia) | `atarde.com.br` | 1 | jornal-tradicional | Jornal tradicional baiano com editoria dedicada ao Bahia: jogos, entrevistas, bastidores e vídeos |
| Blog do Diogo Dantas (O Globo) | `oglobo.globo.com/blogs/diogo-dantas` | 1 | jornalista-individual | Blog dedicado a bastidores de clubes e da seleção brasileira e notícias exclusivas de mercado |
| Blog do Juca Kfouri | `blogdojuca.uol.com.br` | 1 | jornalista-individual | Coluna histórica de opinião, política do futebol e bastidores, decano do jornalismo esportivo brasileiro |
| Brasileirão.com.br | `brasileirao.com.br` | 1 | nicho | Portal dedicado ao Campeonato Brasileiro com categoria própria de notícias para a Série C |
| CBF | `cbf.com.br` | 1 | agencia-noticias | Fonte oficial de tabela, súmulas e comunicados institucionais do Brasileirão |
| Correio (Correio 24 Horas) - Esportes | `correio24horas.com.br` | 1 | jornal-tradicional | Jornal tradicional de Salvador com cobertura do Ba-Vi: escalações, arbitragem, bastidores do clássico |
| Correio Braziliense - Esportes | `correiobraziliense.com.br` | 1 | jornal-tradicional | Caderno de esportes do jornal tradicional de Brasília, com cobertura de futebol nacional, bastidores, transferências e coletivas. |
| Diario de Pernambuco - Esportes DP | `diariodepernambuco.com.br` | 1 | jornal-tradicional | Jornal tradicional de Pernambuco cobrindo Sport, Náutico e Santa Cruz: protestos de torcida, clássicos, bastidores |
| Dibradoras | `dibradoras.com.br` | 1 | esporte-dedicado | Maior portal de conteudo de esportes femininos do Brasil, com forte cobertura de futebol feminino |
| Estado de Minas - Esportes | `em.com.br` | 1 | jornal-tradicional | Caderno de esportes do jornal tradicional mineiro Estado de Minas, com notícias de futebol e colunistas próprios. |
| Estadão — Esportes | `estadao.com.br` | 1 | jornal-tradicional | Redação de um dos três maiores jornais do Brasil; colunas explicitamente dedicadas a bastidores e negócios do esporte (Marcel Rizzo, Rodrigo Capelo... |
| Folha de Pernambuco - Esportes | `folhape.com.br` | 1 | jornal-tradicional | Jornal pernambucano com editorias dedicadas a Sport, Náutico e Vitória: jogos, clássicos, contratações |
| Folha de S.Paulo — Esporte | `folha.uol.com.br` | 1 | jornal-tradicional | Redação de um dos três maiores jornais do Brasil; colunas de bastidor e análise (Tostão, PVC, Mônica Bergamo cobrindo política de clube/estádio, Bá... |
| GZH (Gaúcha Zero Hora) - Grêmio/Internacional | `gauchazh.com.br` | 1 | jornal-tradicional | Jornal tradicional gaúcho com newsletters e colunistas dedicados a Grêmio e Internacional separadamente |
| Gazeta Digital | `gazetadigital.com.br` | 1 | jornal-tradicional | Portal do Grupo Gazeta de Comunicação, referência em notícias e esportes de Mato Grosso |
| Gazeta do Povo | `gazetadopovo.com.br` | 1 | jornal-tradicional | Jornal tradicional de Curitiba/PR; sua editoria de esportes e futebol paranaense e publicada sob a marca irma Um Dois Esportes, linkada no rodape d... |
| ND Mais | `ndmais.com.br` | 1 | portal-generalista | Portal catarinense com editorias regionais (Grande Florianópolis, Joinville, Vale do Itajaí, Chapecó/Oeste, Criciúma/Sul, Lages) e editoria de Espo... |
| NSC Total | `nsctotal.com.br` | 1 | portal-generalista | Maior portal catarinense (fusão de Diário Catarinense, A Notícia e Hora de Santa Catarina, Grupo RBS/NSC), com editoria de Esporte e canais regiona... |
| O Popular | `opopular.com.br` | 1 | jornal-tradicional | Principal jornal de Goiânia, com cobertura de Goiás EC, Vila Nova e Atlético-GO |
| Olhar Direto | `olhardireto.com.br` | 1 | portal-generalista | Principal portal de notícias de Mato Grosso, com cobertura de Cuiabá EC e Mixto |
| Os Donos da Bola | `band.com.br` | 1 | podcast-video | Programa de mesa redonda diario da Band, apresentado por Neto, com debates, analises e bastidores do futebol (forte foco Rio de Janeiro) |
| Podpah | `podpah.com.br` | 1 | podcast-video | Maior fenomeno de podcast da internet brasileira, com entrevistas de bastidor com jogadores como Gabigol, Vampeta, Gil e Rodrigo Garro |
| Portal do Holanda | `portaldoholanda.com.br` | 1 | portal-generalista | Site mais acessado de Manaus e líder de audiência na região Norte, com cobertura de futebol amazonense |
| R7 Esportes | `r7.com` | 1 | portal-generalista | Editoria de esportes do portal da Record TV, cobrindo futebol, vôlei e F1 com forte presença em redes sociais |
| STJD - Superior Tribunal de Justiça Desportiva | `stjd.org.br` | 1 | orgao-disciplinar-oficial | Fonte oficial nacional: pautas de julgamento, súmulas, acórdãos/decisões e editais de processos contra jogadores/clubes no futebol brasileiro |
| Transfermarkt Brasil | `transfermarkt.com.br` | 1 | transferencias | Base de dados de referência para valores de mercado, transferências e rumores de jogadores do futebol brasileiro e mundial |
| ge (Globo Esporte) | `globoesporte.com` | 1 | esporte-dedicado | Portal de referência do Grupo Globo, reportagem própria em texto/foto/vídeo sobre todos os clubes e seleções |
| Banda B Esporte | `bandab.com.br` | 2 | esporte-dedicado | Rádio/portal de Curitiba com seções próprias para Athletico e Coritiba: mercado, coletivas, entrevistas exclusivas |
| BeSoccer Brasil | `pt.besoccer.com` | 2 | esporte-dedicado | Agregador internacional com seção de notícias de última hora para Série B e Campeonato Carioca |
| Bem Paraná | `bemparana.com.br` | 2 | jornal-tradicional | Jornal paranaense de Curitiba com editoria de Esportes propria; traz resumos de pausa de temporada detalhando lesoes, reforcos e jogadores recupera... |
| Betfair Apostas Brasil (blog) | `apostas.betfair.bet.br` | 2 | apostas-odds | Blog oficial da operadora licenciada Betfair no Brasil, com palpites e análises pré-jogo |
| Blog do Jorge Nicola | `jorgenicola.blogspot.com` | 2 | jornalista-individual | Furos de mercado, reforços e bastidores do dia a dia dos clubes paulistas |
| Blog do Nicola (R7) | `esportes.r7.com` | 2 | jornalista-individual | Coluna do jornalista Jorge Nicola com informações exclusivas de bastidores sobre contratações e finanças de clubes desde 2000 |
| Bolavip Brasil | `br.bolavip.com` | 2 | transferencias | Cobertura de mercado da bola por clube (Flamengo, Santos etc.), com detalhes de negociações em andamento |
| Botafogo Hoje | `botafogohoje.com.br` | 2 | clube-torcida | Negociações, bastidores do clube e análises táticas do Botafogo |
| CBF / Seleção Brasileira - Canal Oficial WhatsApp | `whatsapp.com/channel/0029vb89bi5fxuujjooyem1o` | 2 | clube-torcida | Canal oficial de WhatsApp da CBF com conteúdo diário exclusivo da Seleção: fotos, vídeos, bastidores e entrevistas |
| CBF Portal de Governança - Decisões | `portaldegovernanca.cbf.com.br` | 2 | orgao-disciplinar-oficial | Portal de compliance/governança da CBF com decisões institucionais, complementar ao STJD para questões éticas e disciplinares de dirigentes/entidades |
| Campo Delas | `campodelas.ig.com.br` | 2 | nicho | Portal dedicado ao futebol feminino: noticias, campeonatos, resultados e destaques |
| Cast FC | `castfc.com.br` | 2 | podcast-video | Podcast sobre futebol com celebridades do esporte, apresentado pelo jornalista Rodrigo Raposo |
| Central da Toca | `centraldatoca.com.br` | 2 | clube-torcida | Portal 'Cruzeiro o tempo todo': notícias, bastidores e conteúdo de torcida |
| Ciência da Bola | `cienciadabola.com.br` | 2 | tatico-analise | Análise de desempenho e análise tática aplicada ao futebol |
| Clube Náutico Capibaribe (site oficial) | `nautico-pe.com.br` | 2 | clube-torcida | Canal oficial do Náutico: contratações, renovações e comunicados do departamento de futebol |
| Clube da Aposta | `clubedaposta.com` | 2 | apostas-odds | Blog e canal Telegram de prognósticos esportivos com dicas e análises diárias |
| Criciúma Esporte Clube (site oficial) | `criciumaesporteclube.com.br` | 2 | clube-torcida | Canal oficial do Criciúma EC com Sala de Imprensa, elenco profissional detalhado por posição, comissão técnica e notícias de competições (Brasileir... |
| D24AM | `d24am.com` | 2 | portal-generalista | Portal de notícias do Amazonas com cobertura de futebol regional (Nacional, Fast, São Raimundo) |
| Desimpedidos | `desimpedidos.com.br` | 2 | podcast-video | Canal/podcast de futebol e humor com séries de bastidores (ex.: 'Vai pra cima Fred') e entrevistas com jogadores |
| Dezcafeinado | `dezcafeinado.substack.com` | 2 | nicho | Newsletter com resumo das principais notícias do futebol brasileiro e internacional, edições regulares e extras em datas de decisão |
| Diário Celeste | `diarioceleste.com.br` | 2 | clube-torcida | Cobertura diária e exclusiva do Cruzeiro (notícias, bastidores, mercado da bola) |
| Diário do Futebol - Transferências e Mercado | `diariodofutebol.com.br` | 2 | transferencias | Atualizações sobre negociações do futebol brasileiro, europeu e internacional: reforços, saídas e renovações de contrato |
| Diário do Peixe | `diariodopeixe.com.br` | 2 | clube-torcida | Notícias, dados históricos, entrevistas exclusivas e bastidores da Vila Belmiro (Santos) |
| EC Vitória Notícias | `ecvitorianoticias.com` | 2 | clube-torcida | Blog especializado exclusivamente no Esporte Clube Vitória com notícias e análises de partidas |
| ECBahia | `ecbahia.com` | 2 | clube-torcida | Maior site independente dedicado ao Esporte Clube Bahia: bastidores, elenco, notícias diárias do dia a dia do clube |
| Em Tempo | `emtempo.com.br` | 2 | jornal-tradicional | Jornal de Manaus com seção de esportes e cobertura do futebol amazonense |
| Esquemas Táticos | `esquemastaticos.com.br` | 2 | tatico-analise | Análise tática e estatística de times e competições (Brasileirão, Libertadores, Champions League, MLS) |
| Explosão Tricolor | `explosaotricolor.com.br` | 2 | clube-torcida | Notícias, colunas e conteúdo exclusivo sobre o Fluminense |
| Fortaleza Esporte Clube (site oficial) | `fortaleza1918.com.br` | 2 | clube-torcida | Canal oficial do Fortaleza: técnico, retorno de jogadores, sub-20, luta contra rebaixamento |
| Fut das Minas | `futdasminas.com.br` | 2 | nicho | Portal de noticias sobre futebol feminino no Brasil e no mundo, selecao e ligas |
| FutGalo | `futgalo.com.br` | 2 | clube-torcida | Notícias diárias do Atlético Mineiro (Galo): resultados, entrevistas, reação da torcida |
| Futebol Baiano | `futebolbaiano.com.br` | 2 | nicho | Cobertura dedicada ao Campeonato Baiano, Bahia, Vitória e futebol do interior baiano com jogos ao vivo |
| Futebol Interativo | `futebolinterativo.com` | 2 | tatico-analise | Blog de tática, análise de desempenho, preparação física, base e futebol feminino |
| Joinville Esporte Clube (site oficial) | `jec.com.br` | 2 | clube-torcida | Canal oficial do JEC com notas oficiais, notícias de elenco (chegadas/saídas/empréstimos), resultados de Copa do Brasil e Catarinense, e comunicado... |
| Jornal Opção | `jornalopcao.com.br` | 2 | jornal-tradicional | Jornal goiano com cobertura de futebol e bastidores dos clubes de Goiânia |
| Jovem Nerd Esporte Clube (JNEC) | `jovemnerd.com.br` | 2 | podcast-video | Podcast de futebol do Jovem Nerd com cobertura de bastidores, humor e opinião sobre seleção e clubes brasileiros |
| Jovem Pan Esportes | `jovempan.com.br` | 2 | portal-generalista | Debates e opiniões de bastidor ligados à rádio/TV Jovem Pan, forte em conteúdo de áudio e vídeo sobre futebol nacional |
| Lance! Diário da Copa | `lance-newsletter.beehiiv.com` | 2 | nicho | Newsletter diária do portal Lance dedicada à Copa do Mundo, bastidores e resultados enviados às 7h07 |
| Legalbet Brasil | `legalbet.com.br` | 2 | apostas-odds | Odds, análises e melhores apostas de futebol com foco no mercado brasileiro regulado |
| Mauro Cezar Pereira (canal) | `youtube.com/c/maurocezar` | 2 | jornalista-individual | Análise crítica e bastidores de clubes, federações e seleção, com opinião dura |
| Meiocampo | `newsletter.meiocampo.net` | 2 | tatico-analise | Newsletter de análise tática e narrativa histórica de futebol (decisões de treinador, arcos de jogador), por Felipe Lobo e Bruno Bonsanti |
| Mercado da Bola (mercadodabola.net.br) | `mercadodabola.net.br` | 2 | transferencias | Portal 100% dedicado ao vai-e-vem do futebol brasileiro, com odds e análises diárias de contratações |
| Meu Botafogo | `meubotafogo.com.br` | 2 | clube-torcida | Notícias e análises táticas do Botafogo, incluindo mudanças de esquema durante os jogos |
| Meu São Paulo | `meusaopaulo.com.br` | 2 | clube-torcida | Notícias, rumores de mercado e cobertura diária exclusiva do Tricolor Paulista |
| Meu Tigrao | `meutigrao.com.br` | 2 | clube-torcida | Site de noticias dedicado ao Criciuma EC (operado por MediaTec Sports), cobre reforcos, desfalques/ausencias de jogadores e cenarios de acesso |
| Meu Vozão | `meuvozao.com` | 2 | clube-torcida | Site dedicado ao Ceará Sporting Club: jogos, elenco, estatísticas e humor da torcida |
| MeuSport | `meusport.com` | 2 | clube-torcida | Notícias do Sport Club do Recife com cobertura detalhada do Campeonato Pernambucano e desfalques por lesão/DM |
| Nosso Flu | `nossoflu.com.br` | 2 | clube-torcida | Cobertura do Fluminense: jogos, resultados, transferências e bastidores do clube |
| Nosso Palestra | `nossopalestra.com.br` | 2 | clube-torcida | Notícias diárias, análises e opiniões sobre o Palmeiras |
| Notícias do Athletico | `noticiasdoathletico.com.br` | 2 | clube-torcida | Portal de notícias diárias do Athletico Paranaense (Furacão): jogos, contratações, bastidores |
| O Tempo - Sports | `otempo.com.br` | 2 | jornal-tradicional | Caderno de esportes do jornal mineiro O Tempo, com cobertura extensa e diária de Atlético-MG e Cruzeiro. |
| Olhar Esportivo | `olharesportivo.com.br` | 2 | esporte-dedicado | Especializado em esporte mato-grossense, cobertura de Cuiabá EC e clubes locais |
| Orgulho Dourado | `orgulhodourado.com.br` | 2 | clube-torcida | Site 'setorista' dedicado exclusivamente ao Cuiaba EC, cobertura de bastidores, coletivas do tecnico, mercado da bola e reacao da torcida a decisoe... |
| Portal Cruzeirense | `portalcruzeirense.com.br` | 2 | clube-torcida | Notícias do Cruzeiro, mercado da bola e desfalques/lesões |
| Portal NE9 | `ne9.com.br` | 2 | nicho | Portal regional nordestino com cobertura da representação da região nas Séries C e D do Brasileirão |
| Portal do Gremista | `portaldogremista.com.br` | 2 | clube-torcida | Maior portal independente dedicado ao Grêmio: bastidores, diretoria, mercado, atritos internos, coletivas |
| Portal do Palestra | `portaldopalestra.com.br` | 2 | clube-torcida | Cobertura de departamento médico, desfalques e reapresentações do Palmeiras |
| Portal do Palmeirense | `portaldopalmeirense.com.br` | 2 | clube-torcida | Notícias, salários e mercado do Palmeiras |
| RDNews | `rdnews.com.br` | 2 | jornal-tradicional | Jornal de Rondonópolis (MT) com cobertura esportiva regional |
| SBT Sports | `sports.sbt.com.br` | 2 | portal-generalista | Cobertura de Brasileirão e Copa do Mundo integrada à programação esportiva do SBT (Galvão FC, transmissões) |
| SCInter | `scinter.com.br` | 2 | clube-torcida | Notícias do Internacional com foco em bastidores de negociações e pressão interna no Beira-Rio |
| SPFC.Net | `spfc.net` | 2 | clube-torcida | Cobertura diária e artigos exclusivos sobre o São Paulo FC |
| SPNet - O Portal da Torcida Tricolor | `saopaulofc.com.br` | 2 | clube-torcida | Portal pioneiro da torcida do São Paulo FC desde 1996, colunistas e entrevistas exclusivas |
| Santa Cruz Futebol Clube (site oficial) | `santacruzpe.com.br` | 2 | clube-torcida | Canal oficial do Santa Cruz: seção Torcedor Coral, comunicados e notícias do Cobra Coral |
| Sites de Apostas (SDA) | `sites-de-apostas.net` | 2 | apostas-odds | Agregador de palpites diários e reviews de casas de apostas para o público brasileiro |
| SouFortaleza | `soufortaleza.com` | 2 | clube-torcida | Portal dedicado ao Fortaleza com atualizações diárias sobre elenco, técnico e resultados |
| São Paulo Blog | `saopaulo.blog` | 2 | clube-torcida | Notícias, análises e conteúdo exclusivo sobre o São Paulo FC |
| São Paulo Sempre (Daniel Perrone) | `saopaulosempre.com.br` | 2 | jornalista-individual | Blog de referência entre torcedores do São Paulo FC, escrito pelo jornalista Daniel Perrone |
| TJD-RJ (Tribunal de Justiça Desportiva do Futebol do Rio de Janeiro) | `tjdrj.org.br` | 2 | orgao-disciplinar-oficial | Órgão disciplinar estadual do Rio de Janeiro: decisões das 6 comissões disciplinares regionais e do pleno, publicadas como notícias de caso |
| Torcida Digital | `torcidadigital.com.br` | 2 | clube-torcida | Plataforma cross-club de comunidade de torcedores com pagina dedicada por clube (inclusive Juventude, Criciuma, Cuiaba, Atletico-GO, Goias), com no... |
| Tribuna do Paraná | `tribunapr.com.br` | 2 | jornal-tradicional | Diario de Curitiba/PR; editoria de esportes exibida sob a marca Um Dois Esportes mas com pauta propria sobre promessas e ex-jogadores do Athletico |
| Trivela | `trivela.substack.com` | 2 | nicho | Newsletter semanal de jornalismo analítico sobre futebol brasileiro (seleção, Brasileirão, transferências) com profundidade crítica, não breaking news |
| Tudo Timão | `tudotimao.com.br` | 2 | clube-torcida | Notícias diárias, contratações, jogos e resultados do Corinthians |
| Vamos Dourado | `vamosdourado.com` | 2 | clube-torcida | Site de noticias dedicado ao Cuiaba Esporte Clube, tabela e cobertura diaria do time |
| Venê Casagrande (perfil/coluna) | `x.com/venecasagrande` | 2 | jornalista-individual | Furos sobre seleção brasileira e mercado da bola, comentarista de TV |
| Venê Casagrande - Canal Telegram | `t.me/venecasagrande` | 2 | jornalista-individual | Perfil oficial do jornalista Venê Casagrande no Telegram com furos e bastidores do mercado da bola |
| Verdão Web | `verdaoweb.com.br` | 2 | clube-torcida | Notícias, mercado da bola e desfalques/lesões do Palmeiras |
| Yahoo Esportes Brasil | `esportes.yahoo.com` | 2 | portal-generalista | Análises de mercado da bola e podcasts (Segunda Bola, Jorge Nicola) dentro do portal global Yahoo em versão BR |
| Zeiro | `zeiro.com.br` | 2 | clube-torcida | Notícias do Cruzeiro com colunas de opinião ('Coluna Celeste') citando jornalistas sobre diretoria e elenco |
| iG Esporte | `esporte.ig.com.br` | 2 | portal-generalista | Notícias, entrevistas e bastidores de futebol brasileiro dentro do portal generalista iG |
| Agora RS - Juventude | `agorars.com` | 3 | nicho | Portal regional do Rio Grande do Sul com secao dedicada ao Juventude: jogos, elenco e destaques do time de Caxias do Sul |
| Antenados no Futebol | `antenadosnofutebol.com.br` | 3 | esporte-dedicado | Notícias de desfalques e situação de elenco de times do Brasileirão |
| Análise Tática de Futebol | `analisedefutebol.blogspot.com` | 3 | tatico-analise | Blog dedicado exclusivamente a análise tática de jogos de futebol |
| Arena Correio | `arenacorreio.com.br` | 3 | jornal-tradicional | Portal de esportes dedicado do grupo Correio Braziliense, cobrindo futebol nacional e times do Distrito Federal. |
| Arena Rubro-Negra | `arenarubronegra.com` | 3 | clube-torcida | Blog/portal de torcida do Vitória com cobertura de bastidores, contratações e clima de vestiário |
| Arq Tricolor | `arqtricolor.com` | 3 | clube-torcida | Notícias de jogos, escalação e mercado do São Paulo FC |
| Audiência Carioca | `audienciacarioca.com.br` | 3 | nicho | Notícias e bastidores exclusivos do Campeonato Carioca |
| Blog da Fuzarca | `blogdafuzarca.wordpress.com` | 3 | clube-torcida | Blog de torcedor do Vasco comentando escalação, desfalques e estratégia tática |
| Boletim Gandulla (Miguel Castelo Branco) | `boletimgandulla.substack.com` | 3 | jornalista-individual | Newsletter autoral semanal de crônica e crítica sociocultural sobre futebol |
| Bonde | `bonde.com.br` | 3 | jornal-tradicional | Canal de esportes de Londrina/Norte do Parana, com cobertura detalhada do Londrina EC (transferencias, escalacao, resultados) e da Copa Parana |
| CBF Academy | `cbfacademy.com.br` | 3 | nicho | Conteúdo institucional da CBF sobre análise tática no futebol para formação técnica |
| CNRD - Comissão Nacional de Resolução de Disputas (CBF) | `cnrd.cbf.com.br` | 3 | orgao-disciplinar-oficial | Câmara da CBF para resolução de disputas contratuais/trabalhistas no futebol; processos publicados, adjacente ao disciplinar puro |
| Candangol | `candangol.com.br` | 3 | nicho | Portal exclusivo do futebol candango (DF): Candangão, clubes locais e campeonatos regionais |
| Canto do Galo (blog UAI) | `blogs.uai.com.br` | 3 | clube-torcida | Blog de torcida do Atlético Mineiro hospedado no portal UAI, comentário e bastidores de jogos |
| Central 3 Podcasts – Fronteiras Invisíveis do Futebol | `central3.com.br` | 3 | podcast-video | Podcast de nicho sobre futebol brasileiro trazendo histórias e bastidores fora do óbvio editorial |
| Central do Colorado | `centraldocolorado.com.br` | 3 | clube-torcida | Portal de notícias exclusivas do Internacional fundado por jornalistas em 2024: análises e bastidores |
| Coral News | `coralnews.wordpress.com` | 3 | clube-torcida | Blog que reúne apanhado de notícias veiculadas na web sobre o Santa Cruz Futebol Clube |
| Dica de Aposta | `dicadeaposta.com` | 3 | apostas-odds | Curadoria de melhores sites de apostas, palpites e conteúdos sobre o setor |
| Dicasbet | `dicasbet.com.br` | 3 | apostas-odds | Dicas de apostas focadas em jogos e mercados da Bet365 para o dia |
| Distrito do Esporte | `distritodoesporte.com` | 3 | nicho | Site de esportes do Distrito Federal com cobertura recorrente da Série D do Brasileirão |
| Dynamo Dudziak | `dudziak.substack.com` | 3 | jornalista-individual | Newsletter individual de Gabriel Dudziak com análise crítica de futebol brasileiro além do superficial (decisões técnicas, violência no esporte, se... |
| Eduardo Cecconi - Análise Tática | `eduardocecconi.wordpress.com` | 3 | jornalista-individual | Blog individual de analista tático sobre modelos de jogo e organização defensiva |
| Elencos.com.br | `elencos.com.br` | 3 | nicho | Vai-e-vem de times e jogadores, contratações e saídas do mercado da bola temporada a temporada |
| Esportes Brasília Notícias | `esportesbrasilia.com.br` | 3 | nicho | Portal regional de esportes do DF com cobertura do Candangão e futebol local |
| Fala, Kallás (blog Fernando Kallas) | `kallas.blogspot.com` | 3 | jornalista-individual | Blog pessoal com análises e bastidores de futebol europeu, correspondente internacional |
| Família Santista | `familiasantista.com.br` | 3 | clube-torcida | Site de torcedores para torcedores com informação, opinião e memória do Santos FC |
| Fiel Torcida | `fieltorcida.blog` | 3 | clube-torcida | Blog de torcedores com notícias e opinião sobre o Corinthians |
| Figueirense Futebol Clube (site oficial) | `figueirense.com.br` | 3 | clube-torcida | Canal oficial do Figueirense FC; domínio confirmado ativo (respondeu HTTP 403 a bot de fetch, típico de proteção anti-scraping), mas conteúdo de no... |
| Flamengão - O Fórum do Flamengo | `flamengao.comunidades.net` | 3 | clube-torcida | Fórum clássico criado por torcedores apaixonados pelo Clube de Regatas do Flamengo |
| Folha Vitória - Esportes | `folhavitoria.com.br` | 3 | jornal-tradicional | Jornal regional do Espírito Santo com caderno de esportes cobrindo futebol nacional e seleção brasileira. |
| FootHub | `foothub.com.br` | 3 | tatico-analise | Cultura, história e tática do futebol em formato aprofundado (ensaios, listas de livros) |
| FootyChat - Times Brasileiros | `footychat.app` | 3 | clube-torcida | Live chat multi-clube (Flamengo, Palmeiras, Corinthians, São Paulo, Vasco) para reação de torcedores em tempo real |
| Forum Clube do Flamengo | `flamengo.forumeiros.net` | 3 | clube-torcida | Fórum clássico (plataforma Forumeiros) onde torcedores do Flamengo trocam informações e boatos |
| Furacão.com | `furacao.com` | 3 | clube-torcida | Site 100% não oficial de torcida do Athletico Paranaense, com reação da torcida e bastidores |
| Futebol Palpites | `futebolpalpites.com.br` | 3 | apostas-odds | Palpites de especialistas atualizados diariamente por partida e campeonato |
| Futeboliche - Análise Tática | `futeboliche.wordpress.com` | 3 | tatico-analise | Blog de análise tática de jogos do futebol brasileiro |
| Futedelas | `futedelas.com.br` | 3 | nicho | Historias e perfis de jogadoras brasileiras, incluindo coberturas de aposentadoria e trajetoria |
| Gainblers | `gainblers.com` | 3 | apostas-odds | Previsões de apostas esportivas com seção dedicada a prognósticos no Brasil |
| Galoucura Blog | `galoucuraorg.blogspot.com` | 3 | clube-torcida | Blog da torcida organizada Galoucura: opiniões de torcedores e notícias do clube e da organizada |
| GaveaNews | `gaveanews.com` | 3 | clube-torcida | Bastidores de negociações do Flamengo, com furos sobre contratações (ex.: Jorginho) |
| Gaviões da Fiel (portal independente) | `gavioesdafiel.com.br` | 3 | nicho | História e cultura da torcida organizada Gaviões da Fiel, bastidores do movimento (sem vínculo oficial) |
| Glorioso do Botafogo (JM Botafogo) | `jmbotafogo.net` | 3 | clube-torcida | Notícias e paixão alvinegra, portal feito por torcedores para torcedores do Botafogo |
| Goianão Esportes | `goianaoesportes.com.br` | 3 | esporte-dedicado | Portal de nicho dedicado ao futebol goiano |
| Grêmio News | `gremionews.com.br` | 3 | clube-torcida | Notícias, jogos e bastidores do Grêmio com seções de mercado da bola e artilharia |
| H2FOZ | `h2foz.com.br` | 3 | jornal-tradicional | Portal de noticias de Foz do Iguacu e regiao da triplice fronteira, com editoria de esportes cobrindo a Copa Parana, futebol e futsal local |
| Jogada 10 | `jogada10.com.br` | 3 | esporte-dedicado | Site de notícias diárias de futebol brasileiro e internacional, cobertura por clube e extracampo |
| Jogando em Casa Dourado | `jogandoemcasadourado.com.br` | 3 | clube-torcida | Site de noticias e engajamento de torcida do Cuiaba EC: entrevistas de jogador, controversia de seguranca em estadio, reforcos |
| MSN Esportes (Brasil) | `msn.com` | 3 | portal-generalista | Portal agregador generalista da Microsoft com seção de futebol curando notícias de reação de jogadores e resultados |
| MW Futebol | `mwfutebol.wordpress.com` | 3 | tatico-analise | Análises táticas de partidas e discussões sobre tomada de decisão em treinamento |
| Maddison | `maddisonbr.substack.com` | 3 | nicho | Newsletter de negócios do esporte (direitos de transmissão, streaming, contratos, transferências) escrita por um coletivo de colunistas individuais |
| Mercado da Bola (mercadodabola.com.br) | `mercadodabola.com.br` | 3 | transferencias | Notícias diárias sobre o mercado da bola brasileiro e europeu, com foco em contratos e assinaturas de jogadores |
| Máquina do Esporte | `maquinadoesporte.com.br` | 3 | esporte-dedicado | Maior veículo especializado em negócios e mercado do esporte no Brasil (patrocínio, gestão, bastidores financeiros de clubes) |
| Na Rodinha - Futebol em dois toques | `narodinha.beehiiv.com` | 3 | nicho | Resumo bissemanal (segunda e quinta, 7h) de futebol brasileiro em tom de conversa de vestiário, leitura de 5 minutos sem clickbait |
| Nação Colorada | `nacaocolorada.com.br` | 3 | clube-torcida | Site do torcedor colorado do Internacional |
| Nação Palmeirense | `nacaopalmeirense.com.br` | 3 | clube-torcida | Blog da torcida palmeirense com notícias, jogos ao vivo e highlights |
| Notícias ao Minuto Brasil - Esporte | `noticiasaominuto.com.br` | 3 | portal-generalista | Agregador/portal generalista de notícias rápidas com seção de esporte cobrindo futebol nacional e internacional |
| O Analista de Futebol | `oanalistadefutebol.blogspot.com` | 3 | jornalista-individual | Blog individual de análise de desempenho e insights táticos para times e atletas |
| O Meu Vascão | `omeuvascao.com.br` | 3 | clube-torcida | Tudo sobre o Gigante da Colina em conteúdo voltado ao torcedor |
| O Município | `omunicipio.com.br` | 3 | jornal-tradicional | Jornal/portal regional de Chapecó e Oeste de Santa Catarina; domínio confirmado ativo (HTTP 403 a bot de fetch), cobertura específica de futebol/Ch... |
| O Paraná - Jornal de Fato | `oparana.com.br` | 3 | jornal-tradicional | Jornal diario do Oeste do Parana (regiao de Cascavel, fundado em 1976, circula em mais de 50 municipios), com editoria de esportes propria |
| Olé FC Brasil | `futebol.substack.com` | 3 | jornalista-individual | Newsletter individual (autor 'JUNO') com cobertura casual e frequente da seleção brasileira e grandes torneios internacionais |
| PE News - Clube Náutico Capibaribe | `penews.com.br` | 3 | jornal-tradicional | Portal de notícias pernambucano com tag dedicada ao Náutico, cobrindo jogos e bastidores do Timbu |
| Planeta Futebol Feminino | `planetafutebolfeminino.com.br` | 3 | nicho | Atualizacoes de competicoes e comunicados da FIFA sobre futebol feminino |
| Portal Esporte Manaus | `portalesportemanaus.com.br` | 3 | esporte-dedicado | Portal especializado em esportes amazonenses, focado no futebol de Manaus |
| Portal Flamengo | `portalflamengo.com.br` | 3 | clube-torcida | Enciclopédia completa do Mengão: biografias de jogadores, técnicos, presidentes e escalações históricas desde 1895 |
| Portal O Dia Esporte | `portalodia.com` | 3 | portal-generalista | Portal generalista carioca com cobertura própria de esportes, sucessor digital do jornal O Dia |
| SEP - Discord Palmeiras (não oficial) | `discord.com/invite/palmeiras` | 3 | clube-torcida | Servidor Discord não oficial da Sociedade Esportiva Palmeiras, ~19 mil membros, espaço de discussão de torcedores |
| SOSApostas | `sosapostas.com` | 3 | apostas-odds | Prognósticos esportivos e comparação de casas de apostas para o público lusófono |
| Sambafoot | `sambafoot.com` | 3 | esporte-dedicado | Portal dedicado ao futebol brasileiro com viés de apostas esportivas, notícias e análises por time |
| Santistas.net | `santistas.net` | 3 | clube-torcida | Série de notícias do Santos trazendo bastidores que poucos torcedores conhecem |
| Saudações Tricolores | `saudacoestricolores.com` | 3 | clube-torcida | Blog de torcida com notícias e jogos do Fluminense |
| Sou Tigrão | `soutigrao.com` | 3 | clube-torcida | Site de torcida do Vila Nova FC (Tigrão) com notícias, bastidores e opinião |
| Terror das Bets | `terrordasbets.com` | 3 | nicho | Blog especializado em avaliar e listar grupos e canais de apostas esportivas no Telegram |
| The Players | `theplayers-br.beehiiv.com` | 3 | nicho | Newsletter gratuita multi-esporte (futebol nacional, internacional e NBA) com tom casual e cheio de emojis, cobrindo Brasileirão, Libertadores e Ch... |
| Vascaino.net | `vascaino.net` | 3 | clube-torcida | Notícias do Club de Regatas Vasco da Gama |
| Ver-o-Fato | `ver-o-fato.com.br` | 3 | esporte-dedicado | Mantém seção dedicada 'Futebol paraense', cobrindo inclusive clubes menores do estado (Águia de Marabá, Tuna) |
| ZY3 | `zy3.com.br` | 3 | nicho | Jornalismo investigativo sobre bastidores de poder e governança da CBF/futebol brasileiro |

### Brasil, Portugal (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| 78 Project (inclui newsletter Cavadinha) | `setentaeoito.substack.com` | 3 | nicho | Newsletter coletiva de futebol com forte cobertura da Copa do Mundo 2026 e do Brasil, audiência luso-brasileira, múltiplos colunistas |

### Reino Unido / Brasil (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| BBC Brasil (RSS) | `feeds.bbci.co.uk` | 2 | jornal-tradicional | Feed RSS geral da BBC Brasil misturando editorias, mas com cobertura recorrente de seleção brasileira e Copa do Mundo em português |

## Inglaterra e Reino Unido (38)

### Inglaterra (28)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| BBC Sport | `bbc.co.uk` | 1 | jornal-tradicional | Cobertura jornalistica tradicional da BBC para Championship, League One e League Two, com noticias, resultados e video |
| Goalhanger Podcasts – The Rest Is Football | `goalhanger.com` | 1 | podcast-video | Podcast independente com Gary Lineker, Alan Shearer e Micah Richards trazendo bastidores e opinião de ex-jogadores |
| PhysioRoom | `physioroom.com` | 1 | nicho | Site historico especializado em tabela de lesoes da Premier League com viés medico/fisioterapico |
| Premier Injuries | `premierinjuries.com` | 1 | nicho | Tracker dedicado de lesoes e suspensoes da Premier League, com tabela por time e retorno esperado |
| Premier League (site oficial) | `premierleague.com` | 1 | portal-generalista | Portal oficial da liga com pagina club-by-club de jogadores lesionados |
| The Blizzard | `theblizzard.co.uk` | 1 | tatico-analise | Revista trimestral de longform storytelling futebolistico, perfis e historia do jogo, sem foco em placar ao vivo |
| The Independent - Football | `independent.co.uk` | 1 | jornal-tradicional | Notícias de futebol inglês e internacional, lesões e atualizações de elenco. |
| The Overlap – Stick to Football | `theoverlap.com` | 1 | podcast-video | Rede de conteúdo de Gary Neville com 'Stick to Football', ex-jogadores discutindo bastidores e vestiário da Premier League |
| Transfermarkt (UK) | `transfermarkt.co.uk` | 1 | transferencias | Base de dados com paginas dedicadas de jogadores lesionados e suspensos por competicao, incluindo Championship |
| Alex Keble | `alexkeble.com` | 2 | jornalista-individual | Analista tatico independente que contribui para BBC Sport, FourFourTwo e The Independent, com foco em breakdowns estrategicos |
| Football FanCast | `footballfancast.com` | 2 | esporte-dedicado | Noticias, opiniao e rumores de transferencia da EFL Championship |
| Football Insider | `footballinsider247.com` | 2 | transferencias | Site dedicado a rumores de transferencia com 'sources' proprias por clube, tom tabloide/insider |
| Football Ramble | `footballramble.com` | 2 | podcast-video | Podcast de futebol independente (rede Stak) com humor e discussão de bastidores da Premier League e futebol inglês |
| Inside Futbol | `insidefutbol.com` | 2 | esporte-dedicado | Noticias e rumores de transferencia focados na Championship |
| Squawka | `squawka.com` | 2 | estatisticas-dados | Estatísticas de jogadores e análise de partida combinadas a notícia |
| Tactical Football Analysis | `tacticalfootballanalysis.com` | 2 | tatico-analise | Site desde 2018 com relatorios de scouting, analise tatica e estatisticas de jogadores/times |
| The Football League Paper | `theleaguepaper.com` | 2 | jornal-tradicional | Jornal semanal especializado exclusivamente em EFL Championship, League One e League Two |
| The72 | `the72.co.uk` | 2 | esporte-dedicado | Cobertura dedicada aos 72 clubes da EFL (Championship, League One, League Two), com bastidores e reportagem pos-jogo |
| Training Ground Guru | `trainingground.guru` | 2 | tatico-analise | Portal e podcast para profissionais de bastidores do futebol, com insights taticos e de metodologia de treino (ligado a Hudl) |
| Women's Football Magazine (ex-She Kicks) | `womensfootballmagazine.com` | 2 | nicho | Publicacao britanica dedicada cobrindo WSL, selecao inglesa e futebol de base desde 2002 |
| Football Lowdown | `footballlowdown.com` | 3 | esporte-dedicado | Noticias e podcast dedicados a League One e non-league, com contexto e analise do calendario |
| Footy Analyst | `footyanalyst.com` | 3 | tatico-analise | Longform writing e opinioes originais sobre literatura e cultura do futebol, incluindo resenhas de livros taticos |
| Outswinger FC | `outswingerfc.com` | 3 | tatico-analise | Blog independente com secao dedicada de analise tatica de partidas e times |
| Sport Witness | `sportwitness.co.uk` | 3 | transferencias | Especialista de nicho que traduz e reporta rumores de transferencia da imprensa estrangeira para o mercado ingles |
| SportBible (Football) | `sportbible.com` | 3 | esporte-dedicado | Site de esporte viral/tabloide digital com vertical de futebol cobrindo bastidor e reacao |
| The Fishy | `thefishy.co.uk` | 3 | nicho | Site especializado em listar jogadores lesionados/desfalcados por partida na Championship — evidencia direta de desfalque |
| The Star (Sheffield) | `thestar.co.uk` | 3 | jornal-tradicional | Jornal regional com cobertura de noticias de time e lesoes de clubes como Sheffield United e Portsmouth |
| Total Football Analysis Substack | `totalfootballanalysis.substack.com` | 3 | tatico-analise | Newsletter em Substack com analises taticas pos-jogo e relatorios de scouting de jogadores, complementar ao site principal da TFA |

### Irlanda (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Second Captains | `secondcaptains.com` | 3 | podcast-video | Podcast irlandês de esportes (não exclusivo de futebol) com forte cobertura de futebol europeu e conversas de bastidores de jornalistas |

### Reino Unido (9)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Bettingexpert | `bettingexpert.com` | 1 | apostas-odds | Maior comunidade de tipsters de futebol do mundo, com dicas e análises pré-jogo da Premier League |
| Betmana | `betmana.co.uk` | 2 | apostas-odds | Guias de apostas sobre efeito de altitude, clima e fadiga por viagem em partidas internacionais, com recomendação de mercados afetados. |
| Betting.co.uk | `betting.co.uk` | 2 | apostas-odds | Melhores odds de apostas de futebol e previsões para todos os confrontos do dia no Reino Unido |
| BettingOdds.com | `bettingodds.com` | 2 | apostas-odds | Odds, ofertas e freebets das principais casas de apostas do Reino Unido para grandes eventos esportivos |
| talkSPORT BET | `talksportbet.com` | 2 | apostas-odds | Odds e mercados de apostas para a Premier League operados pela marca de rádio esportiva talkSPORT |
| FSM (Football & Stadium Management) | `fsm-online.co.uk` | 3 | nicho | Revista especializada em manutenção, gestão e infraestrutura de gramados e estádios esportivos no Reino Unido. |
| The Footy Tipster | `thefootytipster.com` | 3 | nicho | Dicas diárias gratuitas e pagas de um tipster especialista, cobrindo as principais ligas de futebol |
| The GMA (Grounds Management Association) | `thegma.org.uk` | 3 | nicho | Associação britânica de gestores de gramados, com avaliações de qualidade de campo e prêmio de melhor equipe de manutenção da Premier League. |
| Turf Business | `turfbusiness.co.uk` | 3 | nicho | Notícias e vídeos do setor de manutenção de gramados e greenkeeping aplicados a estádios de futebol. |

## Europa continental (62)

### Alemanha (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| SID (Sport-Informations-Dienst) | `sid.de` | 2 | agencia-noticias | Subsidiária de esportes da agência DPA, wire feed dedicado de futebol alemão (Bundesliga) com texto, vídeo e dados para clientes de mídia |

### Alemanha / Global (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| dpa international | `dpa-international.com` | 1 | agencia-noticias | Wire internacional em inglês da Deutsche Presse-Agentur (DPA), seção Sports com relatos ao vivo de partidas de futebol (Copa do Mundo 2026) |

### Bélgica (5)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| HLN (Het Laatste Nieuws) | `hln.be` | 1 | jornal-tradicional | Maior jornal popular da Flandres (DPG Media); seção esportiva sensacionalista, forte em bastidores e reações de torcida |
| Het Nieuwsblad | `nieuwsblad.be` | 1 | jornal-tradicional | Jornal flamengo tradicional (Mediahuis) com cobertura ampla do futebol nacional, política interna de clube e bastidores |
| VoetbalPrimeur (BE) | `voetbalprimeur.be` | 2 | esporte-dedicado | Notícias rápidas do futebol belga com foco em transferências e mercado da Pro League |
| Redactie24 (Voetbal) | `redactie24.be` | 3 | nicho | Cobertura de futebol belga com foco em reações de torcida, venda de clube (Antwerp) e bastidores/lesões (Mignolet) |
| Voetbal24.be | `voetbal24.be` | 3 | esporte-dedicado | Notícias de futebol belga com tom dramático/narrativo sobre crises internas de clube (ex.: "drama" no vestiário do Club Brugge) |

### Croácia (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Index.hr (seção esportes) | `index.hr` | 1 | jornal-tradicional | Maior portal de notícias da Croácia, com seção esportiva ativa e comentários de leitores sobre partidas |
| Gol.hr | `gol.dnevnik.hr` | 2 | esporte-dedicado | Vertical de futebol/esportes do grupo Dnevnik.hr, cobrindo seleção croata e clubes Dinamo/Hajduk |

### Espanha (22)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Cuatro Picas | `cuatropicas.com` | 1 | tatico-analise | Análises táticas aprofundadas de times espanhóis, incluindo esquemas do Real Madrid e da LaLiga temporada a temporada. |
| El País (Deportes) | `elpais.com` | 1 | jornal-tradicional | Jornal de referência geral (Grupo PRISA) com seção de esportes/futebol robusta, cobertura mais analítica e editorial que os diários esportivos puros. |
| FC Barcelona (canal oficial de notícias) | `fcbarcelona.es` | 1 | clube-torcida | Canal oficial de notícias do FC Barcelona, informação de primeira mão sobre elenco e jogos. |
| ABC (Deportes) | `abc.es` | 2 | jornal-tradicional | Jornal de referência de Madri (Grupo Vocento) com seção de esportes/futebol, cobertura mais institucional que os diários esportivos dedicados. |
| Atletico Madrid News | `atleticomadridnews.com` | 2 | clube-torcida | Site dedicado a notícias, partidas e elenco do Atlético de Madrid. |
| COPE Deportes | `cope.es` | 2 | portal-generalista | Rede de rádio com portal de notícias e forte cobertura de futebol via coletivas e transmissões ao vivo, tradicional em furos de bastidor de vestiário. |
| Diario de Sevilla (seção Sevilla FC) | `diariodesevilla.es` | 2 | jornal-tradicional | Jornal regional andaluz com seção dedicada ao Sevilla FC: fichagens e desempenho de jogadores. |
| Esto es Atleti | `estoesatleti.es` | 2 | clube-torcida | Diário esportivo dedicado ao Atlético de Madrid, cobertura próxima da torcida. |
| FC Barcelona Noticias | `fcbarcelonanoticias.com` | 2 | clube-torcida | Site dedicado ao FC Barcelona: fichagens, resultados e estatísticas do elenco. |
| La Vanguardia (Deportes) | `lavanguardia.com` | 2 | jornal-tradicional | Jornal geral de Barcelona (Grupo Godó, irmão do Mundo Deportivo) com seção de esportes/futebol, cobertura editorial do FC Barcelona e La Liga. |
| Soy Analista | `soyanalista.com` | 2 | tatico-analise | Análise de oposição tática por clube da LaLiga, com esquemas e leitura de jogo. |
| Vamos Mi Sevilla | `vamosmisevillafc.com` | 2 | clube-torcida | Site de torcida dedicado ao Sevilla FC: fichagens e atualidade do clube. |
| 11Heroes La Liga Injuries | `11heroes.com` | 3 | nicho | Lista dedicada de lesionados e suspensos da La Liga |
| A Partido Único | `apartidounico.com` | 3 | clube-torcida | Cobertura dedicada de fichagens e atualidade do FC Barcelona. |
| Dorsal16 | `dorsal16.com` | 3 | clube-torcida | Site dedicado à cobertura do Sevilla FC. |
| LaLigaExpert Injuries | `laligaexpert.com` | 3 | nicho | Cobertura especializada de lesoes e suspensoes da La Liga |
| OrgulloBiri | `orgullobiri.com` | 3 | clube-torcida | Site de torcida dedicado ao Sevilla FC: notícias, fichagens e última hora. |
| TactiClip | `tacticlipfutbol.com` | 3 | tatico-analise | Plataforma de análise tática em vídeo com IA para futebol espanhol. |
| TacticsAnalyzer | `tacticsanalyzer.com` | 3 | tatico-analise | Plataforma de análise tática com IA para times de LaLiga. |
| Tactiq | `tactiq.club` | 3 | tatico-analise | Análise de futebol com IA incluindo métricas xG para LaLiga. |
| Tácticas Fútbol | `tacticasfutbol.com` | 3 | tatico-analise | Análises táticas de partidas específicas do futebol espanhol. |
| Zona del Analista | `zonadelanalista.com` | 3 | tatico-analise | Feed de análises táticas dedicado à LaLiga. |

### Espanha/Portugal (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Wincomparator | `wincomparator.com` | 3 | apostas-odds | Comparador de odds e prognosticos com cobertura especifica da UEFA Nations League |

### França (5)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Eurosport France (Ligue 1) | `eurosport.fr` | 1 | portal-generalista | Cobertura de trocas de técnico, finanças de clube e mercato com citações diretas de dirigentes e treinadores |
| France Football | `francefootball.fr` | 1 | jornal-tradicional | Revista histórica de futebol (editora do Ballon d'Or), reportagens longas e análise de bastidores da Ligue 1 |
| Ligue1.com (site oficial) | `ligue1.com` | 1 | esporte-dedicado | Hub oficial da liga (Ligue 1 e Ligue 2) com artigos, vídeos e páginas de todos os 40 clubes |
| Foot01 | `foot01.com` | 2 | esporte-dedicado | Notícias e mercato de Ligue 1 com colunas de opinião e atualizações médicas de jogadores |
| OM.fr (site oficial do Olympique de Marseille) | `om.fr` | 2 | clube-torcida | Site oficial do OM: comunicados de mercato, resumos de jogo e bastidores de estágio/treino do clube |

### Grécia (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Protothema.gr (seção esportes) | `protothema.gr` | 2 | jornal-tradicional | Jornal digital grego generalista com seção esportiva forte cobrindo times gregos e competições europeias |

### Italia (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Eurosport Italia | `eurosport.it` | 2 | esporte-dedicado | Cobertura de futebol italiano e internacional com calciomercato, pagelle e analises de tecnicos/jogadores |
| Calcio e Finanza | `calcioefinanza.it` | 3 | nicho | Angulo de negocios/financas do futebol italiano: governanca de clubes, calciomercato, patrocinios e estadios |

### Italia / Global (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| ANSA (Agenzia Nazionale Stampa Associata) - Calcio | `ansa.it` | 1 | agencia-noticias | Agência de notícias italiana com seção dedicada de calcio (futebol): Serie A, Serie B, Champions/Europa/Conference League, transferências e coletivas |

### Noruega (3)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Eliteserien (site oficial da liga) | `eliteserien.no` | 1 | nicho | Site oficial da primeira divisão norueguesa: notícias de transferências, tabela, calendário e súmulas de partida |
| NRK Sport - Fotball | `nrk.no` | 1 | jornal-tradicional | Radiodifusora pública norueguesa; cobertura de futebol com contratações, súmulas e declarações de jogadores/clubes |
| Dagbladet - Fotball | `dagbladet.no` | 2 | jornal-tradicional | Tabloide norueguês com jornalismo esportivo sensacionalista: rumores de transferência, polêmicas e reações de bastidor |

### Países Baixos (6)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| AD Sportwereld | `ad.nl` | 1 | jornal-tradicional | Seção esportiva do jornal AD (DPG Media), forte em Ajax/Feyenoord/PSV, coletivas e bastidores de clube |
| NU.nl (Voetbal) | `nu.nl` | 1 | portal-generalista | Maior portal de notícias geral da Holanda; seção de futebol/transferências de altíssimo tráfego |
| Transfermarkt (NL) | `transfermarkt.nl` | 1 | estatisticas-dados | Versão holandesa da referência global em valores de mercado, elenco e histórico de transferências |
| Transfernieuws.nl | `transfernieuws.nl` | 2 | transferencias | Especialista dedicado a rumores/notícias de transferência, com seções por clube e por país (inclui satélite para Bélgica) |
| Voetbalnieuws.nl | `voetbalnieuws.nl` | 2 | esporte-dedicado | Site de notícias rápidas com cobertura de bastidores/vestiário (ex.: invasão de torcida em clube belga após rebaixamento) |
| Blessures en Schorsingen | `blessuresenschorsingen.nl` | 3 | estatisticas-dados | Base de dados especializada em lesões/suspensões da Eredivisie por clube, atualizada diariamente com data prevista de retorno — nicho ideal para ev... |

### Polônia (3)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Sport w Interia.pl | `sport.interia.pl` | 2 | portal-generalista | Vertical esportiva do grande portal polonês Interia, com foco em seleção nacional e ligas domésticas |
| Weszło | `weszlo.com` | 2 | esporte-dedicado | Site polonês focado em futebol com análise de transferências e conteúdo de apostas esportivas |
| Meczyki.pl | `meczyki.pl` | 3 | apostas-odds | Portal polonês nichado em transmissões ao vivo, odds de casas de apostas e estatísticas de jogadores |

### Portugal (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| ProTipster Portugal | `protipster.pt` | 3 | apostas-odds | Site portugues de prognosticos e dicas de apostas com cobertura da UEFA Nations League |

### Russia (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Interfax Sport | `sport-interfax.ru` | 2 | agencia-noticias | Subsidiária de esportes da agência Interfax, cobertura de futebol (Copa América 2026) junto com outros esportes |

### Russia / Global (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| TASS Sport | `tass.com` | 2 | agencia-noticias | Agência de notícias russa (estatal), seção Sports com cobertura de grandes torneios de futebol (Copa do Mundo) |

### Sérvia (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| B92 Sport | `b92.net` | 1 | jornal-tradicional | Grande veículo sérvio de notícias com seção esportiva cobrindo Crvena Zvezda, Partizan e futebol europeu |
| Mozzart Sport | `mozzartsport.com` | 1 | portal-generalista | Portal sérvio de esportes ligado à casa de apostas Mozzart, cobrindo Superliga sérvia e rumores de transferência |

### Tchéquia (3)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Sport.cz | `sport.cz` | 1 | portal-generalista | Portal esportivo tcheco com fantasy liga, podcasts e cobertura da liga doméstica e seleção |
| iSport.cz | `isport.blesk.cz` | 1 | portal-generalista | Portal esportivo tcheco do grupo Czech News Center, com transferências e cobertura da Chance Liga |
| Novinky.cz (seção esportes) | `novinky.cz` | 2 | jornal-tradicional | Grande jornal digital tcheco com cobertura de futebol doméstico, incluindo desenvolvimento de estádios dos clubes de Praga |

### Turquia / Global (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Anadolu Agency Sports | `aa.com.tr` | 1 | agencia-noticias | Agência de notícias turca (estatal), desk de esportes em inglês com cobertura de futebol internacional (Copa do Mundo) e outros esportes |

## Américas (38)

### Argentina (7)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| La Nación - Deportes/Fútbol | `lanacion.com.ar` | 1 | jornal-tradicional | Cobertura editorial tradicional com bastidores, entrevistas e análise institucional da seleção e dos clubes argentinos |
| Crónica - Deportes | `cronica.com.ar` | 2 | jornal-tradicional | Cobertura tabloide popular, títulos chamativos sobre clubes e seleção argentina |
| Diario Popular - Deportes | `diariopopular.com.ar` | 2 | jornal-tradicional | Cobertura popular de clubes do Grande Buenos Aires e da seleção, tom tabloide |
| Perfil - Deportes | `perfil.com` | 2 | jornal-tradicional | Cobertura editorial com bastidores políticos/institucionais dos clubes e da seleção argentina |
| Página/12 - Deportes | `pagina12.com.ar` | 2 | jornal-tradicional | Análise com viés social/político do futebol argentino, perfis e crônicas de bastidor |
| Ámbito - Deportes | `ambito.com` | 2 | jornal-tradicional | Ângulo institucional/dirigencial do futebol argentino, cruzando esporte com bastidores econômicos dos clubes |
| MinutoUno - Deportes | `minutouno.com` | 3 | portal-generalista | Notícias factuais rápidas sobre seleção e clubes argentinos, cobertura de plantão |

### Canada (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Last Word On Sports - Champions League | `lastwordonsports.com` | 2 | esporte-dedicado | Rede de blogueiros esportivos com categoria extensa e continuamente atualizada dedicada a Champions League |

### Chile (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| RedGol | `redgol.cl` | 1 | esporte-dedicado | Maior portal de notícias de futebol chileno e internacional, forte em furos e bastidores de clubes |
| TodoFutbol.cl | `todofutbol.cl` | 2 | esporte-dedicado | Portal de futebol chileno e internacional com foco em resultados, elenco e notícias de clubes locais |

### Colômbia (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Gol Caracol | `golcaracol.com` | 1 | esporte-dedicado | Braço de futebol da Caracol Televisión; seleção colombiana, Liga BetPlay, eliminatórias e Libertadores/Sul-Americana |

### Costa Rica (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| La Nación (Costa Rica) | `nacion.com` | 2 | jornal-tradicional | Jornal nacional de referência da Costa Rica, cobre a seleção e o futebol local |

### Equador (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Ecuagol | `ecuagol.com` | 2 | esporte-dedicado | Site especializado em futebol equatoriano, com app próprio e forte presença social |
| Primicias | `primicias.ec` | 2 | portal-generalista | Portal equatoriano com cobertura de La Tri nas Eliminatórias e clubes equatorianos na Libertadores/Sudamericana, incluindo bastidores e entrevistas. |

### Estados Unidos (6)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| CBS Sports Soccer | `cbssports.com` | 1 | esporte-dedicado | Feed RSS oficial de noticias de futebol via /rss/headlines/soccer/, cobertura americana e internacional |
| The Equalizer | `equalizersoccer.com` | 1 | esporte-dedicado | Fonte numero 1 de noticias do futebol feminino profissional (NWSL e selecoes) desde 2009, cobertura independente |
| Action Network Bundesliga Injury Report | `actionnetwork.com` | 2 | apostas-odds | Injury report da Bundesliga dentro de plataforma de analytics esportivo voltada a apostas |
| Backheeled | `backheeled.com` | 3 | nicho | Site especializado em futebol americano (MLS, USL, USMNT) com análises táticas e cobertura de janela de transferências por time |
| National Soccer Network | `nationalsoccernetwork.com` | 3 | nicho | Resultados de partidas, classificacoes, transferencias e analise aprofundada de ligas femininas |
| Women's Soccer Wire | `womenssoccerwire.com` | 3 | nicho | Cobertura da NWSL, selecao americana e eventos do futebol feminino profissional |

### Guatemala (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Prensa Libre (Deportes) | `prensalibre.com` | 2 | jornal-tradicional | Jornal nacional guatemalteco com seção de esportes cobrindo futebol local e regional |

### Honduras (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Diez | `diez.hn` | 1 | esporte-dedicado | Jornal esportivo dedicado de Honduras, referência para futebol hondurenho e da região |
| El Heraldo (Deportes) | `elheraldo.hn` | 2 | jornal-tradicional | Jornal hondurenho com seção de esportes dedicada ao futebol nacional |

### México (8)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| ESPN México | `espn.com.mx` | 1 | esporte-dedicado | Edição mexicana da ESPN, análises táticas e notícias de lesão/convocação da Liga MX |
| El Universal (Deportes) | `eluniversal.com.mx` | 1 | jornal-tradicional | Jornal nacional mexicano de referência, cobre bastidores de vestiário de clubes como América, Chivas, Cruz Azul e Pumas |
| Fox Sports México | `foxsports.com.mx` | 1 | esporte-dedicado | Grande canal esportivo com cobertura diária e tag dedicada à Liga MX |
| Milenio Deportes | `milenio.com` | 1 | jornal-tradicional | Grande jornal nacional mexicano com seção dedicada de futebol/Liga MX |
| El Informador | `informador.mx` | 2 | jornal-tradicional | Jornal regional de Guadalajara, forte em cobertura de Chivas e Atlas |
| Esto (OEM) | `oem.com.mx` | 2 | jornal-tradicional | Jornal esportivo histórico mexicano da Organización Editorial Mexicana |
| Transfermarkt México | `transfermarkt.mx` | 2 | transferencias | Edição mexicana do Transfermarkt, valores de mercado e rumores de transferência da Liga MX |
| Vamos Cruz Azul (Bolavip) | `vamoscruzazul.bolavip.com` | 3 | clube-torcida | Site de torcida dedicado ao Cruz Azul, clima de vestiário e bastidores do clube |

### Paraguai (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| D10 (Última Hora) | `d10.ultimahora.com` | 2 | esporte-dedicado | Vertical esportiva do jornal Última Hora dedicada a futebol paraguaio e Libertadores/Sul-Americana |
| VS Sports | `vssports.com.py` | 2 | esporte-dedicado | Futebol paraguaio, seleção e Copa Libertadores com cobertura dedicada de clubes como Cerro Porteño e Olimpia |

### Peru (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| RPP Deportes | `rpp.pe` | 2 | portal-generalista | Grande veículo peruano com subseções dedicadas a Copa Libertadores, Copa Sudamericana, Liga 1 e Selección Peruana. |

### Regional (Concacaf) (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Concacaf (edição em espanhol) | `es.concacaf.com` | 1 | agencia-noticias | Site oficial da confederação em espanhol, comunicados sobre seleções da região e Copa Ouro |

### Sul-America (sede Paraguai) (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| CONMEBOL (site oficial) | `conmebol.com` | 1 | nicho | Site oficial da confederação: calendário, sorteios, mudanças de sede e notícias institucionais da Libertadores e Sudamericana. |

### Uruguai (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Ovación (El País Uruguay) | `elpais.com.uy` | 1 | jornal-tradicional | Caderno de esportes do maior jornal uruguaio, cobertura em tempo real de futebol e outros esportes |

### Venezuela (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Diario Vinotinto | `diariovinotinto.com` | 3 | nicho | Especializado na seleção venezuelana (Vinotinto), venezuelanos no exterior e Liga FUTVE |

## África, Ásia e Oriente Médio (19)

### Arábia Saudita (3)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Okaz - Seção Esportes | `okaz.com.sa` | 1 | jornal-tradicional | Jornal tradicional saudita; seção de esportes cobre futebol saudita e internacional, transferências e bastidores de seleção/clubes. |
| Sabq - Sports | `sabq.org` | 1 | esporte-dedicado | Portal saudita com cobertura ao vivo da Roshn Saudi League (SPL): classificação, resultados minuto a minuto, central de transferências. |
| Al-Jazirah - Sports | `al-jazirah.com` | 2 | jornal-tradicional | Jornal diário saudita; seção de esportes cobre Al-Hilal, Al-Nassr, federação saudita e futebol feminino local. |

### China / Global (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Xinhua Sports (English) | `english.news.cn` | 1 | agencia-noticias | Agência estatal chinesa, desk de esportes em inglês com cobertura de futebol ao vivo (resultados, prêmios, relatos de partida) |

### Coreia do Sul (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| K League Official | `kleague.com` | 1 | nicho | Site oficial da K League com notícias de clubes, estatísticas de jogadores e conteúdo institucional, com opção de idioma em inglês |
| The Korea Times - Sports | `koreatimes.co.kr` | 2 | jornal-tradicional | Jornal sul-coreano em inglês com cobertura de K League, incluindo reportagens de cultura/rivalidade de clubes (derbies) |

### Egito (1)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Ahly News | `ahlynews.com` | 3 | clube-torcida | Site dedicado a notícias do Al Ahly e da seleção egípcia |

### Gana (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Pulse Ghana | `pulse.com.gh` | 2 | portal-generalista | Portal geral de notícias ganês com seção de futebol |
| Ghana Black Stars News | `ghanablackstars.news` | 3 | nicho | Site nicho dedicado exclusivamente à seleção Black Stars de Gana |

### Japão (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| J.League Official (English News) | `jleague.jp` | 1 | nicho | Site oficial da J-League em inglês, com seção de notícias dedicada à primeira divisão japonesa (J1) |
| Football Channel (フットボールチャンネル) | `footballchannel.jp` | 2 | esporte-dedicado | Mídia especializada japonesa (Kanzen Inc.) com reportagem narrativa sobre J-League, seleção nacional e futebol feminino (WE League) |

### Marrocos (3)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| El Botola | `elbotola.com` | 1 | esporte-dedicado | Principal site dedicado à Botola (liga marroquina) e ao futebol de Marrocos |
| FRMF (Fédération Royale Marocaine de Football) | `frmf.ma` | 1 | agencia-noticias | Site oficial da Federação Real Marroquina de Futebol |
| El Botola Media | `elbotolamedia.com` | 3 | esporte-dedicado | Site esportivo marroquino nicho, cobertura acessível de notícias do futebol local |

### Nigéria (2)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Football in Nigeria | `footballinnigeria.com.ng` | 2 | esporte-dedicado | Site dedicado a notícias do futebol nigeriano (NPFL e seleção) |
| Nigerian Matchday | `nigerianmatchday.com` | 3 | nicho | Site nicho de cobertura de partidas e notícias do futebol nigeriano |

### Pan-Africano (3)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| Afrik-Foot | `afrik-foot.com` | 2 | esporte-dedicado | Cobertura pan-africana de futebol com edições nacionais dedicadas (ex.: Nigéria) |
| TheAfricaCup.com | `theafricacup.com` | 2 | nicho | Site dedicado exclusivamente à Copa Africana de Nações (AFCON), notícias e cobertura do torneio |
| MySportDab (AFCON) | `mysportdab.com` | 3 | nicho | Blog nicho dedicado a notícias específicas da AFCON |

## Global e multi-região (49)

### Global (49)

| Site | Domínio | Tier | Categoria | Cobertura |
|---|---|---|---|---|
| AccuWeather | `accuweather.com` | 1 | nicho | Previsão do tempo local e global hora a hora, referência padrão para checar condições climáticas antes de partidas ao ar livre. |
| Bing Notícias | `bing.com` | 1 | agregador-rss | Agregador da Microsoft com feed RSS de busca que reúne notícias de futebol brasileiro de Estadão, O Jogo, Terra, Metrópoles, O Globo e outros |
| CAS/TAS - Court of Arbitration for Sport | `tas-cas.org` | 1 | orgao-disciplinar-oficial | Tribunal arbitral internacional que julga recursos contra suspensões e decisões disciplinares de FIFA/UEFA/CONMEBOL; seção de jurisprudência com de... |
| Google Notícias | `news.google.com` | 1 | agregador-rss | Agregador algorítmico que reúne e indexa em RSS notícias de futebol brasileiro de dezenas de veículos (BBC, ESPN, Terra, Globo, UOL, Folha) em temp... |
| UEFA - Disciplinary Matters | `disciplinary.uefa.com` | 1 | orgao-disciplinar-oficial | Hub oficial da UEFA para decisões e reuniões dos órgãos disciplinares em competições europeias (suspensões de jogadores/clubes) |
| UEFA.com | `uefa.com` | 1 | esporte-dedicado | Site oficial da UEFA com noticias, resultados e bastidores de Champions League, Europa League, Conference League, Eurocopa e Nations League |
| UEFA.tv | `uefa.tv` | 1 | podcast-video | Plataforma oficial de video com highlights, resumos e conteudo audiovisual de todas as competicoes da UEFA (UCL, UEL, UECL, Nations League) |
| Coaches' Voice (edição em espanhol) | `es.coachesvoice.com` | 2 | tatico-analise | Análises táticas de partidas de LaLiga (Real Madrid, Barcelona) com foco em decisões de treinadores. |
| FIFA - Media Statements (Disciplinary) | `media.fifa.com` | 2 | orgao-disciplinar-oficial | Comunicados oficiais da FIFA, incluindo declarações do presidente do Comitê Disciplinar sobre casos de suspensão em andamento |
| FIFA Women's World | `fifawomensworld.com` | 2 | agencia-noticias | Casa oficial global do futebol feminino da FIFA com noticias, atualizacoes de jogos e perfis de jogadoras |
| FootballTransfers | `footballtransfers.com` | 2 | transferencias | Noticias de transferencias com secao dedicada a rumores ligados a clubes da Champions League |
| FunStats | `funstats.fyi` | 2 | estatisticas-dados | Guias estatísticos sobre fatores contextuais em apostas — altitude, folgas entre jogos e calendário congestionado. |
| Her Football Hub | `herfootballhub.com` | 2 | nicho | Cobertura global do futebol feminino com noticias, comentario e conteudo original |
| InStat | `instat.com` | 2 | estatisticas-dados | Analytics de vídeo e dados de desempenho para clubes profissionais |
| Meteored | `meteored.com` | 2 | nicho | Previsão meteorológica com radar de chuva em tempo real e modelos ECMWF, útil para condições de jogo em estádios. |
| OpticOdds | `opticodds.com` | 2 | estatisticas-dados | Fornecedor de dados de odds em tempo real e históricos para múltiplas casas, usado em ferramentas de linha e CLV. |
| Sporting News UK | `sportingnews.com` | 2 | jornal-tradicional | Materias de injury list por clube com datas de retorno esperado (ex.: Chelsea) |
| Windy | `windy.com` | 2 | nicho | Mapas animados de vento, chuva e temperatura em tempo real, usados para checar condições climáticas no horário do jogo em qualquer estádio do mundo. |
| xGoal | `xgoal.app` | 2 | estatisticas-dados | Plataforma de analytics que modela o sinal de congestionamento de calendário (folga entre jogos + distância de viagem) como fator preditivo de resu... |
| BetInf Injured Players | `betinf.com` | 3 | apostas-odds | Listas de jogadores lesionados por pais/liga (Alemanha, Espanha) voltadas a analise de apostas |
| Compare.bet | `compare.bet` | 3 | apostas-odds | Comparador de odds de futebol entre casas de apostas, com foco em encontrar o melhor preço por mercado. |
| CorrectBetting | `correctbetting.com` | 3 | nicho | Notícias diárias de lesões e suspensões da Premier League e outras ligas, cruzadas com contexto de apostas |
| Footy Gazette | `footygazette.com` | 3 | nicho | Blog de futebol com artigos explicativos dedicados ao formato e noticias da Champions League |
| FootyChat Blog | `blog.footychat.app` | 3 | nicho | Blog com pagina de competicao dedicada a cobertura da UEFA Champions League |
| Footymind | `footymind.com` | 3 | estatisticas-dados | Previsões de futebol baseadas em análise de dados, cobrindo mais de 50 ligas incluindo a Premier League |
| Goal Pundit | `goalpundit.com` | 3 | nicho | Blog de futebol com categoria dedicada a torneios internacionais, incluindo cobertura de UEFA Champions League |
| Goals Without Borders | `goalswithoutborders.com` | 3 | nicho | Reportagens sobre como a altitude de cidades sul-americanas (La Paz, Quito) vira vantagem competitiva na Libertadores. |
| Injuries and Suspensions | `injuriesandsuspensions.com` | 3 | nicho | Team news diario de lesoes e suspensoes para mais de 100 ligas de futebol |
| Injuries.dk | `injuries.dk` | 3 | nicho | Lista de suspensoes das principais ligas de futebol por time e jogador |
| InjuryAndSuspension.com | `injuryandsuspension.com` | 3 | nicho | Tracker dedicado de lesoes e suspensoes cruzando Premier League, La Liga, Serie A e Bundesliga |
| MissesNextMatch | `missesnextmatch.com` | 3 | nicho | Tracker de lesoes, suspensoes e ausencias em tempo real nas principais ligas europeias |
| MyBankroll | `mybankroll.io` | 3 | apostas-odds | Guia de apostas sobre como clima, altitude, viagem e tipo de gramado dos estádios afetam mercados na Copa do Mundo 2026. |
| OddsExplorer | `oddsexplorer.com` | 3 | apostas-odds | Comparador de odds de futebol com navegação por liga e mercado entre múltiplos operadores. |
| Performance Odds | `performanceodds.com` | 3 | apostas-odds | Rastreador de 'dropping odds' (queda brusca de odds) em futebol, sinal usado para detectar dinheiro sharp entrando no mercado. |
| Pikkit | `pikkit.com` | 3 | nicho | Plataforma de tracking de apostas com cálculo automático de closing line value (CLV) por aposta registrada. |
| Scanbet | `scanbet.io` | 3 | nicho | Ferramenta de escaneamento de movimento de odds entre casas para detectar oportunidades de valor e sharp money. |
| SharpLine | `sharpline-app.com` | 3 | nicho | App de análise de linhas sharp e movimento de mercado para apostadores que seguem dinheiro profissional. |
| Signal Odds | `signalodds.com` | 3 | nicho | Plataforma de sinais de movimento de linha para identificar onde o dinheiro sharp está se movendo no mercado de apostas. |
| Soccer Wizdom | `soccerwizdom.com` | 3 | tatico-analise | Análise de como calendários apertados (múltiplas competições, datas FIFA) geram fadiga física e mental nos elencos. |
| Sportsfields.info | `sportsfields.info` | 3 | nicho | Hub global de notícias sobre infraestrutura, qualidade e manutenção de gramados esportivos (natural, híbrido e sintético) por região. |
| Starting 11 Injuries | `starting11.com` | 3 | nicho | Noticias ao vivo de lesoes e suspensoes na Premier League, La Liga, Serie A e Bundesliga |
| Statz | `statz.ai` | 3 | nicho | Ferramenta de tracking de movimento de linha (line moves) em apostas esportivas, incluindo futebol. |
| The Punt Lab | `thepuntlab.com` | 3 | apostas-odds | Conteúdo de apostas sobre congestionamento de calendário e rodízio de elenco como vantagem identificável no mercado. |
| Ventusky | `ventusky.com` | 3 | nicho | Mais de 50 camadas de previsão (vento, chuva, temperatura) em mapa interativo para conferir o clima no horário exato da partida. |
| Win Full Time | `winfulltime.com` | 3 | apostas-odds | Conteúdo de apostas sobre como congestionamento de calendário e fadiga afetam mercados de resultado e gols. |
| Women Football Blog | `womenfootball.blog` | 3 | nicho | Atualizacoes de transferencias, previas de jogos e insights de ligas ao redor do mundo |
| World Football Analysis | `worldfootballanalysis.com` | 3 | tatico-analise | Análise tática de como o congestionamento de calendário afeta recuperação física, profundidade de elenco e desempenho das equipes. |
| tips.gg | `tips.gg` | 3 | nicho | Ranking semanal de tipsters de futebol com ROI e taxa de acerto rastreados a partir de milhares de dicas |
| wbookie | `wbookie.com` | 3 | nicho | Ranking de tipsters de futebol por taxa de acerto e ROI, com histórico de apostas verificado |

---

*Gerado por workflow de 82 agentes Sonnet em 2026-07-20. 393 fontes novas listadas.*