import React, { useState, useEffect } from 'react';
import {
  User,
  FirmProfile,
  TaxYear,
  UserRole,
  KnowledgeArticle,
  IRSSource,
  TaxFormInfo,
  TrainingCourse,
  Scenario,
  SavedResearch,
  GeneratedResource,
  AuditLogEntry,
  ResourceType,
} from './types';
import {
  INITIAL_USER,
  INITIAL_FIRM_PROFILE,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_IRS_SOURCES,
  INITIAL_FORMS_AND_PUBS,
  INITIAL_TRAINING_COURSES,
  INITIAL_SCENARIOS,
  INITIAL_SAVED_RESEARCH,
  INITIAL_GENERATED_RESOURCES,
} from './data/taxDatabase';

import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SuperAgentView } from './components/SuperAgentView';
import { TaxLibraryView } from './components/TaxLibraryView';
import { IrsResearchView } from './components/IrsResearchView';
import { CheatSheetsView } from './components/CheatSheetsView';
import { ResourceGeneratorView } from './components/ResourceGeneratorView';
import { ClientResourcesView } from './components/ClientResourcesView';
import { TrainingCenterView } from './components/TrainingCenterView';
import { ScenarioLabView } from './components/ScenarioLabView';
import { DueDiligenceView } from './components/DueDiligenceView';
import { FormsPublicationsView } from './components/FormsPublicationsView';
import { SavedResourcesView } from './components/SavedResourcesView';
import { RecentResearchView } from './components/RecentResearchView';
import { TaxUpdatesView } from './components/TaxUpdatesView';

import { AdminKnowledgeManager } from './components/AdminKnowledgeManager';
import { AdminAgentSettings } from './components/AdminAgentSettings';
import { AdminAuditLog } from './components/AdminAuditLog';

import { UniversalSearchModal } from './components/UniversalSearchModal';
import { WhiteLabelModal } from './components/WhiteLabelModal';
import { HelpComplianceModal } from './components/HelpComplianceModal';
import { SourceDetailModal } from './components/SourceDetailModal';

export default function App() {
  // Primary state with localStorage persistence
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('taxintel_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [firmProfile, setFirmProfile] = useState<FirmProfile>(() => {
    const saved = localStorage.getItem('taxintel_firm');
    return saved ? JSON.parse(saved) : INITIAL_FIRM_PROFILE;
  });

  const [currentTaxYear, setCurrentTaxYear] = useState<TaxYear>(() => {
    const saved = localStorage.getItem('taxintel_year');
    return (saved as TaxYear) || '2026';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Entities state
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => {
    const saved = localStorage.getItem('taxintel_articles');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_ARTICLES;
  });

  const [sources, setSources] = useState<IRSSource[]>(() => {
    const saved = localStorage.getItem('taxintel_sources');
    return saved ? JSON.parse(saved) : INITIAL_IRS_SOURCES;
  });

  const [forms] = useState<TaxFormInfo[]>(INITIAL_FORMS_AND_PUBS);
  const [courses] = useState<TrainingCourse[]>(INITIAL_TRAINING_COURSES);
  const [scenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);

  const [savedResearch, setSavedResearch] = useState<SavedResearch[]>(() => {
    const saved = localStorage.getItem('taxintel_research');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_RESEARCH;
  });

  const [savedResources, setSavedResources] = useState<GeneratedResource[]>(() => {
    const saved = localStorage.getItem('taxintel_resources');
    return saved ? JSON.parse(saved) : INITIAL_GENERATED_RESOURCES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '2026-02-18 09:30:12',
      user: 'Sarah Vance, CPA',
      action: 'Verified Article',
      targetType: 'article',
      targetId: 'art-hoh-complete',
      details: 'Reviewed statutory criteria under IRC §7703(b) for Tax Year 2026.',
    },
    {
      id: 'log-2',
      timestamp: '2026-02-17 14:15:40',
      user: 'Marcus Chen, EA',
      action: 'Created Resource',
      targetType: 'resource',
      targetId: 'gen-1',
      details: 'Generated 2026 Head of Household Quick Qualification Cheat Sheet.',
    },
  ]);

  // Contextual triggers for deep navigation
  const [agentInitialQuery, setAgentInitialQuery] = useState<string>('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>();
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>();
  const [selectedResearchId, setSelectedResearchId] = useState<string | undefined>();
  const [selectedFormNumber, setSelectedFormNumber] = useState<string | undefined>();
  const [generatorInitType, setGeneratorInitType] = useState<ResourceType>('cheat_sheet');
  const [generatorInitTopic, setGeneratorInitTopic] = useState<string>('Head of Household');
  const [generatorInitContent, setGeneratorInitContent] = useState<string>('');

  // Modals state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isWhiteLabelModalOpen, setIsWhiteLabelModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activeSourceDetail, setActiveSourceDetail] = useState<IRSSource | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('taxintel_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('taxintel_firm', JSON.stringify(firmProfile));
  }, [firmProfile]);

  useEffect(() => {
    localStorage.setItem('taxintel_year', currentTaxYear);
  }, [currentTaxYear]);

  useEffect(() => {
    localStorage.setItem('taxintel_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('taxintel_research', JSON.stringify(savedResearch));
  }, [savedResearch]);

  useEffect(() => {
    localStorage.setItem('taxintel_resources', JSON.stringify(savedResources));
  }, [savedResources]);

  // Global keyboard shortcut for universal search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleTaxYearChange = (year: TaxYear) => {
    setCurrentTaxYear(year);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const handleAskAgent = (query: string) => {
    setAgentInitialQuery(query);
    setActiveTab('super_agent');
  };

  const handleTurnIntoResource = (type: string, topic: string, content: string) => {
    setGeneratorInitType(type as ResourceType);
    setGeneratorInitTopic(topic);
    setGeneratorInitContent(content);
    setActiveTab('resource_generator');
  };

  const handleSaveResearch = (item: Omit<SavedResearch, 'id'>) => {
    const newRecord: SavedResearch = {
      ...item,
      id: `res-${Date.now()}`,
    };
    setSavedResearch((prev) => [newRecord, ...prev]);
    // Add audit log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: currentUser.name,
        action: 'Saved Research',
        targetType: 'resource',
        targetId: newRecord.id,
        details: `Saved research on "${newRecord.title}"`,
      },
      ...prev,
    ]);
  };

  const handleSaveResource = (item: Omit<GeneratedResource, 'id'>) => {
    const newRes: GeneratedResource = {
      ...item,
      id: `gen-${Date.now()}`,
    };
    setSavedResources((prev) => [newRes, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: currentUser.name,
        action: 'Created Resource',
        targetType: 'resource',
        targetId: newRes.id,
        details: `Generated ${newRes.type} for ${newRes.title}`,
      },
      ...prev,
    ]);
  };

  const handleDeleteResource = (id: string) => {
    setSavedResources((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setSavedResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const handleUpdateArticle = (updated: KnowledgeArticle) => {
    setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: currentUser.name,
        action: `Updated Article (${updated.status})`,
        targetType: 'article',
        targetId: updated.id,
        details: `Updated "${updated.title}" to status ${updated.status}`,
      },
      ...prev,
    ]);
  };

  const handleCreateArticle = (articleData: Omit<KnowledgeArticle, 'id'>) => {
    const newArt: KnowledgeArticle = {
      ...articleData,
      id: `art-${Date.now()}`,
    };
    setArticles((prev) => [newArt, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: currentUser.name,
        action: 'Created Article',
        targetType: 'article',
        targetId: newArt.id,
        details: `Published "${newArt.title}" under ${newArt.category}`,
      },
      ...prev,
    ]);
  };

  const handleNavigateTo = (tab: NavTab, targetId?: string) => {
    setActiveTab(tab);
    if (tab === 'tax_library' && targetId) setSelectedArticleId(targetId);
    if (tab === 'saved_resources' && targetId) setSelectedResourceId(targetId);
    if (tab === 'recent_research' && targetId) setSelectedResearchId(targetId);
    if (tab === 'forms_pubs' && targetId) setSelectedFormNumber(targetId);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Persistent Navbar */}
      <Navbar
        currentTaxYear={currentTaxYear}
        onTaxYearChange={handleTaxYearChange}
        currentUser={currentUser}
        onUserRoleChange={handleRoleChange}
        firmProfile={firmProfile}
        onOpenWhiteLabel={() => setIsWhiteLabelModalOpen(true)}
        onOpenUniversalSearch={() => setIsSearchModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Body Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          userRole={currentUser.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Workstation Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                firmProfile={firmProfile}
                currentTaxYear={currentTaxYear}
                savedResearch={savedResearch}
                savedResources={savedResources}
                articles={articles}
                courses={courses}
                onNavigateTo={handleNavigateTo}
                onAskAgent={handleAskAgent}
                onOpenResourceGenerator={(type, topic) => {
                  if (type) setGeneratorInitType(type as ResourceType);
                  if (topic) setGeneratorInitTopic(topic);
                  setActiveTab('resource_generator');
                }}
              />
            )}

            <div style={{ display: activeTab === 'super_agent' ? 'block' : 'none' }}>
              <SuperAgentView
                currentTaxYear={currentTaxYear}
                firmProfile={firmProfile}
                onSaveResearch={handleSaveResearch}
                onTurnIntoResource={handleTurnIntoResource}
                onOpenSourceModal={(src) => setActiveSourceDetail(src)}
                initialQuery={agentInitialQuery}
                onClearInitialQuery={() => setAgentInitialQuery('')}
              />
            </div>

            {activeTab === 'tax_library' && (
              <TaxLibraryView
                articles={articles}
                currentTaxYear={currentTaxYear}
                onOpenSourceModal={(src) => setActiveSourceDetail(src)}
                onTurnIntoResource={handleTurnIntoResource}
                selectedArticleId={selectedArticleId}
              />
            )}

            {activeTab === 'irs_research' && (
              <IrsResearchView
                sources={sources}
                currentTaxYear={currentTaxYear}
                onAskAgent={handleAskAgent}
                onTurnIntoResource={handleTurnIntoResource}
                onOpenSourceModal={(src) => setActiveSourceDetail(src)}
              />
            )}

            {activeTab === 'cheat_sheets' && (
              <CheatSheetsView
                currentTaxYear={currentTaxYear}
                firmProfile={firmProfile}
                savedResources={savedResources}
                onOpenResourceGenerator={(type, topic) => {
                  if (type) setGeneratorInitType(type as ResourceType);
                  if (topic) setGeneratorInitTopic(topic);
                  setActiveTab('resource_generator');
                }}
              />
            )}

            {activeTab === 'resource_generator' && (
              <ResourceGeneratorView
                currentTaxYear={currentTaxYear}
                firmProfile={firmProfile}
                onSaveResource={handleSaveResource}
                initialType={generatorInitType}
                initialTopic={generatorInitTopic}
                initialSourceContent={generatorInitContent}
              />
            )}

            {activeTab === 'client_resources' && (
              <ClientResourcesView
                currentTaxYear={currentTaxYear}
                firmProfile={firmProfile}
                savedResources={savedResources}
                onOpenResourceGenerator={(type, topic) => {
                  if (type) setGeneratorInitType(type as ResourceType);
                  if (topic) setGeneratorInitTopic(topic);
                  setActiveTab('resource_generator');
                }}
              />
            )}

            {activeTab === 'training_center' && (
              <TrainingCenterView
                courses={courses}
                currentTaxYear={currentTaxYear}
                onNavigateToScenarioLab={() => setActiveTab('scenario_lab')}
                onGenerateTraining={(topic) => {
                  handleTurnIntoResource('training_guide', topic, `Training on ${topic}`);
                }}
              />
            )}

            {activeTab === 'scenario_lab' && (
              <ScenarioLabView
                scenarios={scenarios}
                currentTaxYear={currentTaxYear}
              />
            )}

            {activeTab === 'due_diligence' && (
              <DueDiligenceView
                currentTaxYear={currentTaxYear}
                firmProfile={firmProfile}
                onAskAgent={handleAskAgent}
                onOpenResourceGenerator={(type, topic) => {
                  if (type) setGeneratorInitType(type as ResourceType);
                  if (topic) setGeneratorInitTopic(topic);
                  setActiveTab('resource_generator');
                }}
              />
            )}

            {activeTab === 'forms_pubs' && (
              <FormsPublicationsView
                forms={forms}
                currentTaxYear={currentTaxYear}
                onAskAgent={handleAskAgent}
                onTurnIntoResource={handleTurnIntoResource}
                selectedFormNumber={selectedFormNumber}
              />
            )}

            {activeTab === 'saved_resources' && (
              <SavedResourcesView
                resources={savedResources}
                currentTaxYear={currentTaxYear}
                firmProfile={firmProfile}
                onDeleteResource={handleDeleteResource}
                onToggleFavorite={handleToggleFavorite}
                onOpenResourceGenerator={(type, topic) => {
                  if (type) setGeneratorInitType(type as ResourceType);
                  if (topic) setGeneratorInitTopic(topic);
                  setActiveTab('resource_generator');
                }}
                selectedResourceId={selectedResourceId}
              />
            )}

            {activeTab === 'recent_research' && (
              <RecentResearchView
                researchList={savedResearch}
                currentTaxYear={currentTaxYear}
                onTurnIntoResource={handleTurnIntoResource}
                onAskAgent={handleAskAgent}
                selectedResearchId={selectedResearchId}
              />
            )}

            {activeTab === 'tax_updates' && (
              <TaxUpdatesView
                currentTaxYear={currentTaxYear}
                onAskAgent={handleAskAgent}
              />
            )}

            {activeTab === 'help' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs max-w-4xl space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-emerald-800">
                    TI
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-slate-900">
                      TaxIntel Pro Standards & Guidance
                    </h1>
                    <p className="text-xs text-slate-500">
                      Circular 230 Practice Rules, Due Diligence Safeguards, and Platform Documentation
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-2">
                  <span className="font-bold text-emerald-900 text-sm">
                    Core Philosophy: &quot;MAKE THIS USEFUL&quot;
                  </span>
                  <p className="leading-relaxed">
                    Tax research is only valuable if it translates into immediate tax practice utility. On every researched answer, use the <strong>MAKE THIS USEFUL</strong> button to turn statutory explanations into Cheat Sheets, Client Handouts, or Preparer Checklists.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-2">
                  <span className="font-bold text-slate-900">Treasury Department Circular 230 Notice</span>
                  <p className="leading-relaxed">
                    This platform serves tax professionals, preparers, and firms as an interactive intelligence workstation. It does not replace independent factual inquiry or the professional judgment required by federal tax laws.
                  </p>
                </div>
              </div>
            )}

            {/* Admin Views */}
            {activeTab === 'admin_dashboard' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Firm Executive Console
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                      Admin Intelligence Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Organization metrics, knowledge base verification statuses, and preparer training compliance.
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Articles</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{articles.length}</div>
                    <span className="text-[11px] text-emerald-700 font-semibold">100% Verified</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">IRS Sources</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{sources.length}</div>
                    <span className="text-[11px] text-blue-700 font-semibold">Official IRS.gov</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saved Resources</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{savedResources.length}</div>
                    <span className="text-[11px] text-amber-700 font-semibold">Practice Ready</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Diligence Audit Risk</span>
                    <div className="text-2xl font-black text-emerald-700 mt-1">Low Risk</div>
                    <span className="text-[11px] text-slate-500">§6695(g) Enforced</span>
                  </div>
                </div>

                <AdminAuditLog logs={auditLogs} />
              </div>
            )}

            {activeTab === 'knowledge_manager' && (
              <AdminKnowledgeManager
                articles={articles}
                sources={sources}
                currentTaxYear={currentTaxYear}
                onUpdateArticle={handleUpdateArticle}
                onCreateArticle={handleCreateArticle}
              />
            )}

            {activeTab === 'agent_settings' && (
              <AdminAgentSettings
                firmProfile={firmProfile}
                onSaveProfile={(prof) => setFirmProfile(prof)}
              />
            )}

            {activeTab === 'audit_log' && <AdminAuditLog logs={auditLogs} />}

            {activeTab === 'resource_manager' && (
              <SavedResourcesView
                resources={savedResources}
                currentTaxYear={currentTaxYear}
                firmProfile={firmProfile}
                onDeleteResource={handleDeleteResource}
                onToggleFavorite={handleToggleFavorite}
                onOpenResourceGenerator={(type, topic) => {
                  if (type) setGeneratorInitType(type as ResourceType);
                  if (topic) setGeneratorInitTopic(topic);
                  setActiveTab('resource_generator');
                }}
              />
            )}

            {activeTab === 'training_manager' && (
              <TrainingCenterView
                courses={courses}
                currentTaxYear={currentTaxYear}
                onNavigateToScenarioLab={() => setActiveTab('scenario_lab')}
                onGenerateTraining={(topic) => {
                  handleTurnIntoResource('training_guide', topic, `Training on ${topic}`);
                }}
              />
            )}

            {activeTab === 'user_management' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Firm Staff & Preparer Management</h2>
                    <p className="text-xs text-slate-500">Manage tax preparers, trainers, managers, and PTIN credentials</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                    Active Firm: {firmProfile.name}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-slate-500">{currentUser.email} • PTIN: {currentUser.ptin || 'P01849203'}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'approved_sources' && (
              <IrsResearchView
                sources={sources}
                currentTaxYear={currentTaxYear}
                onAskAgent={handleAskAgent}
                onTurnIntoResource={handleTurnIntoResource}
                onOpenSourceModal={(src) => setActiveSourceDetail(src)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UniversalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        articles={articles}
        sources={sources}
        forms={forms}
        resources={savedResources}
        courses={courses}
        currentTaxYear={currentTaxYear}
        onNavigateTo={handleNavigateTo}
        onAskAgent={handleAskAgent}
      />

      <WhiteLabelModal
        isOpen={isWhiteLabelModalOpen}
        onClose={() => setIsWhiteLabelModalOpen(false)}
        firmProfile={firmProfile}
        onSaveProfile={(prof) => setFirmProfile(prof)}
      />

      <HelpComplianceModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <SourceDetailModal
        source={activeSourceDetail}
        onClose={() => setActiveSourceDetail(null)}
        onAskAgent={handleAskAgent}
        onTurnIntoResource={handleTurnIntoResource}
      />
    </div>
  );
}
