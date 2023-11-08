import cssString from './hra-app-shell.css';
import templateString from './hra-app-shell.html';

// Apply styles globally (normally not good for web components, but necessary for a full app shell)
document.addEventListener('DOMContentLoaded', async () => {
  const globalStyles = document.createElement('template');
  globalStyles.innerHTML = `<style>${cssString}</style>`;
  document.head.appendChild(globalStyles.content.cloneNode(true));
});

class HraAppShell extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      this.innerHTML = templateString.replace('<slot></slot>', this.innerHTML);
      document.body.style.visibility = 'visible';

      const root = this.getRootNode();
      root.getElementById('logo').addEventListener('click', () => {
        location.href = '/';
      });
    }, 100);
  }
}

window.customElements.define('hra-app-shell', HraAppShell);
