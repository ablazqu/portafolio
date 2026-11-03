// Construye las tarjetas de proyectos a partir del array "projects"
const grid = document.getElementById("works-grid");

if (grid) {
  grid.innerHTML = projects
    .map(function (project) {
      return `
        <a class="project" href="${project.url}">
          <img class="project__cover" src="${project.cover}" alt="">
          <img class="project__frame" src="img/marco.svg" alt="">
          <span class="visually-hidden">${project.title}</span>
        </a>
      `;
    })
    .join("");
}
// ---------- Cambio de idioma ----------
// ---------- Cambio de idioma ----------
const langButton = document.getElementById('lang-btn');
const LANG_KEY = 'blaz-lang';   // nombre con el que se guarda la elección

function setLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const text = translations[lang][el.dataset.i18n];
    if (text) {
      el.textContent = text;
    }
  });

  // El botón muestra el idioma al que se puede cambiar
  langButton.textContent = lang === 'en' ? 'ES' : 'EN';
  langButton.setAttribute('aria-label', lang === 'en' ? 'Cambiar a español' : 'Switch to English');
}

langButton.addEventListener('click', function () {
  const next = document.documentElement.lang === 'en' ? 'es' : 'en';
  setLanguage(next);
  try {
    localStorage.setItem(LANG_KEY, next);   // solo se guarda cuando la PERSONA elige
  } catch (e) {}
});

// Al cargar cualquier página: el idioma que la persona eligió antes.
// Si nunca eligió, siempre inglés (se ignora el idioma del navegador).
let saved = null;
try {
  saved = localStorage.getItem(LANG_KEY);
} catch (e) {}
setLanguage(saved === 'es' ? 'es' : 'en');
