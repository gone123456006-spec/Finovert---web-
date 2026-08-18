import PDFDocument from 'pdfkit';
import { ACCEPTANCE_STATEMENTS, TERMS_INTRO, TERMS_SECTIONS } from '../data/internshipTermsContent.js';

const MARGIN = 54;
const TEXT = '#202124';
const MUTED = '#5f6368';
const LINE = '#dadce0';
const FOOTER_H = 28;

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(String(dataUrl || '').trim());
  if (!match) return null;
  return Buffer.from(match[2], 'base64');
}

function contentWidth(doc) {
  return doc.page.width - MARGIN * 2;
}

function bottom(doc) {
  return doc.page.height - MARGIN - FOOTER_H;
}

function ensureSpace(doc, needed) {
  if (doc.y + needed > bottom(doc)) {
    doc.addPage();
    doc.y = MARGIN;
  }
}

function writeBody(doc, text, opts = {}) {
  const size = opts.size || 10.5;
  const gap = opts.lineGap ?? 2.2;
  doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).fillColor(opts.color || TEXT);
  const height = doc.heightOfString(text, { width: contentWidth(doc), lineGap: gap });
  ensureSpace(doc, Math.min(height + 4, 80));
  doc.text(text, MARGIN, doc.y, {
    width: contentWidth(doc),
    align: 'left',
    lineGap: gap,
  });
}

function writeParagraphs(doc, paragraphs = []) {
  for (const paragraph of paragraphs) {
    writeBody(doc, paragraph);
    doc.moveDown(0.35);
  }
}

function writeList(doc, items = []) {
  if (!items.length) return;
  const width = contentWidth(doc);
  const useTwoCol = items.length >= 8;
  const colGap = 16;
  const colW = useTwoCol ? (width - colGap) / 2 - 14 : width - 14;
  const leftX = MARGIN + 14;
  const rightX = MARGIN + 14 + colW + colGap;
  const size = 10;
  const lineGap = 0.8;

  doc.font('Helvetica').fontSize(size).fillColor(TEXT);

  if (!useTwoCol) {
    for (const item of items) {
      const line = `•  ${item}`;
      const height = doc.heightOfString(line, { width: colW, lineGap });
      ensureSpace(doc, Math.min(height + 2, 36));
      doc.text(line, leftX, doc.y, { width: colW, lineGap });
      doc.moveDown(0.04);
    }
    doc.moveDown(0.28);
    return;
  }

  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);
  const rowCount = Math.max(leftItems.length, rightItems.length);

  for (let i = 0; i < rowCount; i++) {
    const left = leftItems[i] ? `•  ${leftItems[i]}` : '';
    const right = rightItems[i] ? `•  ${rightItems[i]}` : '';
    const hLeft = left ? doc.heightOfString(left, { width: colW, lineGap }) : 0;
    const hRight = right ? doc.heightOfString(right, { width: colW, lineGap }) : 0;
    const rowH = Math.max(hLeft, hRight, 12);
    ensureSpace(doc, rowH + 2);
    const y = doc.y;
    if (left) doc.text(left, leftX, y, { width: colW, lineGap });
    if (right) doc.text(right, rightX, y, { width: colW, lineGap });
    doc.y = y + rowH + 1;
  }
  doc.moveDown(0.3);
}

function addHeadersAndFooters(doc, submittedAt) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    const pageW = doc.page.width;
    const pageH = doc.page.height;

    if (i > 0) {
      doc.font('Helvetica').fontSize(8).fillColor(MUTED)
        .text('Finovert  •  Unpaid Technology Internship Terms', MARGIN, 28, {
          width: pageW - MARGIN * 2 - 80,
          align: 'left',
        });
      doc.font('Helvetica').fontSize(8).fillColor(MUTED)
        .text(submittedAt, MARGIN, 28, { width: pageW - MARGIN * 2, align: 'right' });
      doc.moveTo(MARGIN, 42).lineTo(pageW - MARGIN, 42).strokeColor(LINE).lineWidth(0.4).stroke();
    }

    doc.moveTo(MARGIN, pageH - 36).lineTo(pageW - MARGIN, pageH - 36).strokeColor(LINE).lineWidth(0.4).stroke();
    doc.font('Helvetica').fontSize(8).fillColor(MUTED)
      .text(`${i + 1}`, MARGIN, pageH - 28, { width: pageW - MARGIN * 2, align: 'right' });
  }
}

function drawAcceptance(doc, payload) {
  ensureSpace(doc, 220);
  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(16).fillColor(TEXT)
    .text('Acceptance', MARGIN, doc.y, { width: contentWidth(doc) });
  doc.moveDown(0.25);
  writeBody(doc, 'By submitting this form you confirm that you have read, understood, and agreed to these Terms.', { size: 10.5 });
  doc.moveDown(0.35);

  ACCEPTANCE_STATEMENTS.forEach((statement, index) => {
    writeBody(doc, `${index + 1}.  ${statement}`, { size: 10 });
    doc.moveDown(0.22);
  });

  doc.moveDown(0.2);
  const width = contentWidth(doc);
  const col = (width - 18) / 2;
  const rows = [
    ['Full name', payload.fullName],
    ['Email', payload.email],
    ['Phone', payload.phone],
    ['Date', payload.date],
    ['Aadhaar number', payload.aadhaarNumber],
  ];

  doc.font('Helvetica-Bold').fontSize(11).fillColor(TEXT).text('Your details', MARGIN, doc.y);
  doc.moveDown(0.25);

  for (const [label, value] of rows) {
    ensureSpace(doc, 16);
    const rowY = doc.y;
    doc.font('Helvetica').fontSize(10).fillColor(MUTED).text(label, MARGIN, rowY, { width: 110 });
    doc.font('Helvetica').fontSize(10.5).fillColor(TEXT).text(String(value || '—'), MARGIN + 118, rowY, { width: width - 118 });
    doc.y = rowY + 16;
  }

  doc.moveDown(0.35);
  ensureSpace(doc, 118);
  const imageY = doc.y;
  const imgH = 92;
  const faceBuffer = parseDataUrl(payload.facePhoto);
  const signatureBuffer = parseDataUrl(payload.signature);

  doc.font('Helvetica').fontSize(9).fillColor(MUTED).text('Face verification', MARGIN, imageY);
  doc.font('Helvetica').fontSize(9).fillColor(MUTED).text('Signature', MARGIN + col + 18, imageY);

  const imgTop = imageY + 14;
  doc.rect(MARGIN, imgTop, col, imgH).strokeColor(LINE).lineWidth(0.6).stroke();
  doc.rect(MARGIN + col + 18, imgTop, col, imgH).strokeColor(LINE).lineWidth(0.6).stroke();

  try {
    if (faceBuffer) doc.image(faceBuffer, MARGIN + 4, imgTop + 4, { fit: [col - 8, imgH - 8], align: 'center', valign: 'center' });
  } catch { /* keep empty frame */ }

  try {
    if (signatureBuffer) doc.image(signatureBuffer, MARGIN + col + 22, imgTop + 4, { fit: [col - 8, imgH - 8], align: 'center', valign: 'center' });
  } catch { /* keep empty frame */ }

  doc.y = imgTop + imgH + 10;
}

export function generateTermsPdf(payload) {
  return new Promise((resolve, reject) => {
    const submittedAt = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

    const doc = new PDFDocument({
      size: 'A4',
      margin: MARGIN,
      bufferPages: true,
      autoFirstPage: true,
      info: {
        Title: 'Unpaid Technology Internship Terms',
        Author: 'Finovert',
        Subject: 'Internship Terms & Conditions',
      },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const width = contentWidth(doc);

    doc.font('Helvetica-Bold').fontSize(26).fillColor(TEXT)
      .text('Finovert Terms', MARGIN, MARGIN, { width, align: 'left' });
    doc.moveDown(0.15);
    doc.font('Helvetica').fontSize(11).fillColor(MUTED)
      .text(`Effective ${submittedAt}`, MARGIN, doc.y, { width });
    doc.moveDown(0.85);

    doc.font('Helvetica-Bold').fontSize(16).fillColor(TEXT)
      .text('What’s covered in these terms', MARGIN, doc.y, { width });
    doc.moveDown(0.35);
    writeParagraphs(doc, TERMS_INTRO);

    for (const section of TERMS_SECTIONS) {
      const headingH = 22;
      ensureSpace(doc, headingH + 18);
      doc.moveDown(0.32);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(TEXT)
        .text(section.title, MARGIN, doc.y, { width });
      doc.moveDown(0.22);
      writeParagraphs(doc, section.paragraphs);
      if (section.list?.length) writeList(doc, section.list);
      if (section.afterList?.length) writeParagraphs(doc, section.afterList);
    }

    drawAcceptance(doc, payload);
    addHeadersAndFooters(doc, submittedAt);
    doc.end();
  });
}
