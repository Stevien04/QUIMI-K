// RNF003: preferencia visual local, independiente de usuarios y calificaciones.
(() => {
  const storageKey = 'quimik-theme';
  const root = document.documentElement;
  let theme = 'light';
  try {
    if (localStorage.getItem(storageKey) === 'dark') theme = 'dark';
  } catch (_) {
    // El tema sigue disponible aunque el navegador bloquee el almacenamiento.
  }
  root.dataset.theme = theme;

  function updateControls(saved = true) {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.querySelector('[data-theme-label]').textContent = theme === 'dark' ? 'Modo oscuro' : 'Modo claro';
      button.title = `Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}${saved ? '' : ' (preferencia disponible solo en esta ventana)'}`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateControls();
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = theme;
        let saved = true;
        try {
          localStorage.setItem(storageKey, theme);
        } catch (_) {
          saved = false;
        }
        updateControls(saved);
      });
    });
  });
})();
