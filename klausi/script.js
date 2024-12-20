import { PDFDocument } from "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
import * as mammoth from "https://cdn.jsdelivr.net/npm/mammoth/mammoth.browser.min.js";

const fileInput = document.getElementById("fileInput");
const processButton = document.getElementById("processFile");
const output = document.getElementById("output");

processButton.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const startPage = parseInt(document.getElementById("startPage").value);

  if (!file) {
    output.textContent = "Please select a file.";
    return;
  }

  if (file.name.endsWith(".docx")) {
    processDocx(file);
  } else if (file.name.endsWith(".pdf")) {
    await processPdf(file, startPage);
  } else {
    output.textContent = "Unsupported file type.";
  }
});

async function processDocx(file) {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const arrayBuffer = event.target.result;
    const result = await mammoth.extractRawText({ arrayBuffer });
    const headings = result.value.match(/^#{1,3}\s.+$/gm) || [];
    output.textContent = "Table of Contents:\n" + headings.join("\n");
  };
  reader.readAsArrayBuffer(file);
}

async function processPdf(file, startPage) {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const existingPdfBytes = event.target.result;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pageCount = pdfDoc.getPages().length;

    for (let i = startPage - 1; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      page.drawText(`Page ${i + 1}`, {
        x: 50,
        y: 50,
        size: 12,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processed.pdf";
    a.click();
  };
  reader.readAsArrayBuffer(file);
}
