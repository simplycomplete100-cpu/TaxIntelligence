import React from 'react';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Search,
  FileSpreadsheet,
  FilePlus,
  Users,
  GraduationCap,
  ShieldAlert,
  Files,
  Bookmark,
  History,
  Sparkles,
  HelpCircle,
  Sliders,
  Database,
  Layers,
  Award,
  UserCog,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  FlaskConical,
  X
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'dashboard'
  | 'super_agent'
  | 'tax_library'
  | 'irs_research'
  | 'cheat_sheets'
  | 'resource_generator'
  | 'client_resources'
  | 'training_center'
  | 'scenario_lab'
  | 'due_diligence'
  | 'forms_pubs'
  | 'saved_resources'
  | 'recent_research'
  | 'tax_updates'
  | 'help'
  // Admin tabs
  | 'admin_dashboard'
  | 'knowledge_manager'
  | 'resource_manager'
  | 'training_manager'
  | 'user_management'
  | 'agent_settings'
  | 'approved_sources'
  | 'audit_log';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  isOpen,
  onClose,
}) => {
  const isAdmin = ['super_admin', 'firm_admin', 'manager', 'trainer'].includes(userRole);

  const mainNavItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'super_agent', label: 'Tax Super Agent', icon: Bot, badge: 'AI' },
    { id: 'tax_library', label: 'Tax Library', icon: BookOpen },
    { id: 'irs_research', label: 'IRS Research', icon: Search },
    { id: 'cheat_sheets', label: 'Cheat Sheets', icon: FileSpreadsheet },
    { id: 'resource_generator', label: 'Resource Generator', icon: FilePlus },
    { id: 'client_resources', label: 'Client Resources', icon: Users },
    { id: 'training_center', label: 'Training Center', icon: GraduationCap },
    { id: 'scenario_lab', label: 'Scenario Lab', icon: FlaskConical, badge: 'Interactive' },
    { id: 'due_diligence', label: 'Due Diligence Center', icon: ShieldAlert },
    { id: 'forms_pubs', label: 'Forms & Publications', icon: Files },
    { id: 'saved_resources', label: 'Saved Resources', icon: Bookmark },
    { id: 'recent_research', label: 'Recent Research', icon: History },
    { id: 'tax_updates', label: "Updates / What's New", icon: Sparkles },
    { id: 'help', label: 'Help & Compliance', icon: HelpCircle },
  ];

  const adminNavItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'admin_dashboard', label: 'Admin Dashboard', icon: Sliders },
    { id: 'knowledge_manager', label: 'Knowledge Manager', icon: Database },
    { id: 'resource_manager', label: 'Resource Manager', icon: Layers },
    { id: 'training_manager', label: 'Training Manager', icon: Award },
    { id: 'user_management', label: 'User Management', icon: UserCog },
    { id: 'agent_settings', label: 'Agent Settings', icon: Sliders },
    { id: 'approved_sources', label: 'Approved Sources', icon: CheckCircle2 },
    { id: 'audit_log', label: 'Audit Log', icon: Clock },
  ];

  const handleItemClick = (id: NavTab) => {
    onSelectTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-10 h-full lg:h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between lg:hidden text-white">
          <span className="font-bold text-sm tracking-wide">NAVIGATION</span>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-6">
          {/* Main Workstation Section */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tax Workstation
            </div>
            <nav className="space-y-0.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin Management Section */}
          {isAdmin && (
            <div>
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center justify-between">
                <span>Firm Admin</span>
                <span className="text-[9px] px-1 py-0.2 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20">
                  Manager
                </span>
              </div>
              <nav className="space-y-0.5">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Due Diligence Safeguard Pill Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">IRC §6695(g) Safeguard</span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Authoritative guidance verified. Preparer remains responsible for due diligence.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
