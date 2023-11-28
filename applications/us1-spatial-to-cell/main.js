import { TabulatorFull } from 'tabulator-tables';
import sample from './registration-data.json';

async function getCellSummary(ruiLocation) {
  return fetch('https://apps.humanatlas.io/api/ctpop/rui-location-cell-summary', {
    method: 'POST',
    body: ruiLocation,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((r) => r.json());
}

async function getSupportedOrgans() {
  return fetch('https://apps.humanatlas.io/api/ctpop/supported-organs').then((r) => r.json());
}

let tabulator;
let ruiLocation;
let rui;
let supportedOrgans = [];

window.addEventListener('DOMContentLoaded', async () => {
  const useSample = document.getElementById('use-sample');
  useSample.addEventListener('click', async () => {
    setRUILocation(sample, 'sample-kidney-registration.json');
  });

  const submitBtn = document.getElementById('submit-file');
  submitBtn.addEventListener('click', async () => {
    if (ruiLocation) {
      clearResults();
      const cellSummary = await getCellSummary(ruiLocation);
      showCellSummary(cellSummary);
    }
  });

  const removeBtn = document.getElementById('remove-file');
  removeBtn.addEventListener('click', async () => {
    if (ruiLocation) {
      clearResults();
      setRUILocation(undefined);
    }
  });

  const startRui = document.getElementById('start-rui');
  startRui.addEventListener('click', showRUI);

  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', async () => {
    if (fileInput.files.length > 0) {
      const jsonString = await fileInput.files[0].text();
      const fileName = fileInput.files[0].name;
      setRUILocation(jsonString, fileName);
    }
  });

  const startOverBtn = document.getElementById('start-over');
  startOverBtn.addEventListener('click', async () => {
    clearResults();
    setRUILocation(undefined);
  });

  supportedOrgans = await getSupportedOrgans();
});

function setRUILocation(location, fileName) {
  if (!location) {
    ruiLocation = undefined;
  } else if (typeof location !== 'string') {
    location = JSON.stringify(location);
  }
  ruiLocation = location;
  
  const status = document.getElementById('upload-status');
  status.innerHTML = location ? `File loaded: ${fileName}` : 'No file loaded';

  const uploadedFile = document.getElementById('uploaded-file');
  uploadedFile.innerHTML = location ? fileName : 'No file loaded';

  const submitBtn = document.getElementById('submit-file');
  submitBtn.style.display = !!ruiLocation ? 'block' : 'none';

  const removeBtn = document.getElementById('remove-file');
  removeBtn.style.display = !!ruiLocation ? 'block' : 'none';

  const useSample = document.getElementById('use-sample');
  useSample.style.display = !!ruiLocation ? 'none' : 'block';

  const uploadFile = document.getElementById('upload-file');
  uploadFile.style.display = !!ruiLocation ? 'none' : 'block';
}

function showRUI() {
  const content = document.getElementById('rui-wrapper');
  if (!rui) {
    rui = document.createElement('ccf-rui');
    rui.setAttribute('base-href', 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@gh-pages/rui/');
    rui.setAttribute('use-download', 'false');
    rui.register = (location) => {
      setRUILocation(location, 'rui-location.json');
      content.style.display = 'none';
    };
    rui.cancelRegistration = () => {
      content.style.display = 'none';
    };
    rui.organOptions = supportedOrgans.map(o => o.organ_iri);

    content.appendChild(rui);
  }

  rui.editRegistration = undefined;
  content.style.display = 'block';
  clearResults();
}

function clearResults() {
  const results = document.getElementById('results');
  results.innerHTML = '';

  const summary = document.getElementById('summary');
  summary.style.display = 'none';
  const settings = document.getElementById('settings');
  settings.style.display = 'block';
}

function showCellSummary(cellSummary) {
  const summary = document.getElementById('summary');
  summary.style.display = 'block';
  const settings = document.getElementById('settings');
  settings.style.display = 'none';

  const results = document.getElementById('results');
  results.innerHTML = '';

  if (cellSummary.length === 0) {
    // Show a popup explaining no results
    const content = document.getElementById('error-content').content.cloneNode(true);
    results.appendChild(content);
  } else {
    const content = document.getElementById('dialog-content').content.cloneNode(true);

    // Create / update the table display of cell summary
    if (tabulator) {
      tabulator.destroy();
    }
    tabulator = new TabulatorFull(content.getElementById('table'), {
      data: cellSummary,
      autoColumns: true,
    });

    // Setup CSV download button
    const button = content.getElementById('download-csv');
    button.addEventListener('click', () => tabulator.download('csv', 'cell-summary.csv'));

    results.appendChild(content);
  }
  results.style.display = 'block';
}
