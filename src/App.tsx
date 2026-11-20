import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Home,
  MessageCircle,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react';
import { ConsentApplicationSheet } from './components/ConsentApplicationSheet';
import { HomeView } from './components/HomeView';
import { NotificationsSheet } from './components/NotificationsSheet';
import { PassportPrivacyView } from './components/PassportPrivacyView';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';
import { SafeTravelView } from './components/SafeTravelView';
import { SaharaFullBanner, SaharaLogo } from './components/SaharaLogo';
import { SupportHubView } from './components/SupportHubView';
import { VoiceIncomeSheet } from './components/VoiceIncomeSheet';
import { WorkEarningsView } from './components/WorkEarningsView';
import { INITIAL_SAHARA_STATE } from './data/initialData';
import { TRANSLATIONS } from './i18n/translations';
import {
  EarningsSubTab,
  IncomeEntry,
  JobOpportunity,
  Language,
  PassportFieldKey,
  PassportViewMode,
  PilotEnquiry,
  SaharaState,
  SupportMode,
  TabId,
} from './types';

const STORAGE_KEY = 'sahara_app_state_v1';

function loadInitialState(): SaharaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SaharaState>;
      return { ...INITIAL_SAHARA_STATE, ...parsed };
    }
  } catch {
    // fallback to seed state
  }
  return INITIAL_SAHARA_STATE;
}

export default function App() {
  const [state, setState] = useState<SaharaState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [earningsSubTab, setEarningsSubTab] = useState<EarningsSubTab>('jobs');
  const [supportMode, setSupportMode] = useState<SupportMode>('partner');
  const [partnerSubTab, setPartnerSubTab] = useState<'workflow' | 'areas'>('workflow');
  const [passportMode, setPassportMode] = useState<PassportViewMode>('passport');

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<JobOpportunity | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const t = TRANSLATIONS[state.language];

  const weeklyIncome = useMemo(
    () =>
      state.ledger
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0),
    [state.ledger]
  );

  const monthlyIncome = state.monthlyBaseIncome + weeklyIncome;

  const trustScore = useMemo(() => {
    const incomePts = Math.min(28, state.ledger.length * 4 + 8);
    const skillPts = Math.min(25, state.courses.filter((c) => c.certified).length * 7 + 4);
    const refPts = Math.min(20, state.references.length * 8 + 4);
    const idPts = state.identityVerified ? 10 : 0;
    const partnerPts = state.partnerConfirmed ? 7 : 0;
    return Math.min(100, incomePts + skillPts + refPts + idPts + partnerPts);
  }, [state.ledger.length, state.courses, state.references.length, state.identityVerified, state.partnerConfirmed]);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  const handleNavigate = (tab: TabId, subOption?: string) => {
    setActiveTab(tab);
    if (tab === 'earnings' && (subOption === 'jobs' || subOption === 'ledger' || subOption === 'skills')) {
      setEarningsSubTab(subOption);
    }
    if (tab === 'support') {
      if (subOption === 'support-areas') {
        setSupportMode('partner');
        setPartnerSubTab('areas');
      } else if (subOption === 'employers') {
        setSupportMode('employers');
      } else if (subOption === 'pilot') {
        setSupportMode('pilot');
      } else if (subOption === 'partner') {
        setSupportMode('partner');
        setPartnerSubTab('workflow');
      }
    }
    if (tab === 'profile') {
      if (subOption === 'privacy') {
        setPassportMode('privacy');
      } else {
        setPassportMode('passport');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveIncomeEntry = (entry: Omit<IncomeEntry, 'id'>) => {
    const newEntry: IncomeEntry = {
      ...entry,
      id: `inc-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      ledger: [newEntry, ...prev.ledger],
    }));
    showToast(
      `${entry.type === 'expense' ? 'Expense' : 'Income'} of Rs ${entry.amount.toLocaleString('en-IN')} saved`
    );
  };

  const handleDeleteEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      ledger: prev.ledger.filter((e) => e.id !== id),
    }));
    showToast('Record removed from your ledger');
  };

  const handleConfirmApplyJob = (jobId: string, selectedFields: PassportFieldKey[]) => {
    const targetJob = state.jobs.find((j) => j.id === jobId);
    if (!targetJob) return;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) =>
        j.id === jobId ? { ...j, applied: true, appliedAt: dateStr, sharedFields: selectedFields } : j
      ),
      consentGrants: [
        {
          id: `cg-${Date.now()}`,
          recipient: targetJob.employerName,
          purpose: `Application for ${targetJob.title}`,
          fields: selectedFields,
          grantedAt: dateStr,
          active: true,
        },
        ...prev.consentGrants,
      ],
    }));
    setApplyingJob(null);
    showToast(`Applied to ${targetJob.title} with ${selectedFields.length} shared fields`);
  };

  const handleAdvanceCourse = (courseId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        const nextCount = Math.min(c.modules.length, c.completedModules + 1);
        return {
          ...c,
          completedModules: nextCount,
          certified: nextCount >= c.modules.length,
        };
      }),
    }));
    showToast('Course progress updated in your Passport');
  };

  const handleCheckIn = (coordsText: string | null) => {
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setState((prev) => ({
      ...prev,
      lastCheckInTime: now,
      lastCheckInCoords: coordsText || prev.lastCheckInCoords,
    }));
    showToast(`Checked in safely at ${now}`);
  };

  const handleToggleContact = (contactId: string) => {
    setState((prev) => ({
      ...prev,
      trustedContacts: prev.trustedContacts.map((c) =>
        c.id === contactId ? { ...c, selectedForTrip: !c.selectedForTrip } : c
      ),
    }));
  };

  const handleSetTripSharing = (active: boolean, destination: string) => {
    setState((prev) => ({
      ...prev,
      tripSharingActive: active,
      tripDestination: destination,
    }));
    showToast(active ? 'Live journey sharing started' : 'Journey sharing stopped');
  };

  const handleAddWorkRecord = (role: string, employer: string, period: string) => {
    setState((prev) => ({
      ...prev,
      workHistory: [
        {
          id: `wh-${Date.now()}`,
          role,
          employer,
          period,
          verifiedBy: 'Self-recorded',
        },
        ...prev.workHistory,
      ],
    }));
    showToast('Work record added to Passport');
  };

  const handleRevokeConsent = (grantId: string) => {
    setState((prev) => ({
      ...prev,
      consentGrants: prev.consentGrants.map((g) =>
        g.id === grantId ? { ...g, active: false } : g
      ),
    }));
    showToast('Sharing access revoked');
  };

  const handleCreateConsentGrant = (
    recipient: string,
    purpose: string,
    fields: PassportFieldKey[]
  ) => {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    setState((prev) => ({
      ...prev,
      consentGrants: [
        {
          id: `cg-${Date.now()}`,
          recipient,
          purpose,
          fields,
          grantedAt: dateStr,
          active: true,
        },
        ...prev.consentGrants,
      ],
    }));
    showToast(`Shared ${fields.length} fields with ${recipient}`);
  };

  const handlePostEmployerJob = (job: Omit<JobOpportunity, 'id'>) => {
    const newJob: JobOpportunity = { ...job, id: `job-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      jobs: [newJob, ...prev.jobs],
    }));
    showToast(`Published "${newJob.title}" to Jobs Near You`);
  };

  const handleSubmitPilotEnquiry = (enquiry: Omit<PilotEnquiry, 'id' | 'submittedAt'>) => {
    const newEnq: PilotEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      submittedAt: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    setState((prev) => ({
      ...prev,
      pilotEnquiries: [newEnq, ...prev.pilotEnquiries],
    }));
    showToast('Gandhinagar pilot enquiry recorded');
  };

  const navItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'earnings', label: t.navEarnings, icon: Wallet },
    { id: 'safety', label: t.navSafety, icon: ShieldCheck },
    { id: 'support', label: t.navSupport, icon: MessageCircle },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#FCF9F2] text-[#0F2421] flex flex-col lg:flex-row">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-[#E5E0D5] bg-[#F7F3EA] px-4 py-5 justify-between sticky top-0 h-[100dvh]">
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="w-full px-1 py-1 text-left rounded-2xl hover:bg-[#EFE9DC]/60 transition-colors"
            aria-label="sahara — with you, for you."
          >
            <SaharaFullBanner className="w-full max-w-[216px]" />
          </button>

          <nav aria-label="Primary navigation" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors min-h-[44px] ${
                    active
                      ? 'bg-[#064E46] text-white'
                      : 'text-[#3F5551] hover:bg-[#EBF3F1] hover:text-[#0F2421]'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E5E0D5] space-y-1">
            <p className="px-3 text-[11px] font-semibold text-[#526763] mb-1">
              Community &amp; Governance
            </p>
            <button
              type="button"
              onClick={() => handleNavigate('support', 'employers')}
              className="w-full text-left rounded-xl px-3 py-2 text-xs font-medium text-[#3F5551] hover:bg-[#EBF3F1] min-h-[38px]"
            >
              {t.forEmployers}
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('support', 'pilot')}
              className="w-full text-left rounded-xl px-3 py-2 text-xs font-medium text-[#3F5551] hover:bg-[#EBF3F1] min-h-[38px]"
            >
              {t.gandhinagarPilot}
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('profile', 'privacy')}
              className="w-full text-left rounded-xl px-3 py-2 text-xs font-medium text-[#3F5551] hover:bg-[#EBF3F1] min-h-[38px]"
            >
              {t.privacyAndConsent}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <PWAInstallButton label={t.installApp} />
          <div className="rounded-xl bg-[#EBF3F1] p-3 text-xs text-[#37514C]">
            <p className="font-semibold text-[#064E46]">{state.userName}</p>
            <p className="mt-0.5">{state.userLocation} · Trust {trustScore}%</p>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Compact Mobile / Desktop Top Bar */}
        <header className="sticky top-0 z-30 h-[56px] bg-[#FCF9F2]/95 backdrop-blur-md border-b border-[#EAE4D7] px-4 lg:px-8 flex items-center justify-between gap-4 pt-safe">
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px]"
            aria-label="sahara — with you, for you."
          >
            <div className="lg:hidden">
              <SaharaLogo showWordmark />
            </div>
            <span className="hidden lg:inline text-sm font-semibold text-[#526763]">
              {state.userLocation} · {state.userTitle}
            </span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <div className="lg:hidden">
              <PWAInstallButton compact label="Install" />
            </div>

            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#F1ECE1] transition-colors"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="w-5 h-5 text-[#0F2421]" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#C8553D]" />
              )}
            </button>

            <label className="sr-only" htmlFor="sahara-lang-select">
              Language
            </label>
            <select
              id="sahara-lang-select"
              value={state.language}
              onChange={(e) =>
                setState((prev) => ({ ...prev, language: e.target.value as Language }))
              }
              className="rounded-xl border border-[#DDD7C9] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F2421] min-h-[38px] focus:outline-none focus:ring-2 focus:ring-[#064E46]"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 lg:px-8 pt-4 pb-24 lg:pb-10">
          {activeTab === 'home' && (
            <HomeView
              state={state}
              t={t}
              weeklyIncome={weeklyIncome}
              trustScore={trustScore}
              onNavigate={handleNavigate}
              onOpenVoice={() => setVoiceOpen(true)}
              onApplyJob={(job) => setApplyingJob(job)}
            />
          )}

          {activeTab === 'earnings' && (
            <WorkEarningsView
              state={state}
              t={t}
              activeSubTab={earningsSubTab}
              weeklyIncome={weeklyIncome}
              onChangeSubTab={setEarningsSubTab}
              onApplyJob={(job) => setApplyingJob(job)}
              onOpenVoice={() => setVoiceOpen(true)}
              onDeleteEntry={handleDeleteEntry}
              onAdvanceCourse={handleAdvanceCourse}
              onOpenEmployers={() => handleNavigate('support', 'employers')}
            />
          )}

          {activeTab === 'safety' && (
            <SafeTravelView
              state={state}
              t={t}
              onCheckIn={handleCheckIn}
              onToggleContact={handleToggleContact}
              onSetTripSharing={handleSetTripSharing}
            />
          )}

          {activeTab === 'support' && (
            <SupportHubView
              state={state}
              t={t}
              mode={supportMode}
              partnerSubTab={partnerSubTab}
              onChangeMode={setSupportMode}
              onChangePartnerSubTab={setPartnerSubTab}
              onTogglePartnerConfirm={() =>
                setState((prev) => ({ ...prev, partnerConfirmed: !prev.partnerConfirmed }))
              }
              onPostEmployerJob={handlePostEmployerJob}
              onSubmitPilotEnquiry={handleSubmitPilotEnquiry}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'profile' && (
            <PassportPrivacyView
              state={state}
              t={t}
              viewMode={passportMode}
              monthlyIncome={monthlyIncome}
              trustScore={trustScore}
              onChangeViewMode={setPassportMode}
              onAddWorkRecord={handleAddWorkRecord}
              onRevokeConsent={handleRevokeConsent}
              onCreateConsentGrant={handleCreateConsentGrant}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* Fixed Android Bottom Tab Bar (Mobile / Tablet) */}
      <nav
        aria-label="Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCF9F2]/95 backdrop-blur-md border-t border-[#E5E0D5] pb-safe"
      >
        <div className="grid grid-cols-5 h-16 items-center max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] transition-colors ${
                  active ? 'text-[#064E46]' : 'text-[#526763] hover:text-[#0F2421]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span className={`text-[10px] mt-1 tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sheets & Modals */}
      <VoiceIncomeSheet
        isOpen={voiceOpen}
        language={state.language}
        onClose={() => setVoiceOpen(false)}
        onSaveEntry={handleSaveIncomeEntry}
      />

      <ConsentApplicationSheet
        job={applyingJob}
        onClose={() => setApplyingJob(null)}
        onConfirmApply={handleConfirmApplyJob}
      />

      <NotificationsSheet
        isOpen={notificationsOpen}
        notifications={state.notifications}
        onClose={() => setNotificationsOpen(false)}
        onMarkAllRead={() =>
          setState((prev) => ({
            ...prev,
            notifications: prev.notifications.map((n) => ({ ...n, read: true })),
          }))
        }
        onSelectNotification={(id, targetTab) => {
          setState((prev) => ({
            ...prev,
            notifications: prev.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          }));
          setNotificationsOpen(false);
          if (targetTab) handleNavigate(targetTab);
        }}
      />

      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#064E46] text-white px-4 py-2.5 text-xs font-semibold shadow-lg whitespace-nowrap"
        >
          {toast}
        </div>
      )}

      <OfflineIndicator />
    </div>
  );
}
