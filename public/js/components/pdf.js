// Pembuat PDF mini tanpa library (teks Helvetica, kotak, garis).
// Cukup untuk dokumen checklist satu halaman A4.

const ascii = (s) => String(s)
  .replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...')
  .normalize('NFKD').replace(/[^\x20-\x7E]/g, '');
const pdfStr = (s) => `(${ascii(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')})`;
const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255].map((v) => v.toFixed(3)).join(' '); };

export class MiniPDF {
  constructor() { this.ops = []; this.W = 595.28; this.H = 841.89; }
  // y dari atas agar mudah diatur
  text(x, y, s, { size = 11, bold = false, color = '#0f2a63' } = {}) {
    this.ops.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${rgb(color)} rg ${x.toFixed(2)} ${(this.H - y).toFixed(2)} Td ${pdfStr(s)} Tj ET`);
  }
  rect(x, y, w, h, { fill = null, stroke = null, lw = 1 } = {}) {
    const parts = [];
    if (fill) parts.push(`${rgb(fill)} rg`);
    if (stroke) parts.push(`${rgb(stroke)} RG ${lw} w`);
    parts.push(`${x.toFixed(2)} ${(this.H - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill && stroke ? 'B' : fill ? 'f' : 'S'}`);
    this.ops.push(parts.join(' '));
  }
  line(x1, y1, x2, y2, { color = '#c7d6ee', lw = 1 } = {}) {
    this.ops.push(`${rgb(color)} RG ${lw} w 1 J ${x1} ${this.H - y1} m ${x2} ${this.H - y2} l S`);
  }
  polyline(pts, { color = '#ffffff', lw = 2 } = {}) {
    const [first, ...rest] = pts;
    this.ops.push(`${rgb(color)} RG ${lw} w 1 J 1 j ${first[0]} ${this.H - first[1]} m ${rest.map(([x, y]) => `${x} ${this.H - y} l`).join(' ')} S`);
  }
  blob() {
    const stream = this.ops.join('\n');
    const objs = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ];
    let out = '%PDF-1.4\n';
    const offsets = [];
    objs.forEach((o, i) => { offsets.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xref = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
    out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([out], { type: 'application/pdf' });
  }
}

export function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
