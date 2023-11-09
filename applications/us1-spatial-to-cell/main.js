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

let tabulator;
let ruiLocation;
let rui;

window.addEventListener('DOMContentLoaded', async () => {
  const useSample = document.getElementById('use-sample');
  useSample.addEventListener('click', async () => {
    setRUILocation(sample);
  });

  const submitBtn = document.getElementById('submit-file');
  submitBtn.addEventListener('click', async () => {
    if (ruiLocation) {
      clearResults();
      const cellSummary = await getCellSummary(ruiLocation);
      showCellSummary(cellSummary);
    }
  });

  const startRui = document.getElementById('start-rui');
  startRui.addEventListener('click', showRUI);

  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', async () => {
    if (fileInput.files.length > 0) {
      const jsonString = await fileInput.files[0].text();
      setRUILocation(jsonString);
    }
  });
});

function setRUILocation(location) {
  if (!location) {
    ruiLocation = undefined;
  } else if (typeof location !== 'string') {
    location = JSON.stringify(location);
  }
  ruiLocation = location;

  const submitBtn = document.getElementById('submit-file');
  submitBtn.style.display = !!ruiLocation ? 'block' : 'none';

  console.log(ruiLocation);
}

function showRUI() {
  const content = document.getElementById('rui-wrapper');
  if (!rui) {
    rui = document.createElement('ccf-rui');
    rui.setAttribute('base-href', 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@staging/rui/');
    rui.setAttribute('use-download', 'false');
    rui.register = (location) => {
      setRUILocation(location);
      content.style.display = 'none';
    };
    rui.cancelRegistration = () => {
      content.style.display = 'none';
    };
    content.appendChild(rui);
  }

  rui.editRegistration = undefined;
  content.style.display = 'block';
  clearResults();
}

function clearResults() {
  const results = document.getElementById('results');
  results.innerHTML = '';
}

function showCellSummary(cellSummary) {
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
