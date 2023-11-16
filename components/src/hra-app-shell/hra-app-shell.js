import globalCssString from './hra-app-shell.global.css';
import cssString from './hra-app-shell.css';
import templateString from './hra-app-shell.html';


const globalStyles = document.createElement('template');
globalStyles.innerHTML = `<style>${globalCssString}</style>`;

const template = document.createElement('template');
template.innerHTML = `${templateString}<style>${cssString}</style>`;

// Apply styles globally (normally not good for web components, but necessary for a full app shell)
document.addEventListener('DOMContentLoaded', async () => {
  document.head.appendChild(globalStyles.content.cloneNode(true));
  await Promise.allSettled([customElements.whenDefined('hra-app-shell')]);
  document.body.style.visibility = 'visible';
});

class HraAppShell extends HTMLElement {
  $logo;
  $github;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));
    this.$logo = root.getElementById('logo');
    this.$github = root.getElementById('github-corner');
  }

  connectedCallback() {
    this.logoText = this.getAttribute('logo-text') || 'Human Reference Atlas';
    this.logoUrl = this.getAttribute('logo-url');
    this.githubUrl = this.getAttribute('github-url');
  }

  get githubUrl() {
    return this.getAttribute('github-url');
  }

  set githubUrl(url) {
    this.$github.style.display = url ? 'block' : 'none';
    this.$github.href = url;
    if (url !== this.githubUrl) {
      this.setAttribute('github-url', url);
    }
  }

  get logoText() {
    return this.getAttribute('logo-text');
  }

  set logoText(str) {
    this.$logo.innerHTML = str;
    if (str !== this.logoText) {
      this.setAttribute('logo-text', str);
    }
  }

  get logoUrl() {
    return this.getAttribute('logo-url');
  }

  set logoUrl(str) {
    if (str) {
      this.$logo.setAttribute('href', str);
    } else {
      this.$logo.removeAttribute('href');
    }
    this.$logo.style.cursor = str ? 'pointer': 'default';
    if (str !== this.logoUrl) {
      this.setAttribute('logo-url', str);
    }
  }
}

window.customElements.define('hra-app-shell', HraAppShell);
