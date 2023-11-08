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
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.appendChild(globalStyles.content.cloneNode(true));

    this.shadowRoot.getElementById('logo').addEventListener('click', () => {
      location.href='/';
    });
  }
}

window.customElements.define('hra-app-shell', HraAppShell);
