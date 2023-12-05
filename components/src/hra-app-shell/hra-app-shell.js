import globalCssString from './hra-app-shell.global.css';
import cssString from './hra-app-shell.css';
import templateString from './hra-app-shell.html';
import menuIconString from '../assets/hamburger_icon.svg';
import openInNew from '../assets/open_in_new.svg'

const globalStyles = document.createElement('template');
globalStyles.innerHTML = `<style>${globalCssString.replaceAll('OPEN_IN_NEW_ICON', openInNew)}</style>`;

const template = document.createElement('template');
template.innerHTML = `${templateString}<style>${cssString.replaceAll('OPEN_IN_NEW_ICON', openInNew)}</style>`;

// Apply styles globally (normally not good for web components, but necessary for a full app shell)
document.addEventListener('DOMContentLoaded', async () => {
  document.head.appendChild(globalStyles.content.cloneNode(true));
  await Promise.allSettled([customElements.whenDefined('hra-app-shell')]);
  document.body.style.visibility = 'visible';
});

class HraAppShell extends HTMLElement {
  $logo;
  $github;
  $logoSmall;
  $menuContent;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));
    this.$logo = root.getElementById('logo');
    this.$logoSmall = root.getElementById('logo-small');
    this.$github = root.getElementById('github-corner');
    this.$menuContent = root.getElementById('menu-content');

    const menuBtn = root.getElementById('menu-btn');
    const navMenu = root.getElementById('nav-menu');
    const menuIcon = root.getElementById('menu-icon');
    menuIcon.setAttribute('src', menuIconString);

    const toggleMenu = (event) => {
      event.stopPropagation();
      navMenu.classList.toggle('hide');
    }

    menuBtn.addEventListener('click', toggleMenu);

    function closeMenuIfClickedOutside(event) {
      if (!navMenu.classList.contains('hide')) {
        navMenu.classList.add('hide')
      }
    }

    root.addEventListener('click', closeMenuIfClickedOutside);
  }

  connectedCallback() {
    this.logoText = this.getAttribute('logo-text') || 'Human Reference Atlas';
    this.logoTextSmall = this.getAttribute('logo-text-small') || this.getAttribute('logo-text') || 'HRA';
    this.logoUrl = this.getAttribute('logo-url');
    this.githubUrl = this.getAttribute('github-url');
    this.hideMenu = this.hasAttribute('hide-menu');
  }

  get hideMenu() {
    return this.hasAttribute('hide-menu');
  }

  set hideMenu(value) {
    if (value) {
      this.setAttribute('hide-menu', '');
      this.$menuContent.style.display = 'none';
    } else {
      this.removeAttribute('hide-menu');
      this.$menuContent.style.display = 'block';
    }
  }

  get githubUrl() {
    return this.getAttribute('github-url');
  }

  set githubUrl(url) {
    this.$github.style.display = url?.trim().length > 0 ? 'block' : 'none';
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

  get smallLogoText() {
    return this.getAttribute('logo-text-small');
  }

  set smallLogoText(str) {
    this.$logoSmall.innerHTML = str;
    if (str !== this.logoTextSmall) {
      this.setAttribute('logo-text-small', str);
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
    this.$logo.style.cursor = str ? 'pointer' : 'default';
    if (str !== this.logoUrl) {
      this.setAttribute('logo-url', str);
    }
  }
}

window.customElements.define('hra-app-shell', HraAppShell);
