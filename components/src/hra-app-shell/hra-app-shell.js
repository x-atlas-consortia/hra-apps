import './global-styles.js';
import cssString from './hra-app-shell.css';
import templateString from './hra-app-shell.html';

const template = document.createElement('template');
template.innerHTML = `<style>${cssString}</style>\n${templateString}`;

class HraAppShell extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.getElementById('logo').addEventListener('click', () => {
      location.href='/';
    });
  }
}

window.customElements.define('hra-app-shell', HraAppShell);
