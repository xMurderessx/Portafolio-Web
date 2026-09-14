const entryScreen = document.querySelector("#entryScreen");
const sigilButton = document.querySelector("#sigilButton");
const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const revealElements = document.querySelectorAll(".reveal-on-scroll");

let hasOpened = false;
let touchIsArmed = false;

function openPortfolio() {
  if (hasOpened) return;

  hasOpened = true;
  document.body.classList.add("is-opening");
  sigilButton.classList.add("is-activating");

  window.setTimeout(() => {
    entryScreen.classList.add("is-revealing");
    document.body.classList.add("portfolio-open");
  }, 420);

  window.setTimeout(() => {
    document.body.classList.remove("is-opening");
    entryScreen.setAttribute("aria-hidden", "true");
    revealVisibleElements();
  }, 1450);
}

function handleSigilClick(event) {
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (isCoarsePointer && !touchIsArmed) {
    event.preventDefault();
    touchIsArmed = true;
    sigilButton.classList.add("is-armed");
    sigilButton.setAttribute("aria-label", "Toca otra vez para abrir el portafolio");
    return;
  }

  openPortfolio();
}

function revealVisibleElements() {
  revealElements.forEach((element) => {
    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.92) {
      element.classList.add("is-visible");
    }
  });
}

function setupScrollReveal() {
  if (!("IntersectionObserver" in window)) {
    revealVisibleElements();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealElements.forEach((element) => observer.observe(element));
}

sigilButton.addEventListener("click", handleSigilClick);
sigilButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openPortfolio();
  }
});

sigilButton.addEventListener("pointerleave", () => {
  if (!hasOpened && !window.matchMedia("(pointer: coarse)").matches) {
    sigilButton.classList.remove("is-armed");
  }
});

if (menuToggle && mobileMenu) {
  const closeMobileMenu = () => {
    menuToggle.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  };

  menuToggle.addEventListener("click", () => {
    const willOpen = !mobileMenu.classList.contains("is-open");

    menuToggle.classList.toggle("is-open", willOpen);
    mobileMenu.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

setupScrollReveal();
