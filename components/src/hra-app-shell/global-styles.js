import globalCssString from './global-styles.css';

// Set required global styles
document.addEventListener('DOMContentLoaded', async () => {
  const globalStyles = document.createElement('template');
  globalStyles.innerHTML = `<style>${globalCssString}</style>`;

  document.body.appendChild(globalStyles.content.cloneNode(true));

  await Promise.allSettled([customElements.whenDefined('hra-app-shell')]);

  document.body.style.visibility = 'visible';
});
