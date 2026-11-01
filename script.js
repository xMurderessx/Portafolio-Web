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

// Añade proyectos a cada categoría con { src: "ruta", title: "Título" }.
const projectCategories = {
  illustrator: { title: "Adobe Illustrator", projects: [
    { src: "images/Proyectos/Ai/Tarjeta de presentación3.png", title: "Tarjeta de presentación" },
    { src: "images/Proyectos/Ai/Paper_Bag_Mockup_1.jpg", title: "Bolsa · Mockup" },
    { src: "images/Proyectos/Ai/Packaging_Box_Mockup_1.jpg", title: "Packaging · Mockup" },
    { src: "images/Proyectos/Ai/mokup - DTF UV.png", title: "DTF UV · Mockup" },
    { src: "images/Proyectos/Ai/ESTARA OSCURO_page-0001.jpg", title: "Estará oscuro · Página 1" },
    { src: "images/Proyectos/Ai/ESTARA OSCURO_page-0002.jpg", title: "Estará oscuro · Página 2" }
  ] },
  photoshop: { title: "Adobe Photoshop", projects: [
    { src: "images/Proyectos/Ps/Bocetos.png", title: "Bocetos" },
    { src: "images/Proyectos/Ps/cartel.mp4", title: "Cartel animado", type: "video" }
  ] },
  animate: {
    title: "Adobe Animate",
    projects: [
      { src: "images/Proyectos/An/ojo.gif", title: "Ojo animado" },
      { src: "images/Proyectos/An/ojo-rebotando.gif", title: "Ojo rebotando" },
      { src: "images/Proyectos/An/interpolaciones.gif", title: "Interpolaciones" },
      { src: "images/Proyectos/An/clase-emparentar.gif", title: "Emparentar objetos" }
    ]
  },
  dibujo: {
    title: "Dibujo e ilustración",
    projects: [
      { src: "images/Proyectos/Dibujo/Personaje.jpg", title: "Personaje" },
      { src: "images/Proyectos/Dibujo/Marca.png", title: "Marca" },
      { src: "images/Proyectos/Dibujo/DOC-20260813-WA0023.png", title: "Ilustración" },
      { src: "images/Proyectos/Dibujo/15_sin_titulo_20260823165608.png", title: "Sin título" }
    ]
  },
  fotografia: {
    title: "Fotografía",
    projects: [
      "DSC_0165.JPG",
      "IMG_20250602_143756_516.jpg",
      "20220830_183310.jpg",
      "20230820_071224.jpg",
      "IMG_20260325_092342_600.jpg",
      "IMG_20250430_094440_299.jpg",
      "IMG_20250424_173718_164.jpg",
      "IMG_20250417_114303_218_copyIMG_20250416_081900_672.jpg",
      "IMG_20250322_184741_344.jpg",
      "IMG_20250307_211853_487_copyIMG_20250226_151246_558_20260420_011327.jpg",
      "IMG_20250223_061110_484_20260420_011144.jpg",
      "IMG_20241214_185758_281.jpg",
      "IMG_20241030_184912_377.jpg",
      "IMG_20241019_185013_005.jpg",
      "IMG_20240314_070136.jpg"
    ].map((filename, index) => ({
      src: `images/Proyectos/Fotos/${filename}`,
      title: `Fotografía ${index + 1}`
    }))
  },
  // Añade tarjetas con title, description, liveUrl, repoUrl y thumbnail (opcional).
  github: { title: "GitHub · Desarrollo web", projects: [
    {
      type: "website",
      title: "Burgerhouse Caffee",
      liveUrl: "https://xmurderessx.github.io/Burgerhouse_Caffee/",
      repoUrl: "https://github.com/xmurderessx/Burgerhouse_Caffee",
      embed: true
    },
    {
      type: "website",
      title: "InkVerse",
      liveUrl: "https://xmurderessx.github.io/InkVerse/",
      repoUrl: "https://github.com/xmurderessx/InkVerse",
      embed: true
    },
    {
      type: "website",
      title: "CreepWeb",
      liveUrl: "https://xmurderessx.github.io/CreepWeb/",
      repoUrl: "https://github.com/xmurderessx/CreepWeb",
      embed: true
    },
    {
      type: "website",
      title: "ka-Fe Vadit",
      liveUrl: "https://xmurderessx.github.io/ka-Fe_Vadit/",
      repoUrl: "https://github.com/xmurderessx/ka-Fe_Vadit",
      embed: true
    }
  ] }
};

const categoryButtons = document.querySelectorAll(".skill-square[data-category]");
const projectGallery = document.querySelector("#projectGallery");
const projectGrid = document.querySelector("#projectGrid");
const galleryTitle = document.querySelector("#galleryTitle");

function projectLink(label, url) {
  const link = document.createElement("a");
  link.className = "project-action";
  link.textContent = label;
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${label} (nueva pestaña)`);
  return link;
}

function websiteCard(project) {
  const card = document.createElement("article");
  card.className = "project-card website-card";
  const preview = document.createElement(project.liveUrl && !project.embed ? "a" : "div");
  preview.className = "website-preview";
  if (project.liveUrl && !project.embed) {
    preview.href = project.liveUrl;
    preview.target = "_blank";
    preview.rel = "noopener noreferrer";
    preview.setAttribute("aria-label", `Visitar ${project.title} (nueva pestaña)`);
  }
  const chrome = document.createElement("div");
  chrome.className = "browser-bar";
  chrome.textContent = "● ● ●  / " + project.title;
  preview.append(chrome);
  if (project.embed) {
    const frame = document.createElement("iframe");
    frame.className = "website-frame";
    frame.title = `Vista interactiva de ${project.title}`;
    frame.loading = "eager";
    frame.referrerPolicy = "no-referrer";
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
    frame.src = project.liveUrl;
    preview.append(frame);
  } else if (project.thumbnail) {
    const img = document.createElement("img");
    img.src = project.thumbnail;
    img.alt = `Vista previa de ${project.title}`;
    img.loading = "lazy";
    preview.append(img);
  } else {
    const mockup = document.createElement("div");
    mockup.className = "website-mockup";
    const logo = document.createElement("img");
    logo.src = "images/Logo/Marca.svg";
    logo.alt = "";
    const title = document.createElement("strong");
    title.textContent = project.title;
    const label = document.createElement("span");
    label.textContent = "DISEÑO · CREATIVIDAD · DESARROLLO WEB";
    mockup.append(logo, title, label);
    preview.append(mockup);
  }
  const body = document.createElement("div");
  body.className = "website-body";
  const heading = document.createElement("h4");
  heading.textContent = project.title;
  const actions = document.createElement("div");
  actions.className = "project-actions";
  if (project.liveUrl) actions.append(projectLink("Ver página", project.liveUrl));
  if (project.repoUrl) actions.append(projectLink("Ver repositorio", project.repoUrl));
  body.append(heading, actions);
  card.append(preview, body);
  return card;
}

function selectProjectCategory(categoryKey) {
  const category = projectCategories[categoryKey];
  if (!category || !projectGallery || !projectGrid || !galleryTitle) return;

  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === categoryKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  galleryTitle.textContent = category.title;
  projectGrid.classList.toggle("project-grid--github", categoryKey === "github");
  projectGrid.querySelectorAll("video").forEach((video) => video.pause());
  const cards = category.projects.map((project) => {
    if (project.type === "website") return websiteCard(project);
    const card = document.createElement("figure");
    card.className = "project-card";

    const caption = document.createElement("figcaption");
    caption.textContent = project.title;
    if (project.type === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", project.title);
      const source = document.createElement("source");
      source.src = project.src;
      source.type = "video/mp4";
      video.append(source, projectLink("Abrir video", project.src));
      card.append(video, caption);
      return card;
    }

    const link = document.createElement("a");
    link.href = project.src;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Ver ${project.title} en tamaño completo (nueva pestaña)`);

    const img = document.createElement("img");
    img.src = project.src;
    img.alt = project.title;
    img.loading = "lazy";
    img.decoding = "async";

    link.append(img);
    card.append(link, caption);
    return card;
  });

  projectGrid.replaceChildren(...cards);
  projectGallery.hidden = false;
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => selectProjectCategory(button.dataset.category));
});
