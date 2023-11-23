import templateString from './hra-app.html';
import cssString from './hra-app.css';
import globalCssString from '../hra-app-shell/hra-app-shell.global.css';

const globalStyles = document.createElement('template');
globalStyles.innerHTML = `<style>${globalCssString}</style>`;

const template = document.createElement('template');
template.innerHTML = `${templateString}<style>${cssString}</style>`;

document.addEventListener('DOMContentLoaded', async () => {
  document.head.appendChild(globalStyles.content.cloneNode(true));
  await Promise.allSettled([customElements.whenDefined('hra-app')]);
  document.body.style.visibility = 'visible';
});

class AppShell extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('hra-app', AppShell);