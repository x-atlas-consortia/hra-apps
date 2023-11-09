import { TabulatorFull } from 'tabulator-tables';
import sample from './heart-cell-summary.csv';

async function getSimilarHraItems(csvString) {
  return fetch('https://apps.humanatlas.io/api/ctpop/cell-summary-rui-location', {
    method: 'POST',
    body: csvString,
    headers: {
      'Content-Type': 'text/plain'
    }
  }).then((r) => r.json());
}

let csvString;
let generatedRuiLocations;

window.addEventListener('DOMContentLoaded', async () => {
  const useSample = document.getElementById('use-sample');
  useSample.addEventListener('click', async () => {
    setCsvFile(sample, 'heart-cell-summary.csv');
  });

  const submitBtn = document.getElementById('submit-file');
  submitBtn.addEventListener('click', async () => {
    clearResults();
    if (csvString) {
      const { sources, rui_locations } = await getSimilarHraItems(csvString);

      if (sources?.length > 0) {
        results.style.display = 'block';
        updateAsTable(sources);
        updateDatasetsTable(sources);
        updateEui(rui_locations);
      } else {
        alert('Bad Data');
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

function setCsvFile(newCsvString, fileName) {
  csvString = newCsvString ? newCsvString : undefined;
  
  const status = document.getElementById('upload-status');
  status.innerHTML = newCsvString ? fileName : 'No file loaded';

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
}

let asTable;
let datasetTable;

function updateAsTable(sources) {
  // Construct AS table
  if (asTable) {
    asTable.destroy();
  }
  asTable = new TabulatorFull(document.getElementById('as-table'), {
    data: sources.filter(
      (row) =>
        !row.cell_source.startsWith('https://purl.humanatlas.io/graph/ctpop') &&
        !row.cell_source.startsWith('http://purl.org/ccf/1.5/')
    ),
    autoColumns: true,
    initialSort: [
      { column: 'modality', dir: 'asc' },
      { column: 'similarity', dir: 'desc' },
    ],
  });
  const button = document.getElementById('download-as-csv');
  button.addEventListener('click', () => asTable.download('csv', 'predicted-as.csv'));
}

function updateDatasetsTable(sources) {
  // Construct Datasets table
  if (datasetTable) {
    datasetTable.destroy();
  }
  datasetTable = new TabulatorFull(document.getElementById('datasets-table'), {
    data: sources.filter((row) => row.cell_source.startsWith('https://purl.humanatlas.io/graph/ctpop')),
    autoColumns: true,
    initialSort: [
      { column: 'modality', dir: 'asc' },
      { column: 'similarity', dir: 'desc' },
    ],
  });
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
    button.addEventListener('click', () => alert(JSON.stringify(rui_locations, null, 2)));
  }

  eui.setAttribute('data-sources', JSON.stringify([JSON.stringify(rui_locations)]));
}
