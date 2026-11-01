// Turns the rendered invoice into a PNG or an A4 PDF, in the browser.
import { toPng } from "html-to-image";

const PNG_SCALE = 2; // 2x for sharp text

async function render(node: HTMLElement) {
  await document.fonts?.ready;
  return toPng(node, { pixelRatio: PNG_SCALE, cacheBust: true, backgroundColor: "#ffffff" });
}

function download(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function exportPng(node: HTMLElement, name: string) {
  download(await render(node), `${name}.png`);
}

export async function exportPdf(node: HTMLElement, name: string) {
  const { jsPDF } = await import("jspdf");
  const dataUrl = await render(node);
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4", compress: true });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgH = (node.offsetHeight / node.offsetWidth) * pageW;
  // Long invoices continue on extra pages.
  let y = 0;
  pdf.addImage(dataUrl, "PNG", 0, y, pageW, imgH, undefined, "FAST");
  while (imgH + y > pageH + 1) {
    y -= pageH;
    pdf.addPage();
    pdf.addImage(dataUrl, "PNG", 0, y, pageW, imgH, undefined, "FAST");
  }
  pdf.save(`${name}.pdf`);
}
