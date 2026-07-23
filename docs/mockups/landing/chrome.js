/**
 * Chrome compartilhado — injeta nav + footer em [data-chrome-nav] / [data-chrome-footer].
 * Páginas setam data-page="index|produto|assistente|alertas|auditoria|tipsters|precos|jogo-responsavel"
 */
;(() => {
  const page = document.body?.dataset.page || "index"

  const links = [
    { href: "produto.html", id: "produto", label: "Produto" },
    { href: "assistente.html", id: "assistente", label: "Assistente" },
    { href: "alertas.html", id: "alertas", label: "Alertas" },
    { href: "auditoria.html", id: "auditoria", label: "Auditoria" },
    { href: "tipsters.html", id: "tipsters", label: "Tipsters" },
    { href: "precos.html", id: "precos", label: "Planos" },
  ]

  const navLinks = links
    .map(
      (l) =>
        `<a href="${l.href}"${l.id === page ? ' class="active" aria-current="page"' : ""}>${l.label}</a>`
    )
    .join("")

  const navHtml = `
    <div class="wrap nav-in">
      <a class="brand" href="index.html" aria-label="mrtip, início">mr<span class="brand-dot" aria-hidden="true"></span>tip</a>
      <nav class="nav-links" aria-label="Navegação principal">${navLinks}</nav>
      <div class="nav-actions">
        <a class="nav-login" href="precos.html">Entrar</a>
        <a class="btn btn-primary btn-small" href="precos.html">Pedir acesso</a>
      </div>
      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `

  const footerHtml = `
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="index.html">mr<span class="brand-dot" aria-hidden="true"></span>tip</a>
          <p>Copiloto de futebol que fala probabilidade, não promessa. Dados, modelo e histórico auditável num só lugar.</p>
        </div>
        <div class="footer-col">
          <h4>Produto</h4>
          <a href="produto.html">Dossiê &amp; hub</a>
          <a href="assistente.html">Assistente</a>
          <a href="alertas.html">Alertas</a>
          <a href="auditoria.html">Auditoria</a>
        </div>
        <div class="footer-col">
          <h4>Para quem</h4>
          <a href="tipsters.html">Tipsters</a>
          <a href="precos.html">Planos</a>
          <a href="index.html">Apostadores</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="jogo-responsavel.html">Jogo responsável</a>
          <a href="jogo-responsavel.html#avisos">Avisos +18</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>Mock de marketing · sem garantia de ganho · +18</span>
        <a href="jogo-responsavel.html">Jogo responsável</a>
      </div>
    </div>
  `

  const navSlot = document.querySelector("[data-chrome-nav]")
  if (navSlot) {
    navSlot.classList.add("site-nav")
    navSlot.innerHTML = navHtml
  }

  const footSlot = document.querySelector("[data-chrome-footer]")
  if (footSlot) {
    footSlot.classList.add("site-footer")
    footSlot.innerHTML = footerHtml
  }
})()
