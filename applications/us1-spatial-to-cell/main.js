import { TabulatorFull } from 'tabulator-tables';
import { openDialog } from 'web-dialog';

import('https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@gh-pages/rui/wc.js');

let tabulator;

async function getCellSummary(ruiLocation) {
  return fetch('https://apps.humanatlas.io/api/ctpop/rui-location-cell-summary', {
    method: 'POST',
    body: ruiLocation,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r) => r.json());
}

window.addEventListener('DOMContentLoaded', () => {
  const rui = document.querySelector('ccf-rui');
  rui.register = async (ruiLocation) => {
    const cellSummary = await getCellSummary(ruiLocation);
    showCellSummary(cellSummary);
  };
});

function showCellSummary(cellSummary) {
  if (cellSummary.length === 0) {
    // Show a popup explaining no results
    const content = document.getElementById('error-content').content.cloneNode(true);
    openDialog({ $content: content });
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

    // Open the dialog box showing the cell summary
    openDialog({ $content: content });
  }
}
