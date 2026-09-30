import React from 'react';
import {
  Search,
  Calendar,
  Building2,
  UserCheck,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  FileText,
  HelpCircle,
  Menu,
  ChevronDown
} from 'lucide-react';
import { TaxYear, UserRole, FirmProfile, User } from '../types';

interface NavbarProps {
  currentTaxYear: TaxYear;
  onTaxYearChange: (year: TaxYear) => void;
  currentUser: User;
  onUserRoleChange: (role: UserRole) => void;
  firmProfile: FirmProfile;
  onOpenWhiteLabel: () => void;
  onOpenUniversalSearch: () => void;
  onOpenHelp: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTaxYear,
  onTaxYearChange,
  currentUser,
  onUserRoleChange,
  firmProfile,
  onOpenWhiteLabel,
  onOpenUniversalSearch,
  onOpenHelp,
  onToggleSidebar,
}) => {
  const taxYears: TaxYear[] = ['2026', '2025', '2024', '2023', '2022', 'prior'];

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: 'Firm Admin (Full Access)', value: 'firm_admin' },
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Tax Preparer', value: 'tax_preparer' },
    { label: 'Tax Trainer', value: 'trainer' },
    { label: 'Manager / Reviewer', value: 'manager' },
    { label: 'Student / Trainee', value: 'student' },
    { label: 'Read Only', value: 'read_only' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.hash = ''}>
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-base shadow-sm">
              TI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  {firmProfile.name.split(' ')[0]} <span className="text-emerald-400 font-bold">INTEL</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 rounded">
                  PRO
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate max-w-[200px] hidden md:block">
                {firmProfile.eroName}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Universal Search trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenUniversalSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-300 text-xs transition shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300" />
              <span>Search IRS rules, forms, cheat sheets, training...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 text-[10px] rounded font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Tax Year, Role Switcher, White-Label, Help */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search icon */}
          <button
            onClick={onOpenUniversalSearch}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 md:hidden"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Persistent Tax Year Selector */}
          <div className="flex items-center bg-slate-800 border border-emerald-600/40 rounded-lg p-1">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 uppercase px-2 py-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Tax Year:</span>
            </span>
            <select
              value={currentTaxYear}
              onChange={(e) => onTaxYearChange(e.target.value as TaxYear)}
              className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded border border-slate-700 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {taxYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === 'prior' ? 'Prior Years' : yr}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="hidden xl:flex items-center">
            <div className="relative">
              <select
                value={currentUser.role}
                onChange={(e) => onUserRoleChange(e.target.value as UserRole)}
                className="bg-slate-800 text-slate-200 text-xs font-medium pl-2.5 pr-7 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none cursor-pointer appearance-none"
              >
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* White-Label Firm Settings Toggle */}
          <button
            onClick={onOpenWhiteLabel}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition"
            title="Firm White-Label & Agent Settings"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Firm Setup</span>
          </button>

          {/* Help & Due Diligence Disclaimers */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Help & Compliance Standards"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-600">
              {currentUser.avatar || 'SV'}
            </div>
            <div className="hidden 2xl:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 leading-tight capitalize">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
