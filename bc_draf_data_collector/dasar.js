// dasar.js – Versi stabil mengikut warisan `script.js`
// Tarikh: 09-05-2025 | Masa: 00:33 SGT

const rows = ["Mula Cerita", "Masalah", "Penyelesaian", "Akhir Cerita"];
const cols = ["Orang & Tempat", "Peristiwa", "Perasaan", "Dialog Ringkas"];

function populateTable() {
  const tbody = document.getElementById("bcBody");
  tbody.innerHTML = "";
  rows.forEach((rowTitle, rowIndex) => {
    const row = document.createElement("tr");

    const th = document.createElement("th");
    th.textContent = rowTitle;
    th.style.backgroundColor = "#eee";
    row.appendChild(th);

    cols.forEach((_, colIndex) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.setAttribute("data-row", rowIndex);
      input.setAttribute("data-col", colIndex);
      td.appendChild(input);
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
}

function exportData() {
  const format = document.getElementById("exportFormat").value;
  const data = collectTableData();
  let content = "";

  if (format === "csv") {
    content = convertToCSV(data);
    downloadFile(content, "bc_data.csv", "text/csv");
  } else if (format === "json") {
    content = JSON.stringify(data.map((item) => ({
      plot: item.plot,
      teknik: item.teknik,
      input: item.value,
      metadata: {
        arahan_AI: "Sila lengkapkan karangan ini secara naratif dengan gaya puitis dan berhubung antara teknik."
      }
    })), null, 2);
    downloadFile(content, "bc_data.json", "application/json");
  } else if (format === "xml") {
    content = "<main>\n" + data.map(item => {
      return `  <para>\n    <plot>${item.plot}</plot>\n    <teknik>${item.teknik}</teknik>\n    <data>${item.value}</data>\n  </para>`;
    }).join("\n") + "\n</main>";
    downloadFile(content, "bc_data.xml", "application/xml");
  }
}

function collectTableData() {
  const inputs = document.querySelectorAll("#bcBody input");
  const data = [];
  inputs.forEach(input => {
    const row = parseInt(input.getAttribute("data-row"));
    const col = parseInt(input.getAttribute("data-col"));
    data.push({
      plot: rows[row],
      teknik: cols[col],
      value: input.value.trim()
    });
  });
  return data;
}

// Fungsi yang PATUH WARISAN
function convertToCSV(data) {
  const header = ["Plot", "Teknik", "Input"];
  const rows = data.map(d => [d.plot, d.teknik, d.value]);
  return [header, ...rows].map(e => e.join(",")).join("\n");
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function importCSV() {
  document.getElementById("fileInput").click();
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split("\n").slice(1); // skip header
    lines.forEach((line) => {
      const [plot, teknik, value] = line.split(",");
      const rowIndex = rows.indexOf(plot);
      const colIndex = cols.indexOf(teknik);
      if (rowIndex !== -1 && colIndex !== -1) {
        const input = document.querySelector(`input[data-row='${rowIndex}'][data-col='${colIndex}']`);
        if (input) input.value = value;
      }
    });
  };
  reader.readAsText(file);
}

window.onload = populateTable;

// Nama fail: dasar.js
// Tarikh & Masa: 09-05-2025 | 00:33 SGT
// Jumlah baris: 111
