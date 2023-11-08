import cssString from './hra-app-shell.css';
import templateString from './hra-app-shell.html';

const globalStyles = document.createElement('template');
globalStyles.innerHTML = `<style>${cssString}</style>`;

const template = document.createElement('template');
template.innerHTML = templateString;

// Apply styles globally (normally not good for web components, but necessary for a full app shell)
document.addEventListener('DOMContentLoaded', async () => {  
  document.head.appendChild(globalStyles.content.cloneNode(true));
  await Promise.allSettled([customElements.whenDefined('hra-app-shell')]);
  document.body.style.visibility = 'visible';
});

class HraAppShell extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const root = this.shadowRoot;
    root.appendChild(template.content.cloneNode(true));
    root.appendChild(globalStyles.content.cloneNode(true));

    root.getElementById('logo').addEventListener('click', () => {
      const url = this.getAttribute('logo-url') || '/';
      location.href = url;
    });
  }

  connectedCallback() {
    const root = this.shadowRoot;
    const logoText = this.getAttribute('logo-text');
    if (logoText) {
      root.getElementById('logo').innerHTML = logoText;
    }
  }
}

window.customElements.define('hra-app-shell', HraAppShell);
