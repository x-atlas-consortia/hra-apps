import '@material/web/button/filled-button';
import '@material/web/button/outlined-button';
import '@material/web/button/text-button';
import '@material/web/divider/divider';
import '@material/web/icon/icon';
import '@material/web/select/filled-select';
import '@material/web/select/select-option';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import componentDefs from './data/component-defs.json';
import organs from './data/organs.json';
import ftuMedicalIllustrationEmbedTemplate from './data/templates/ftu-medical-illustration.html';

// -------------------------------------------------------
// Data
// -------------------------------------------------------

const embedTemplates = {
  'ftu-medical-illustration': ftuMedicalIllustrationEmbedTemplate,
};

// -------------------------------------------------------
// Utilities
// -------------------------------------------------------

const resizeListeners = [];

const templateRefs = {};
function getTemplate(selector) {
  return (templateRefs[selector] ??= document.querySelector(selector));
}

function renderElement(element, renderers) {
  for (const [selector, render] of Object.entries(renderers)) {
    const subelement = element.querySelector(selector);
    render(subelement, selector, element);
  }

  return element;
}

function renderTemplateElement(template, renderers) {
  return renderElement(template.content.cloneNode(true), renderers);
}

function interpolateEmbedTemplate(template, replacements) {
  return template.replace(/{{(\w+?)}}/g, (_match, key) => replacements[key]);
}

function toggleHidden(element, selector) {
  renderElement(element, {
    [selector]: (el) => el.classList.toggle('hidden'),
  });
}

function clearAll() {
  const componentsEl = document.querySelector('#components');
  const overlayAppsEl = document.querySelector('#overlay-container .apps');

  componentsEl.replaceChildren();
  overlayAppsEl.replaceChildren();
  resizeListeners.length = 0;
}

// -------------------------------------------------------
// Highlight.js
// -------------------------------------------------------

function registerHljsLanguages() {
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('javascript', javascript);
}

// -------------------------------------------------------
// Organ select
// -------------------------------------------------------

function initOrganSelect() {
  const selectEl = document.querySelector('#organ-select');
  selectEl.replaceChildren(...organs.map(renderOrganSelectOption));
  selectEl.addEventListener('change', onOrganSelectChange);
}

function renderOrganSelectOption({ id, label }) {
  return renderTemplateElement(getTemplate('#organ-select-option-template'), {
    'md-select-option': (el) => el.setAttribute('value', id),
    '.label': (el) => (el.textContent = label),
  });
}

function onOrganSelectChange(event) {
  clearAll();

  const organId = event.target.value;
  const organ = organs.find((organ) => organ.id === organId);
  if (!organ) {
    return;
  }

  const componentsEl = document.querySelector('#components');
  for (const def of componentDefs) {
    const { id } = def;
    const embedTemplate = embedTemplates[id];
    const embedTemplateData = organ.appData[id];
    if (!embedTemplate || !embedTemplateData) {
      continue;
    }

    const component = renderComponent({
      ...def,
      embedTemplate,
      embedTemplateData,
      embedCode: interpolateEmbedTemplate(embedTemplate, embedTemplateData),
    });

    componentsEl.appendChild(component);
  }
}

// -------------------------------------------------------
// Components
// -------------------------------------------------------

function renderComponent(data) {
  const { title, description, previewImage, embedCode } = data;

  function renderInnerComponent(componentEl) {
    return renderElement(componentEl, {
      '.title': (el) => (el.textContent = title),
      '.description': (el) => (el.textContent = description),
      '.preview': (el) => (el.src = previewImage),
      '.actions': (el) => renderComponentActions(componentEl, el, data),
      '.embed-code': (el) => renderComponentEmbedCode(el, embedCode),
    });
  }

  return renderTemplateElement(getTemplate('#component-template'), {
    '.component': renderInnerComponent,
  });
}

function renderComponentActions(componentsEl, actionsEl, data) {
  const toggleEmbedCode = () => toggleHidden(componentsEl, '.embed-code');
  return renderElement(actionsEl, {
    '.launch': (el) => renderComponentActionLaunch(componentsEl, el, data),
    '.embed': (el) => el.addEventListener('click', toggleEmbedCode),
  });
}

function renderComponentActionLaunch(componentEl, launchEl, data) {
  switch (data.embedAs) {
    case 'inline':
      return renderComponentActionLaunchInline(componentEl, launchEl, data);
    case 'overlay':
      return renderComponentActionLaunchOverlay(launchEl, data);
    // TODO: case 'external'
    default:
      return launchEl;
  }
}

function renderComponentActionLaunchInline(componentEl, launchEl, data) {
  let appIframe = undefined;
  launchEl.addEventListener('click', () => {
    const containerEl = componentEl.querySelector('.embed-app');
    appIframe ??= renderComponentAppIframe(containerEl, data.embedCode, true);
    toggleHidden(componentEl, '.embed-app');
  });

  return launchEl;
}

function renderComponentActionLaunchOverlay(launchEl, data) {
  let appIframe = undefined;
  launchEl.addEventListener('click', () => {
    const overlayContainerEl = document.querySelector('#overlay-container');
    const appsEl = overlayContainerEl.querySelector('.apps');

    appIframe ??= renderComponentAppIframe(appsEl, data.embedCode, false);
    overlayContainerEl.classList.remove('hidden');
    appIframe.classList.remove('hidden');
  });

  return launchEl;
}

function renderComponentAppIframe(containerEl, code, watchHeight) {
  const iframe = document.createElement('iframe');
  containerEl.appendChild(iframe);

  const { contentDocument } = iframe;
  contentDocument.open();
  contentDocument.write(code);
  contentDocument.close();

  if (watchHeight) {
    const extraHeight = 16;
    const heightCheckFrequency = 50;
    function updateHeight() {
      const height = contentDocument.body.scrollHeight;
      console.log('updating height', height)
      if (height !== 0) {
        iframe.setAttribute('height', height + extraHeight);
      }

      return height;
    }

    const heightCheckTimer = setInterval(() => {
      if (updateHeight() !== 0) {
        clearInterval(heightCheckTimer);
      }
    }, heightCheckFrequency);

    resizeListeners.push(updateHeight);
  } else {
    contentDocument.documentElement.style.height = '100%';
    contentDocument.body.style.height = '100%';
  }

  return iframe;
}

function renderComponentEmbedCode(embedEl, code) {
  const { value: highlightedCode } = hljs.highlight(code, { language: 'html' });
  let copyButtonReset;

  async function copyToClipboard(event) {
    const copyButtonResetDuration = 6000;
    const buttonEl = event.target;

    await navigator.clipboard.writeText(code);
    clearTimeout(copyButtonReset);
    buttonEl.textContent = 'Copied!';
    copyButtonReset = setTimeout(() => {
      buttonEl.textContent = 'Copy';
    }, copyButtonResetDuration);
  }

  return renderElement(embedEl, {
    'pre code': (el) => (el.innerHTML = highlightedCode),
    '.copy': (el) => el.addEventListener('click', copyToClipboard),
  });
}

// -------------------------------------------------------
// Overlay apps
// -------------------------------------------------------

function initOverlayApps() {
  const overlayAppsEl = document.querySelector('#overlay-container');

  function closeAll() {
    const appEls = overlayAppsEl.querySelectorAll('.apps > *');
    for (const el of [overlayAppsEl, ...appEls]) {
      el.classList.add('hidden');
    }
  }

  renderElement(overlayAppsEl, {
    '.close': (el) => el.addEventListener('click', closeAll),
  });
}

// -------------------------------------------------------
// Page initialization
// -------------------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  registerHljsLanguages();
  initOrganSelect();
  initOverlayApps();
});

window.addEventListener('resize', (event) => {
  for (const listener of resizeListeners) {
    listener(event);
  }
});
