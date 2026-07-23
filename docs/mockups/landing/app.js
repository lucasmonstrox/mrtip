/**
 * Interatividade da landing mrtip — reveal, menu, typewriter, tabs, ledger, FAQ, etc.
 */
;(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  /* ——— Nav scroll + mobile menu ——— */
  const nav = document.querySelector(".site-nav")
  const toggle = document.querySelector(".menu-toggle")

  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 8)
  }
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })

  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open") ?? false
    toggle.setAttribute("aria-expanded", String(open))
  })

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open")
      toggle?.setAttribute("aria-expanded", "false")
    })
  })

  /* ——— Scroll reveal ——— */
  const revealItems = document.querySelectorAll("[data-reveal]")
  if (reduced || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("visible"))
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add("visible")
          io.unobserve(e.target)
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    revealItems.forEach((el) => io.observe(el))
  }

  /* ——— Count-up metrics ——— */
  const metrics = document.querySelectorAll("[data-count]")
  const runCount = (el) => {
    const target = Number(el.dataset.count || 0)
    const decimals = Number(el.dataset.decimals || 0)
    const duration = 1200
    if (reduced) {
      el.textContent = target.toFixed(decimals)
      return
    }
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      el.textContent = (target * eased).toFixed(decimals)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  if (metrics.length) {
    if (reduced) {
      metrics.forEach(runCount)
    } else if ("IntersectionObserver" in window) {
      const mio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            runCount(e.target)
            mio.unobserve(e.target)
          })
        },
        { threshold: 0.4 }
      )
      metrics.forEach((el) => mio.observe(el))
    } else {
      metrics.forEach(runCount)
    }
  }

  /* ——— Typewriter helper ——— */
  function typeText(el, text, speed = 28) {
    return new Promise((resolve) => {
      if (reduced) {
        el.textContent = text
        resolve()
        return
      }
      let i = 0
      el.textContent = ""
      const cursor = document.createElement("span")
      cursor.className = "cursor"
      el.appendChild(cursor)
      const id = setInterval(() => {
        if (i >= text.length) {
          clearInterval(id)
          cursor.remove()
          resolve()
          return
        }
        el.insertBefore(document.createTextNode(text[i]), cursor)
        i += 1
      }, speed)
    })
  }

  function sleep(ms) {
    return reduced ? Promise.resolve() : new Promise((r) => setTimeout(r, ms))
  }

  /* ——— Home: live analysis sequence ——— */
  async function runLiveAnalysis() {
    const root = document.querySelector("[data-live-analysis]")
    if (!root) return

    const bubble = root.querySelector("[data-type-question]")
    const question =
      bubble?.dataset.text ||
      "Como está Palmeiras × Corinthians pra cartões hoje?"

    if (bubble) {
      bubble.classList.add("show")
      await typeText(bubble.querySelector(".typed") || bubble, question, 22)
    }

    await sleep(400)

    const rows = root.querySelectorAll(".evidence-row")
    for (const row of rows) {
      row.classList.add("show")
      await sleep(280)
    }

    await sleep(350)
    root.querySelector(".pick-card")?.classList.add("show")
  }

  if (document.querySelector("[data-live-analysis]")) {
    if (reduced) {
      document
        .querySelectorAll(
          "[data-live-analysis] .chat-bubble, [data-live-analysis] .evidence-row, [data-live-analysis] .pick-card"
        )
        .forEach((el) => el.classList.add("show"))
      const b = document.querySelector("[data-type-question]")
      if (b) {
        const t = b.dataset.text || ""
        const typed = b.querySelector(".typed")
        if (typed) typed.textContent = t
        else b.textContent = t
      }
    } else {
      const start = () => runLiveAnalysis()
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              start()
              io.disconnect()
            }
          },
          { threshold: 0.25 }
        )
        io.observe(document.querySelector("[data-live-analysis]"))
      } else {
        start()
      }
    }
  }

  /* ——— Assistente: chat sequence ——— */
  async function runChatDemo() {
    const root = document.querySelector("[data-chat-demo]")
    if (!root) return
    const msgs = root.querySelectorAll(".chat-msg")
    for (const msg of msgs) {
      msg.classList.add("show")
      await sleep(Number(msg.dataset.delay || 550))
    }
  }

  if (document.querySelector("[data-chat-demo]")) {
    if (reduced) {
      document
        .querySelectorAll("[data-chat-demo] .chat-msg")
        .forEach((m) => m.classList.add("show"))
    } else {
      const el = document.querySelector("[data-chat-demo]")
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            runChatDemo()
            io.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      io.observe(el)
    }
  }

  /* ——— Chat compose mock ——— */
  const compose = document.querySelector("[data-chat-compose]")
  if (compose) {
    const input = compose.querySelector("input")
    const btn = compose.querySelector("button")
    const list = document.querySelector("[data-chat-demo]")
    const reply = () => {
      const text = (input?.value || "").trim()
      if (!text || !list) return
      const user = document.createElement("div")
      user.className = "chat-msg out show"
      user.textContent = text
      list.appendChild(user)
      input.value = ""
      setTimeout(() => {
        const bot = document.createElement("div")
        bot.className = "chat-msg in show"
        bot.innerHTML =
          "Mock: eu cruzaria árbitro, desfalques e a linha atual — e mostraria o <b>porquê</b> antes de qualquer leitura. <span class=\"meta\"><span class=\"tag cyan\">evidência</span><span class=\"time\">agora</span></span>"
        list.appendChild(bot)
        list.scrollTop = list.scrollHeight
      }, reduced ? 0 : 600)
    }
    btn?.addEventListener("click", reply)
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") reply()
    })
  }

  /* ——— Tabs ——— */
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const buttons = root.querySelectorAll(".tab-btn")
    const panels = root.querySelectorAll(".tab-panel")
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.tab
        buttons.forEach((b) => b.classList.toggle("active", b === btn))
        panels.forEach((p) =>
          p.classList.toggle("active", p.dataset.panel === id)
        )
        if (id === "dossie") animateSignals(root)
        if (id === "value") {
          /* no-op visual already in CSS */
        }
      })
    })
  })

  function animateSignals(scope = document) {
    const signals = scope.querySelectorAll(".signal")
    signals.forEach((s, i) => {
      setTimeout(
        () => s.classList.add("show"),
        reduced ? 0 : 80 + i * 120
      )
    })
  }

  /* Auto-run signals on produto if panel already active */
  if (document.querySelector(".signal")) {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animateSignals()
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    const first = document.querySelector(".signal-list") || document.querySelector(".signal")
    if (first) obs.observe(first)
  }

  /* ——— Alert builder typewriter ——— */
  async function runAlertBuilder() {
    const root = document.querySelector("[data-alert-builder]")
    if (!root) return
    const typed = root.querySelector(".typed")
    const text =
      root.dataset.text ||
      "um dos 3 maiores marcadores enfrentar um time com o zagueiro titular fora"
    if (typed) await typeText(typed, text, 18)
    await sleep(200)
    root.querySelectorAll(".criteria .tag").forEach((tag, i) => {
      setTimeout(() => tag.classList.add("show"), reduced ? 0 : i * 140)
    })
  }

  if (document.querySelector("[data-alert-builder]")) {
    if (reduced) {
      const root = document.querySelector("[data-alert-builder]")
      const typed = root.querySelector(".typed")
      if (typed) typed.textContent = root.dataset.text || ""
      root.querySelectorAll(".criteria .tag").forEach((t) => t.classList.add("show"))
    } else {
      const el = document.querySelector("[data-alert-builder]")
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            runAlertBuilder()
            io.disconnect()
          }
        },
        { threshold: 0.3 }
      )
      io.observe(el)
    }
  }

  /* ——— Ledger filters + reveal ——— */
  const ledger = document.querySelector("[data-ledger]")
  if (ledger) {
    const rows = ledger.querySelectorAll(".ledger-row")
    const filters = ledger.querySelectorAll(".filter-btn")

    const showRows = () => {
      rows.forEach((row, i) => {
        if (row.classList.contains("hidden")) return
        setTimeout(() => row.classList.add("show"), reduced ? 0 : i * 60)
      })
    }

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.toggle("active", b === btn))
        const f = btn.dataset.filter
        rows.forEach((row) => {
          const match =
            f === "all" || row.dataset.result === f
          row.classList.toggle("hidden", !match)
          if (match) row.classList.add("show")
        })
      })
    })

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          showRows()
          ledger.querySelector(".sparkline")?.classList.add("show")
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(ledger)
  }

  /* ——— FAQ accordion ——— */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q")
    q?.addEventListener("click", () => {
      const open = item.classList.toggle("open")
      q.setAttribute("aria-expanded", String(open))
    })
  })

  /* ——— Responsible checklist toggle ——— */
  document.querySelectorAll("[data-check-card]").forEach((card) => {
    card.addEventListener("click", () => {
      const mode = card.dataset.checkCard
      if (mode === "on") {
        card.classList.toggle("on")
        card.classList.remove("off")
      } else {
        card.classList.toggle("off")
        card.classList.remove("on")
      }
    })
  })

  /* ——— Tipster mini chart draw ——— */
  const mini = document.querySelector("[data-mini-chart]")
  if (mini) {
    const points = [12, 18, 15, 22, 28, 24, 31, 35, 32, 40, 38, 45]
    const w = 280
    const h = 56
    const max = Math.max(...points)
    const min = Math.min(...points)
    const coords = points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * w
        const y = h - ((p - min) / (max - min || 1)) * (h - 8) - 4
        return `${x},${y}`
      })
      .join(" ")
    mini.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <polyline fill="none" stroke="#6ad0ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${coords}" />
    </svg>`
  }
})()
