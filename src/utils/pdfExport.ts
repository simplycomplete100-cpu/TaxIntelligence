import { jsPDF } from 'jspdf';
import { TaxYear } from '../types';

export interface ExportPdfOptions {
  title: string;
  type: string;
  audience: string;
  taxYear: TaxYear;
  content: string;
  firmName: string;
  eroName?: string;
  disclaimer?: string;
  fileName?: string;
}

/**
 * Exports a structured, professional PDF document for tax resources.
 * Formats headers, bullet lists, checkboxes, and metadata cleanly across multiple pages.
 */
export function exportResourceToPdf(options: ExportPdfOptions): void {
  const {
    title,
    type,
    audience,
    taxYear,
    content,
    firmName,
    eroName = '',
    disclaimer = 'Prepared in compliance with Treasury Department Circular 230. For professional tax practice and client advisory guidance.',
    fileName,
  } = options;

  // Initialize jsPDF (portrait, mm, a4: 210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 22;

  let y = margin;

  // Colors
  const primaryNavy = [15, 23, 42]; // #0f172a
  const accentEmerald = [5, 150, 105]; // #059669
  const textDark = [30, 41, 59]; // #1e293b
  const textMuted = [100, 116, 139]; // #64748b
  const borderGray = [226, 232, 240]; // #e2e8f0

  const drawHeader = (isFirstPage: boolean) => {
    // Top banner
    doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.rect(0, 0, pageWidth, isFirstPage ? 28 : 14, 'F');

    // Firm name & ERO
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isFirstPage ? 13 : 9);
    doc.text(firmName.toUpperCase(), margin, isFirstPage ? 12 : 9);

    if (isFirstPage && eroName) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(eroName, margin, 18);
    }

    // Tax Year badge on top right
    doc.setFillColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
    const badgeWidth = 32;
    const badgeHeight = 7;
    doc.roundedRect(pageWidth - margin - badgeWidth, isFirstPage ? 8 : 4, badgeWidth, badgeHeight, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`TAX YEAR ${taxYear}`, pageWidth - margin - badgeWidth + 4, isFirstPage ? 12.8 : 8.8);

    if (isFirstPage) {
      y = 36;
    } else {
      y = 22;
    }
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    // Footer line
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    // Disclaimer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth - 30);
    doc.text(splitDisclaimer, margin, pageHeight - 11);

    // Page number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 11);
  };

  // Check page overflow and create new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      drawHeader(false);
    }
  };

  // Draw first page header
  drawHeader(true);

  // Document Title & Metadata Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  const splitTitle = doc.splitTextToSize(title, contentWidth);
  doc.text(splitTitle, margin, y);
  y += splitTitle.length * 7 + 2;

  // Metadata tags pill bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const metaText = `Type: ${type.replace(/_/g, ' ').toUpperCase()}   |   Audience: ${audience}   |   Issued: ${new Date().toLocaleDateString()}`;
  doc.text(metaText, margin, y);
  y += 5;

  // Horizontal separator
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Parse lines of markdown/text content
  const rawLines = content.split('\n');

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i].trim();

    if (!rawLine) {
      y += 3;
      continue;
    }

    // Level 1 Header (# Title)
    if (rawLine.startsWith('# ')) {
      checkPageBreak(12);
      const text = rawLine.replace(/^#\s+/, '').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.text(text, margin, y);
      y += 6;
      doc.setDrawColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
      doc.setLineWidth(0.6);
      doc.line(margin, y - 1.5, margin + 40, y - 1.5);
      y += 3;
    }
    // Level 2 Header (## Section)
    else if (rawLine.startsWith('## ')) {
      checkPageBreak(10);
      const text = rawLine.replace(/^##\s+/, '').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
      doc.text(text, margin, y);
      y += 6;
    }
    // Level 3 Header (### Subsection)
    else if (rawLine.startsWith('### ')) {
      checkPageBreak(8);
      const text = rawLine.replace(/^###\s+/, '').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.text(text, margin, y);
      y += 5;
    }
    // Checkbox items (- [ ] or - [x])
    else if (rawLine.startsWith('- [ ]') || rawLine.startsWith('- [x]')) {
      checkPageBreak(6);
      const isChecked = rawLine.startsWith('- [x]');
      const itemText = rawLine.replace(/^-\s*\[[ x]\]\s*/, '').trim();

      // Draw square checkbox
      doc.setDrawColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.setLineWidth(0.3);
      doc.rect(margin, y - 3, 3, 3);
      if (isChecked) {
        doc.setFillColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
        doc.rect(margin + 0.6, y - 2.4, 1.8, 1.8, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const wrapped = doc.splitTextToSize(itemText, contentWidth - 6);
      doc.text(wrapped, margin + 5, y - 0.5);
      y += wrapped.length * 4.5;
    }
    // Bullet points (- or * or •)
    else if (/^[-*•]\s+/.test(rawLine)) {
      checkPageBreak(6);
      const bulletText = rawLine.replace(/^[-*•]\s+/, '').trim();

      // Draw circle bullet
      doc.setFillColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
      doc.circle(margin + 1.5, y - 1, 0.9, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);

      // Bold key terms if has **
      const cleanedText = bulletText.replace(/\*\*/g, '');
      const wrapped = doc.splitTextToSize(cleanedText, contentWidth - 5);
      doc.text(wrapped, margin + 4.5, y - 0.2);
      y += wrapped.length * 4.5;
    }
    // Table line (| col1 | col2 |)
    else if (rawLine.startsWith('|') && rawLine.endsWith('|')) {
      if (rawLine.includes('---')) continue; // skip divider
      checkPageBreak(6);
      const cells = rawLine
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const colWidth = contentWidth / (cells.length || 1);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);

      cells.forEach((cell, cellIdx) => {
        const cleanCell = cell.replace(/\*\*/g, '');
        doc.text(cleanCell, margin + cellIdx * colWidth, y);
      });
      y += 5;
    }
    // Normal paragraph text
    else {
      checkPageBreak(6);
      const cleanLine = rawLine.replace(/\*\*/g, '');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const wrapped = doc.splitTextToSize(cleanLine, contentWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 4.5 + 1;
    }
  }

  // Add footers with total page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  // Save / trigger browser download
  const safeName = (fileName || `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ty${taxYear}.pdf`);
  doc.save(safeName);
}
