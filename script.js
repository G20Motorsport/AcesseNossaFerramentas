function setupCurrentYear() {
  const el = document.querySelector("[data-current-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileMenu() {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!button || !menu) return;

  function setOpen(next) {
    menu.hidden = !next;
    button.setAttribute("aria-expanded", next ? "true" : "false");
  }

  setOpen(false);
  button.addEventListener("click", () => setOpen(menu.hidden));
  menu.addEventListener("click", (e) => {
    if (e.target && e.target.matches("a")) setOpen(false);
  });
}

function setupTestimonialCarousel() {
  const root = document.querySelector("[data-testimonial-carousel]");
  if (!root) return;

  const track = root.querySelector(".testimonial-carousel-track");
  const groups = root.querySelectorAll(".testimonial-group");
  if (!track || groups.length === 0) return;

  const intervalMs = Number(root.getAttribute("data-carousel-interval")) || 5500;
  let index = 0;

  function goTo(i) {
    index = (i + groups.length) % groups.length;
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }

  goTo(0);

  if (groups.length < 2) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  window.setInterval(() => {
    goTo(index + 1);
  }, intervalMs);
}

setupCurrentYear();
setupMobileMenu();
setupTestimonialCarousel();
