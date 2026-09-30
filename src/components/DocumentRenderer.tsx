import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  CheckSquare,
  ShieldAlert,
  Info,
  Layers,
  Scale,
  Calendar,
  Building2,
  Users
} from 'lucide-react';

interface DocumentRendererProps {
  content: string;
  title?: string;
  type?: string;
  audience?: string;
  taxYear?: string;
  firmName?: string;
  eroName?: string;
  className?: string;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  content,
  title,
  type,
  audience,
  taxYear,
  firmName,
  eroName,
  className = '',
}) => {
  // State for interactive checklist toggles
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!content || !content.trim()) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">
        No document content available.
      </div>
    );
  }

  // Helper to clean inline markdown like **bold**
  const renderInlineFormatted = (text: string) => {
    // Replace **text** with bold tags
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Parse lines into structured blocks
  const lines = content.split('\n');

  interface SectionBlock {
    title: string;
    subheading?: string;
    type: 'header' | 'section' | 'table' | 'callout' | 'list' | 'checklist' | 'paragraph';
    items: string[];
    tableHeaders?: string[];
    tableRows?: string[][];
  }

  const sections: SectionBlock[] = [];
  let currentSection: SectionBlock = {
    title: 'Overview',
    type: 'section',
    items: [],
  };

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for markdown table
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // If delimiter row like |---|---|
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
        tableRows = [];
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      // Table ended
      sections.push({
        title: currentSection.title,
        type: 'table',
        items: [],
        tableHeaders,
        tableRows,
      });
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    // Skip empty separator lines
    if (!trimmed || trimmed === '---' || trimmed === '***') {
      continue;
    }

    // Detect Level 1 Heading (# Title) - Strip all # hashtags
    if (trimmed.startsWith('# ')) {
      const cleanTitle = trimmed.replace(/^#+\s*/, '').trim();
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: cleanTitle,
        type: 'header',
        items: [],
      };
      continue;
    }

    // Detect Level 2 Heading (## Section) - Strip all # hashtags
    if (trimmed.startsWith('## ')) {
      const cleanTitle = trimmed.replace(/^#+\s*/, '').trim();
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: cleanTitle,
        type: 'section',
        items: [],
      };
      continue;
    }

    // Detect Level 3 Heading (### Sub-section) - Strip all # hashtags
    if (trimmed.startsWith('### ')) {
      const cleanTitle = trimmed.replace(/^#+\s*/, '').trim();
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: cleanTitle,
        type: 'section',
        items: [],
      };
      continue;
    }

    // Detect All-Caps Section Header like "SUMMARY & APPLICATION:" or "DUE DILIGENCE:"
    if (/^[A-Z0-9\s&—§\(\)\/:,\.-]{4,}:$/.test(trimmed)) {
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmed.replace(/:$/, ''),
        type: 'section',
        items: [],
      };
      continue;
    }

    // Regular line / checklist item
    currentSection.items.push(trimmed);
  }

  // Push final section
  if (inTable) {
    sections.push({
      title: currentSection.title,
      type: 'table',
      items: [],
      tableHeaders,
      tableRows,
    });
  } else if (currentSection.items.length > 0 || currentSection.title) {
    sections.push(currentSection);
  }

  // Color theme helper for section cards
  const getSectionTheme = (secTitle: string) => {
    const lower = secTitle.toLowerCase();
    if (lower.includes('due diligence') || lower.includes('penalty') || lower.includes('red flag') || lower.includes('audit')) {
      return {
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        cardBorder: 'border-amber-200',
        headerBg: 'bg-amber-50/70 text-amber-950',
        icon: <ShieldAlert className="w-4 h-4 text-amber-700" />,
      };
    }
    if (lower.includes('summary') || lower.includes('quick') || lower.includes('overview') || lower.includes('matrix')) {
      return {
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        cardBorder: 'border-emerald-200',
        headerBg: 'bg-emerald-50/70 text-emerald-950',
        icon: <FileSpreadsheet className="w-4 h-4 text-emerald-700" />,
      };
    }
    if (lower.includes('checklist') || lower.includes('document') || lower.includes('verification')) {
      return {
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        cardBorder: 'border-blue-200',
        headerBg: 'bg-blue-50/70 text-blue-950',
        icon: <CheckSquare className="w-4 h-4 text-blue-700" />,
      };
    }
    if (lower.includes('statute') || lower.includes('irc') || lower.includes('regulation') || lower.includes('authority')) {
      return {
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
        cardBorder: 'border-purple-200',
        headerBg: 'bg-purple-50/70 text-purple-950',
        icon: <Scale className="w-4 h-4 text-purple-700" />,
      };
    }
    return {
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      cardBorder: 'border-slate-200',
      headerBg: 'bg-slate-50 text-slate-900',
      icon: <Layers className="w-4 h-4 text-slate-600" />,
    };
  };

  return (
    <div className={`space-y-6 text-slate-800 ${className}`}>
      {/* Clean Document Top Header */}
      {(title || type || taxYear) && (
        <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {type && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {type.replace(/_/g, ' ')}
                </span>
              )}
              {taxYear && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  Tax Year {taxYear}
                </span>
              )}
              {audience && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  {audience}
                </span>
              )}
            </div>
            {title && (
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {title.replace(/^#+\s*/, '')}
              </h1>
            )}
          </div>

          {firmName && (
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{firmName}</div>
              {eroName && <div className="text-[10px] text-slate-500">{eroName}</div>}
            </div>
          )}
        </div>
      )}

      {/* Render Sections without Hashtags */}
      <div className="space-y-5">
        {sections.map((section, sIdx) => {
          const theme = getSectionTheme(section.title);

          // Handle Markdown Table Block
          if (section.type === 'table' && section.tableHeaders && section.tableHeaders.length > 0) {
            return (
              <div key={sIdx} className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wider">
                    <tr>
                      {section.tableHeaders.map((head, hIdx) => (
                        <th key={hIdx} className="px-4 py-3 text-left">
                          {renderInlineFormatted(head)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {section.tableRows?.map((row, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 text-slate-700">
                            {renderInlineFormatted(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          // If Section has no items and title is a top-level banner
          if (section.type === 'header' && section.items.length === 0) {
            return (
              <div
                key={sIdx}
                className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between"
              >
                <div className="text-sm font-extrabold uppercase tracking-wide">
                  {section.title}
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Verified Tax Law
                </span>
              </div>
            );
          }

          return (
            <div
              key={sIdx}
              className={`rounded-xl border ${theme.cardBorder} overflow-hidden bg-white shadow-xs`}
            >
              {/* Section Header Bar (No # Hashtags) */}
              <div className={`px-4 py-3 border-b ${theme.cardBorder} ${theme.headerBg} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  {theme.icon}
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {section.title}
                  </h2>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badgeBg}`}>
                  Operational Guide
                </span>
              </div>

              {/* Section Body */}
              <div className="p-4 sm:p-5 space-y-3">
                {section.items.map((item, iIdx) => {
                  const itemKey = `sec-${sIdx}-item-${iIdx}`;
                  const isChecked = checkedItems[itemKey] || false;

                  // Check if item is a checkbox: "- [ ]" or "- [x]"
                  const isCheckbox = /^-\s*\[([ xX])\]\s*(.*)$/.exec(item);
                  if (isCheckbox) {
                    const defaultChecked = isCheckbox[1].toLowerCase() === 'x';
                    const checkContent = isCheckbox[2];
                    const activeChecked = checkedItems[itemKey] !== undefined ? isChecked : defaultChecked;

                    return (
                      <div
                        key={iIdx}
                        onClick={() => toggleCheck(itemKey)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border transition cursor-pointer select-none ${
                          activeChecked
                            ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                            : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={activeChecked}
                            onChange={() => toggleCheck(itemKey)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                          />
                        </div>
                        <div className={`text-xs sm:text-sm leading-relaxed ${activeChecked ? 'line-through text-slate-500' : ''}`}>
                          {renderInlineFormatted(checkContent)}
                        </div>
                      </div>
                    );
                  }

                  // Check if item is a bullet point: "- " or "* "
                  if (/^[-*]\s+/.test(item)) {
                    const bulletText = item.replace(/^[-*]\s+/, '');
                    return (
                      <div key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <div>{renderInlineFormatted(bulletText)}</div>
                      </div>
                    );
                  }

                  // Check if numbered list item: "1. "
                  if (/^\d+\.\s+/.test(item)) {
                    const numMatch = /^(\d+)\.\s+(.*)$/.exec(item);
                    return (
                      <div key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-700">
                        <span className="font-extrabold text-emerald-700 text-xs mt-0.5 shrink-0 min-w-[18px]">
                          {numMatch ? `${numMatch[1]}.` : '•'}
                        </span>
                        <div>{renderInlineFormatted(numMatch ? numMatch[2] : item)}</div>
                      </div>
                    );
                  }

                  // Normal paragraph
                  return (
                    <p key={iIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {renderInlineFormatted(item)}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
