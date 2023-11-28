import { saveAs } from 'file-saver';
import { TabulatorFull } from 'tabulator-tables';
import sample from './heart-cell-summary.csv';

import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';

const ENDPOINT = 'https://apps.humanatlas.io/api/hra-pop';

async function getSimilarHraItems(csvString, organIri) {
  return fetch(`${ENDPOINT}/cell-summary-report`, {
    method: 'POST',
    body: JSON.stringify({
      organ: organIri,
      csvString,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((r) => r.json());
}

async function getSupportedOrgans() {
  return fetch(`${ENDPOINT}/supported-organs`).then((r) => r.json());
}

const TABLE_COLUMNS = [
  { title: 'Modality', field: 'modality' },
  { title: 'Similarity', field: 'similarity' },
  { title: 'Label', field: 'cell_source_label' },
  { title: 'ID', field: 'cell_source' },
].map((c) => ({
  ...c,
  titleDownload: c.field,
  download: true,
}));

let csvString;
let generatedRuiLocations;
let supportedOrgans = {};
let selectedOrganIri;

window.addEventListener('DOMContentLoaded', async () => {
  updateOrganDropdown();

  const useSample = document.getElementById('use-sample');
  useSample.addEventListener('click', async () => {
    setCsvFile(sample, 'heart-cell-summary.csv');
  });

  const submitBtn = document.getElementById('submit-file');
  submitBtn.addEventListener('click', async () => {
    clearResults();
    if (csvString) {
      const { sources, rui_locations } = await getSimilarHraItems(csvString, selectedOrganIri);

      if (sources?.length > 0) {
        results.style.display = 'block';
        updateAsTable(sources);
        updateDatasetsTable(sources);
        updateEui(rui_locations);
      } else {
        alert('No predictions found.');
      }
    }
  });

  const removeBtn = document.getElementById('remove-file');
  removeBtn.addEventListener('click', async () => {
    if (csvString) {
      clearResults();
      setCsvFile(undefined);
    }
  });

  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', async () => {
    if (fileInput.files.length > 0) {
      const csvString = await fileInput.files[0].text();
      const fileName = fileInput.files[0].name;
      setCsvFile(csvString, fileName);
    }
  });

  const startOverBtn = document.getElementById('start-over');
  startOverBtn.addEventListener('click', async () => {
    clearResults();
    setCsvFile(undefined);
  });
});

async function updateOrganDropdown() {
  const organs = await getSupportedOrgans();
  organs.map((organ) => {
    supportedOrgans[organ['id']] = organ['label'];
  });
  const $organs = document.getElementById('organ-input');
  $organs.innerHTML = organs
    .map(
      ({ id, label }) => `<md-select-option value="${id}">
    <div slot="headline">${label}</div>
    </md-select-option>`
    )
    .join('\n');
}

const selectElement = document.getElementById('organ-input');
const selectedOrgan = document.getElementById('organ-selected');
selectElement.addEventListener('change', (e) => {
  selectedOrgan.innerText = supportedOrgans[`${e.target.value}`];
  selectedOrganIri = e.target.value;
});

function setCsvFile(newCsvString, fileName) {
  csvString = newCsvString ? newCsvString : undefined;

  const status = document.getElementById('upload-status');
  status.innerHTML = newCsvString ? `File loaded: ${fileName}` : 'No file loaded';

  const uploadedFile = document.getElementById('uploaded-file');
  uploadedFile.innerHTML = location ? fileName : 'No file loaded';

  const submitBtn = document.getElementById('submit-file');
  submitBtn.style.display = !!csvString ? 'block' : 'none';

  const removeBtn = document.getElementById('remove-file');
  removeBtn.style.display = !!csvString ? 'block' : 'none';

  const useSample = document.getElementById('use-sample');
  useSample.style.display = !!csvString ? 'none' : 'block';

  const uploadFile = document.getElementById('upload-file');
  uploadFile.style.display = !!csvString ? 'none' : 'block';

  const uploadMessage = document.getElementById('upload-message');
  uploadMessage.style.display = !!csvString ? 'none' : 'block';
}

let asTable;
let datasetTable;

function updateAsTable(sources) {
  // Construct AS table
  if (asTable) {
    asTable.destroy();
  }
  const data = sources.filter((row) => row.cell_source_type === 'http://purl.org/ccf/AnatomicalStructure');
  asTable = new TabulatorFull(document.getElementById('as-table'), {
    data,
    layout: 'fitDataFill',
    columns: TABLE_COLUMNS,
    initialSort: [
      { column: 'modality', dir: 'asc' },
      { column: 'similarity', dir: 'desc' },
    ],
  });
  asTable.on('rowClick', function (_e, row) {
    const url = row.getData().cell_source;
    window.open(url, '_blank');
  });

  const button = document.getElementById('download-as-csv');
  button.addEventListener('click', () => asTable.download('csv', 'predicted-as.csv'));
}

function updateDatasetsTable(sources) {
  // Construct Datasets table
  if (datasetTable) {
    datasetTable.destroy();
  }
  const data = sources.filter((row) => row.cell_source_type === 'http://purl.org/ccf/Dataset');
  datasetTable = new TabulatorFull(document.getElementById('datasets-table'), {
    data,
    layout: 'fitDataFill',
    columns: TABLE_COLUMNS,
    initialSort: [
      { column: 'modality', dir: 'asc' },
      { column: 'similarity', dir: 'desc' },
    ],
  });
  // datasetTable.on('rowClick', function (_e, row) {
  //   const url = row.getData().cell_source;
  //   window.open(url, '_blank');
  // });
  const button2 = document.getElementById('download-datasets-csv');
  button2.addEventListener('click', () => datasetTable.download('csv', 'similar-atlas-datasets.csv'));
}

function clearResults() {
  const results = document.getElementById('results');
  results.style.display = 'none';

  const summary = document.getElementById('summary');
  summary.style.display = 'none';
  const settings = document.getElementById('settings');
  settings.style.display = 'block';
}

function updateEui(rui_locations) {
  const summary = document.getElementById('summary');
  summary.style.display = 'block';
  const settings = document.getElementById('settings');
  settings.style.display = 'none';

  // Construct EUI
  let eui = document.getElementsByTagName('ccf-eui')[0];
  generatedRuiLocations = rui_locations;
  if (!eui) {
    eui = document.createElement('ccf-eui');
    eui.setAttribute('use-remote-api', 'false');
    eui.setAttribute('hubmap-data-url', '');
    eui.setAttribute('login-disabled', 'true');
    const container = document.getElementById('eui-container');
    container.appendChild(eui);

    const button = document.getElementById('download-as-jsonld');
    button.addEventListener('click', () => {
      const jsonString = JSON.stringify(generatedRuiLocations, null, 2);
      const fileToSave = new Blob([jsonString], {
        type: 'application/json',
      });
      saveAs(fileToSave, 'rui_locations.jsonld');
    });
  }

  eui.setAttribute('data-sources', JSON.stringify([JSON.stringify(rui_locations)]));
}
