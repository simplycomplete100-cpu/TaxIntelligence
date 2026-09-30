import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Calendar,
  ExternalLink,
  BookOpen,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

interface ModernDocumentViewerProps {
  content: string;
  taxYear?: string;
  audience?: string;
  resourceType?: string;
  firmName?: string;
}

interface ParsedSection {
  title: string;
  type: 'header' | 'section' | 'subsection' | 'checklist' | 'bullets' | 'callout' | 'warning' | 'statute' | 'paragraph';
  items?: string[];
  text?: string;
}

export const ModernDocumentViewer: React.FC<ModernDocumentViewerProps> = ({
  content,
  taxYear = '2026',
  audience = 'Tax Preparer',
  resourceType = 'cheat_sheet',
  firmName = 'Apex Tax Intelligence',
}) => {
  // Track checked state for interactive checkboxes
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Clean raw content of leading hashtags, double asterisks, and messy markdown
  const cleanLine = (line: string): string => {
    return line
      .replace(/^#{1,6}\s*/, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/^[-*•]\s*/, '')
      .trim();
  };

  // Parse raw text into structured visual sections
  const parseContent = (raw: string): ParsedSection[] => {
    if (!raw) return [];
    const lines = raw.split('\n');
    const sections: ParsedSection[] = [];
    let currentSection: ParsedSection | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Top Header (# Title or # DOCUMENT)
      if (line.startsWith('# ') || (line.startsWith('## ') && sections.length === 0)) {
        if (currentSection) sections.push(currentSection);
        const titleText = cleanLine(line);
        sections.push({
          title: titleText,
          type: 'header',
          text: titleText,
        });
        currentSection = null;
        continue;
      }

      // Section Header (## Heading)
      if (line.startsWith('## ') || (/^[A-Z\s]{4,30}:?$/.test(line) && !line.includes('.'))) {
        if (currentSection) sections.push(currentSection);
        const titleText = cleanLine(line);
        const isWarning = titleText.toLowerCase().includes('watch out') || titleText.toLowerCase().includes('red flag') || titleText.toLowerCase().includes('disqualif');
        const isDueDiligence = titleText.toLowerCase().includes('due diligence') || titleText.toLowerCase().includes('safeguard');
        const isChecklist = titleText.toLowerCase().includes('checklist') || titleText.toLowerCase().includes('document') || titleText.toLowerCase().includes('verification');

        currentSection = {
          title: titleText,
          type: isWarning ? 'warning' : isDueDiligence ? 'callout' : isChecklist ? 'checklist' : 'section',
          items: [],
          text: '',
        };
        continue;
      }

      // Subsection Header (### Heading)
      if (line.startsWith('### ')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: cleanLine(line),
          type: 'subsection',
          items: [],
          text: '',
        };
        continue;
      }

      // Checkbox list item (- [ ] or - [x])
      if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
        const itemText = line.replace(/^-\s*\[[ x]\]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1').trim();
        if (!currentSection || currentSection.type !== 'checklist') {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            title: 'Action & Verification Items',
            type: 'checklist',
            items: [itemText],
          };
        } else {
          currentSection.items = [...(currentSection.items || []), itemText];
        }
        continue;
      }

      // Bullet points (- or * or •)
      if (/^[-*•]\s+/.test(line)) {
        const bulletText = line.replace(/^[-*•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1').trim();
        if (!currentSection || (currentSection.type !== 'bullets' && currentSection.type !== 'checklist')) {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            title: 'Key Criteria & Details',
            type: 'bullets',
            items: [bulletText],
          };
        } else {
          currentSection.items = [...(currentSection.items || []), bulletText];
        }
        continue;
      }

      // Warning line
      if (line.includes('⚠️') || line.toLowerCase().startsWith('warning') || line.toLowerCase().startsWith('caution')) {
        const text = line.replace(/^[⚠️\s]+/, '').replace(/\*\*(.*?)\*\*/g, '$1').trim();
        if (!currentSection || currentSection.type !== 'warning') {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            title: 'Critical Audit Red Flag',
            type: 'warning',
            items: [text],
            text,
          };
        } else {
          currentSection.items = [...(currentSection.items || []), text];
        }
        continue;
      }

      // Normal paragraph
      const cleanPara = line.replace(/\*\*(.*?)\*\*/g, '$1').trim();
      if (currentSection && currentSection.type !== 'checklist' && currentSection.type !== 'bullets' && currentSection.type !== 'warning') {
        currentSection.text = currentSection.text ? `${currentSection.text} ${cleanPara}` : cleanPara;
      } else {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: '',
          type: 'paragraph',
          text: cleanPara,
        };
      }
    }

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = parseContent(content);

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Top Document Header Card with Metadata */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 sm:p-6 text-white shadow-sm border border-slate-700/80">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {resourceType.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              Tax Year {taxYear}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-medium text-slate-400 hidden sm:inline">
              Audience: {audience}
            </span>
          </div>

          <div className="text-right">
            <span className="font-extrabold text-xs text-white tracking-wide">
              {firmName.toUpperCase()}
            </span>
            <div className="text-[10px] text-emerald-400 font-medium">
              Authoritative Practice Standard
            </div>
          </div>
        </div>

        {/* Big Document Title without hashtags */}
        <div className="pt-4">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {sections[0]?.type === 'header' ? sections[0].title : content.split('\n')[0].replace(/^#+\s*/, '')}
          </h1>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
            <span>Verified IRS & Statutory Guidance</span>
            <span>•</span>
            <span>Interactive Due Diligence Layout</span>
          </p>
        </div>
      </div>

      {/* Render Document Sections */}
      <div className="space-y-4">
        {sections.map((sec, idx) => {
          // Skip first section if it was just the header we rendered above
          if (idx === 0 && sec.type === 'header') return null;

          // WARNING / RED FLAG SECTION
          if (sec.type === 'warning') {
            return (
              <div
                key={idx}
                className="bg-rose-50/90 border border-rose-200/90 rounded-xl p-4 sm:p-5 shadow-xs text-rose-950 space-y-2.5"
              >
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{sec.title || 'Critical Preparer Safeguards & Red Flags'}</span>
                </div>
                {sec.text && <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">{sec.text}</p>}
                {sec.items && sec.items.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {sec.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs sm:text-[13px] text-rose-900 flex items-start gap-2">
                        <span className="text-rose-600 font-black shrink-0">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }

          // DUE DILIGENCE / CALLOUT SECTION
          if (sec.type === 'callout') {
            return (
              <div
                key={idx}
                className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 sm:p-5 shadow-xs text-amber-950 space-y-2.5"
              >
                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{sec.title || 'IRC §6695(g) Due Diligence Compliance'}</span>
                </div>
                {sec.text && <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">{sec.text}</p>}
                {sec.items && sec.items.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {sec.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-xs text-amber-900 flex items-start gap-2">
                        <span className="text-amber-600 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // CHECKLIST SECTION (Interactive checkable items)
          if (sec.type === 'checklist') {
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs uppercase tracking-wider">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{sec.title || 'Required Verification Checklist'}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Interactive Checklist
                  </span>
                </div>

                {sec.items && sec.items.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {sec.items.map((item, itemIdx) => {
                      const itemId = `check-${idx}-${itemIdx}`;
                      const isChecked = checkedItems[itemId] || false;

                      return (
                        <div
                          key={itemIdx}
                          onClick={() => toggleCheck(itemId)}
                          className={`p-2.5 rounded-lg border flex items-start gap-3 transition cursor-pointer text-xs sm:text-[13px] ${
                            isChecked
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 line-through opacity-80'
                              : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <span className="leading-relaxed select-none">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // BULLETS / KEY CRITERIA SECTION
          if (sec.type === 'bullets') {
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
              >
                {sec.title && (
                  <div className="text-slate-800 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{sec.title}</span>
                  </div>
                )}

                {sec.items && sec.items.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {sec.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs sm:text-[13px] text-slate-700 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }

          // STANDARD SECTION OR SUBSECTION CARD
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-2"
            >
              {sec.title && (
                <div className="text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{sec.title}</span>
                </div>
              )}
              {sec.text && (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {sec.text}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Document Footer Disclaimer */}
      <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 leading-relaxed">
        <p>
          Prepared in compliance with Treasury Department Circular 230 and Internal Revenue Code standards. 
          For professional tax practice guidance. Retain corroborating records for at least 3 years.
        </p>
      </div>
    </div>
  );
};
