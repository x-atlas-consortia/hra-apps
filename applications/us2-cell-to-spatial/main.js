import { TabulatorFull } from 'tabulator-tables';

import('https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@staging/wc.js');

async function getSimilarHraItems(csvString) {
  return fetch('https://apps.humanatlas.io/api/ctpop/cell-summary-rui-location', {
    method: 'POST',
    body: csvString,
  }).then((r) => r.json());
}

window.addEventListener('DOMContentLoaded', async () => {
  const csvInput = document.getElementById('csv-input');
  const submitBtn = document.getElementById('submit-file');

  submitBtn.addEventListener('click', async () => {
    if (csvInput.files.length > 0) {
      const csvString = await csvInput.files[0].text();
      const { sources, rui_locations } = await getSimilarHraItems(csvString);

      if (sources?.length > 0) {
        updateAsTable(sources);
        updateDatasetsTable(sources);
        updateEui(rui_locations);
      } else {
        alert('Bad Data');
      }
    }
  });
});

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

function updateEui(rui_locations) {
  // Construct EUI
  let eui = document.getElementsByTagName('ccf-eui')[0];
  if (!eui) {
    eui = document.createElement('ccf-eui');
    eui.setAttribute('use-remote-api', 'false');
    eui.setAttribute('hubmap-data-url', '');
    const container = document.getElementById('results');
    container.appendChild(eui);
  }

  eui.setAttribute('data-sources', JSON.stringify([JSON.stringify(rui_locations)]));
}
