// script.js – Versi selari dengan index.html terbaru (Eksport CSV, JSON, XML + metadata teknik)

const plots = [
    "Permulaan", "Sub-Konflik", "Konflik",
    "Sub-Kemuncak", "Kemuncak", "Peleraian", "Penutup"
  ];
  
  const teknik = [
    "Peristiwa", "Dialog", "Perasaan", "Mon Dalam",
    "Mon Luar", "Gambaran", "Peribahasa", "Frasa Besar"
  ];
  
  const warna = {
    "Peristiwa": "#dcc7dd",
    "Dialog": "#d0e9f5",
    "Perasaan": "#fac6de",
    "Mon Dalam": "#e5fbb7",
    "Mon Luar": "#e5fbb7",
    "Gambaran": "#dcc7dd",
    "Peribahasa": "#d0e9f5",
    "Frasa Besar": "#dcc7dd"
  };
  
  // Papar semula textarea
  window.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("bcBody");
    plots.forEach((plot, row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><strong>${plot}</strong></td>`;
      teknik.forEach((_, col) => {
        tr.innerHTML += `<td><textarea data-row="${row}" data-col="${col}"></textarea></td>`;
      });
      tbody.appendChild(tr);
    });
  });
  
  function exportCSV() {
    let csv = "Plot," + teknik.join(",") + "\n";
    plots.forEach((plot, i) => {
      let row = [plot];
      for (let j = 0; j < 8; j++) {
        const ta = document.querySelector(`textarea[data-row="${i}"][data-col="${j}"]`);
        const val = ta ? ta.value.replace(/"/g, '""') : "";
        row.push(`"${val}"`);
      }
      csv += row.join(",") + "\n";
    });
    downloadBlob(csv, "karangan_bc.csv", "text/csv");
  }
  
  function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.trim().split("\n");
      if (lines.length !== 8) return alert("CSV mesti ada 1 header + 7 baris data.");
      const data = lines.slice(1);
      data.forEach((line, i) => {
        const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"'));
        for (let j = 0; j < 8; j++) {
          const ta = document.querySelector(`textarea[data-row="${i}"][data-col="${j}"]`);
          if (ta) ta.value = cells[j + 1];
        }
      });
    };
    reader.readAsText(file);
  }
  
  function toggleExportMenu() {
    const menu = document.getElementById("exportMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }
  
  function handleExport() {
    const format = document.querySelector("input[name='exportFormat']:checked");
    if (!format) return alert("Sila pilih format eksport.");
    if (format.value === "json") return exportJSON();
    if (format.value === "xml") return exportXML();
  }
  
  function exportJSON() {
    const data = plots.map((plot, i) => {
      const row = { plot };
      teknik.forEach((tech, j) => {
        const ta = document.querySelector(`textarea[data-row="${i}"][data-col="${j}"]`);
        row[tech] = ta ? ta.value : "";
      });
      return row;
    });
    const payload = {
      arahan: "Sila lengkapkan karangan ini secara naratif dengan gaya puitis dan berhubung antara teknik.",
      kandungan: data
    };
    downloadBlob(JSON.stringify(payload, null, 2), "karangan_bc.json", "application/json");
  }
  
  function exportXML() {
    let xml = `<main>\n`;
    plots.forEach((plot, i) => {
      xml += `  <para>\n`;
      teknik.forEach((tech, j) => {
        const ta = document.querySelector(`textarea[data-row="${i}"][data-col="${j}"]`);
        const val = ta ? ta.value.trim() : "";
        if (val) {
          const id = `mylayer${i * 8 + j}_r`;
          const color = warna[tech] || "#cccccc";
          xml += `    <data>\n`;
          xml += `      <id>${id}</id>\n`;
          xml += `      <color>${color}</color>\n`;
          xml += `      <item><![CDATA[${val.replace(/\n/g, "<BR>")}]]></item>\n`;
          xml += `    </data>\n`;
        }
      });
      xml += `  </para>\n`;
    });
    xml += `</main>`;
    downloadBlob(xml, "karangan_bc.xml", "text/xml");
  }
  
  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  