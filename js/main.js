// Construye las tarjetas de proyectos a partir del array "projects"
const grid = document.getElementById("works-grid");

grid.innerHTML = projects
  .map(function (project) {
    return `
      <a class="project" href="${project.url}">
        <img class="project__cover" src="${project.cover}" alt="">
        <img class="project__frame" src="img/proejctsframe.svg" alt="">
        <span class="visually-hidden">${project.title}</span>
      </a>
    `;
  })
  .join("");
// ---------- Cambio de idioma ----------
const langButton = document.getElementById("lang-btn");

function setLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = translations[lang][el.dataset.i18n];
  });

  // El botón muestra el idioma al que se puede cambiar
  langButton.textContent = lang === "en" ? "ES" : "EN";
  langButton.setAttribute(
    "aria-label",
    lang === "en" ? "Cambiar a español" : "Switch to English",
  );

  localStorage.setItem("lang", lang); // recuerda la elección
}

langButton.addEventListener("click", function () {
  const current = document.documentElement.lang;
  setLanguage(current === "en" ? "es" : "en");
});

// Al cargar: idioma guardado, o el del navegador, o inglés
const saved = localStorage.getItem("lang");
const browserIsSpanish = navigator.language.startsWith("es");
setLanguage(saved || (browserIsSpanish ? "es" : "en"));
