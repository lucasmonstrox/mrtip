const nav = document.querySelector(".nav")
const toggle = document.querySelector(".menu-toggle")

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

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches
const revealItems = document.querySelectorAll("[data-reveal]")

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"))
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("visible")
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12 }
  )

  revealItems.forEach((item) => observer.observe(item))
}
