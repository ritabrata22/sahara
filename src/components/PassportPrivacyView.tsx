import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Translations } from '../i18n/translations';
import {
  PassportFieldKey,
  PassportViewMode,
  SaharaState,
  TabId,
} from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  EarningsWalletSymbol,
  SkillCapSymbol,
  TravelShieldSymbol,
  WorkBriefcaseSymbol,
} from './ProminentIcons';
import { TrustRing } from './TrustRing';

interface PassportPrivacyViewProps {
  state: SaharaState;
  t: Translations;
  viewMode: PassportViewMode;
  monthlyIncome: number;
  trustScore: number;
  onChangeViewMode: (mode: PassportViewMode) => void;
  onAddWorkRecord: (role: string, employer: string, period: string) => void;
  onRevokeConsent: (grantId: string) => void;
  onCreateConsentGrant: (recipient: string, purpose: string, fields: PassportFieldKey[]) => void;
  onNavigate: (tab: TabId, sub?: string) => void;
}

const FIELD_LABELS: Record<PassportFieldKey, string> = {
  incomeSummary: 'Income summary',
  workHistory: 'Work history',
  skillRecords: 'Skill records',
  references: 'Community references',
  identityStatus: 'Identity status',
};

export const PassportPrivacyView: React.FC<PassportPrivacyViewProps> = ({
  state,
  t,
  viewMode,
  monthlyIncome,
  trustScore,
  onChangeViewMode,
  onAddWorkRecord,
  onRevokeConsent,
  onCreateConsentGrant,
  onNavigate,
}) => {
  const [recordsExpanded, setRecordsExpanded] = useState(false);
  const [dataMapExpanded, setDataMapExpanded] = useState(true);
  const [showAddWork, setShowAddWork] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  const [newPeriod, setNewPeriod] = useState('June 2025');

  // Interactive "Consent in practice" review state
  const [reviewingPractice, setReviewingPractice] = useState(false);
  const [practiceFields, setPracticeFields] = useState<PassportFieldKey[]>([
    'workHistory',
    'skillRecords',
  ]);

  const certifiedCount = state.courses.filter((c) => c.certified).length;
  const totalWorkEntries = state.ledger.length + state.workHistory.length + 1;

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim() || !newEmployer.trim()) return;
    onAddWorkRecord(newRole.trim(), newEmployer.trim(), newPeriod.trim() || 'Recent');
    setNewRole('');
    setNewEmployer('');
    setShowAddWork(false);
  };

  const togglePracticeField = (field: PassportFieldKey) => {
    setPracticeFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#064E46]">{t.welcomeBack}</p>
          <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2421]">
            {viewMode === 'passport' ? t.myPassport : t.privacyAndConsent}
          </h1>
        </div>

        <div className="inline-flex rounded-xl bg-[#E4F0ED] p-1 border border-[#D4E6E1]">
          <button
            type="button"
            onClick={() => onChangeViewMode('passport')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              viewMode === 'passport' ? 'bg-white text-[#0F2421] shadow-xs' : 'text-[#4B6B65]'
            }`}
          >
            {t.myPassport}
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('privacy')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              viewMode === 'privacy' ? 'bg-white text-[#0F2421] shadow-xs' : 'text-[#4B6B65]'
            }`}
          >
            {t.privacyAndConsent}
          </button>
        </div>
      </div>

      {/* VIEW 1: MY PASSPORT (Screenshot 3) */}
      {viewMode === 'passport' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0F2421] leading-snug">
                  {t.independencePassport}
                </h2>
                <p className="mt-1.5 text-sm font-semibold text-[#0F2421]">{state.userName}</p>
                <p className="text-xs text-[#526763]">
                  {state.userTitle} · {state.userLocation}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#064E46] bg-[#EBF3F1] px-2.5 py-1 rounded-lg">
                {t.sampleProfile}
              </span>
            </div>

            <div className="rounded-2xl bg-[#E7EFECE6] border border-[#D4E2DE] p-4 flex items-center gap-4">
              <TrustRing percent={trustScore} size={74} strokeWidth={8} />
              <div>
                <p className="text-sm font-bold text-[#0F2421]">{t.yourTrustProfile}</p>
                <ul className="mt-2 space-y-1 text-xs text-[#2F4541]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#064E46]" />
                    <span>{t.incomeHistory}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#064E46]" />
                    <span>{t.communityTrust}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#064E46]" />
                    <span>{t.verifiedIdentity}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2x2 Metric Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onNavigate('earnings', 'ledger')}
                className="text-left rounded-[20px] bg-gradient-to-b from-[#BCE9D8] to-[#DAF5EA] border border-[#96D5BE] shadow-xs p-4 hover:brightness-[0.98] transition-all"
              >
                <EarningsWalletSymbol className="w-9 h-9 mb-2" />
                <p className="text-xl font-extrabold text-[#0F2421] tabular-nums">
                  Rs {monthlyIncome.toLocaleString('en-IN')}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[#184B43]">{t.incomeThisMonth}</p>
              </button>

              <button
                type="button"
                onClick={() => setRecordsExpanded(true)}
                className="text-left rounded-[20px] bg-gradient-to-b from-[#DFCDF3] to-[#F0E6FA] border border-[#C7ACE5] shadow-xs p-4 hover:brightness-[0.98] transition-all"
              >
                <WorkBriefcaseSymbol className="w-9 h-9 mb-2" />
                <p className="text-xl font-extrabold text-[#0F2421] tabular-nums">
                  {totalWorkEntries}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[#442C66]">{t.workEntries}</p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('earnings', 'skills')}
                className="text-left rounded-[20px] bg-gradient-to-b from-[#FBD5B1] to-[#FDEBD8] border border-[#EEB986] shadow-xs p-4 hover:brightness-[0.98] transition-all"
              >
                <SkillCapSymbol className="w-9 h-9 mb-2" />
                <p className="text-xl font-extrabold text-[#0F2421] tabular-nums">
                  {certifiedCount}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[#5E3A1C]">{t.skillRecords}</p>
              </button>

              <button
                type="button"
                onClick={() => setRecordsExpanded(true)}
                className="text-left rounded-[20px] bg-gradient-to-b from-[#FACCC4] to-[#FDE4DF] border border-[#EEB0A6] shadow-xs p-4 hover:brightness-[0.98] transition-all"
              >
                <TravelShieldSymbol className="w-9 h-9 mb-2" />
                <p className="text-xl font-extrabold text-[#0F2421] tabular-nums">
                  {state.references.length}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[#6F2D23]">{t.references}</p>
              </button>
            </div>
          </div>

          {/* Right Column: What Passport records + Consent CTA + Install PWA */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] overflow-hidden">
              <button
                type="button"
                onClick={() => setRecordsExpanded(!recordsExpanded)}
                className="w-full p-4 flex items-center justify-between text-left min-h-[54px]"
              >
                <span className="text-sm font-bold text-[#0F2421]">{t.whatPassportRecords}</span>
                {recordsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#526763]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#526763]" />
                )}
              </button>

              {recordsExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-[#EAE3D4] space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-[#064E46]">Work history</p>
                      <button
                        type="button"
                        onClick={() => setShowAddWork(!showAddWork)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#064E46]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add work</span>
                      </button>
                    </div>
                    {showAddWork && (
                      <form onSubmit={handleSaveWork} className="mb-3 space-y-2 rounded-xl bg-white p-3 border border-[#E5E0D5]">
                        <input
                          type="text"
                          required
                          placeholder="Role (e.g. Tailoring)"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="w-full rounded-lg border border-[#D4CFC3] px-2.5 py-2 text-xs"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Employer / Boutique"
                          value={newEmployer}
                          onChange={(e) => setNewEmployer(e.target.value)}
                          className="w-full rounded-lg border border-[#D4CFC3] px-2.5 py-2 text-xs"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Period"
                            value={newPeriod}
                            onChange={(e) => setNewPeriod(e.target.value)}
                            className="flex-1 rounded-lg border border-[#D4CFC3] px-2.5 py-2 text-xs"
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-[#064E46] px-3 py-2 text-xs font-semibold text-white"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    )}
                    <ul className="space-y-2">
                      {state.workHistory.map((wh) => (
                        <li key={wh.id} className="rounded-xl bg-white p-2.5 border border-[#E5E0D5] text-xs">
                          <p className="font-semibold text-[#0F2421]">{wh.role}</p>
                          <p className="text-[#526763]">
                            {wh.employer} · {wh.period}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#064E46] mb-1.5">References</p>
                    <ul className="space-y-2">
                      {state.references.map((ref) => (
                        <li key={ref.id} className="rounded-xl bg-white p-2.5 border border-[#E5E0D5] text-xs">
                          <p className="font-semibold text-[#0F2421]">{ref.name}</p>
                          <p className="text-[#526763]">{ref.relation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#064E46] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#0F2421]">{t.youChooseWhatToShare}</p>
                <p className="text-xs text-[#526763] mt-0.5">{t.notACreditScore}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangeViewMode('privacy')}
              className="w-full rounded-xl bg-gradient-to-b from-[#085E54] to-[#043C36] py-3.5 text-sm font-semibold text-white shadow-xs hover:brightness-105 min-h-[48px]"
            >
              {t.manageSharing}
            </button>

            <PWAInstallButton label={t.installApp} />
          </div>
        </div>
      )}

      {/* VIEW 2: PRIVACY & CONSENT (Screenshot 9) */}
      {viewMode === 'privacy' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DDF0E4] flex items-center justify-center text-[#064E46] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2421]">Your data stays in your hands</h2>
              <p className="mt-1 text-xs text-[#526763] leading-relaxed">
                Free for women does not mean data is sold.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <h3 className="text-base font-bold text-[#0F2421]">The short version</h3>
              {[
                'The woman controls Passport sharing',
                'Location sharing starts for a journey and can be stopped',
                'Health and support directory use is separate from the Passport',
                'Partners receive only the fields she consents to share',
                'She can correct or remove records',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-3.5 flex items-start gap-3 text-sm text-[#0F2421]"
                >
                  <Check className="w-4 h-4 text-[#064E46] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* Collapsible Data Map */}
              <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDataMapExpanded(!dataMapExpanded)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="text-base font-bold text-[#0F2421]">Data map</span>
                  {dataMapExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#526763]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#526763]" />
                  )}
                </button>
                {dataMapExpanded && (
                  <div className="px-4 pb-4 divide-y divide-[#E5E0D5]">
                    {[
                      {
                        title: 'Income and expense records',
                        action: 'Edit and delete',
                        onClick: () => onNavigate('earnings', 'ledger'),
                      },
                      {
                        title: 'Work history and skills',
                        action: 'Choose fields before sharing',
                        onClick: () => onChangeViewMode('passport'),
                      },
                      {
                        title: 'Live journey location',
                        action: 'Start and stop sharing',
                        onClick: () => onNavigate('safety'),
                      },
                      {
                        title: 'Care directory searches',
                        action: 'No Passport sharing required',
                        onClick: () => onNavigate('support', 'support-areas'),
                      },
                      {
                        title: 'Language choice',
                        action: 'Change at any time',
                        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                      },
                    ].map((row) => (
                      <button
                        key={row.title}
                        type="button"
                        onClick={row.onClick}
                        className="w-full text-left py-2.5 flex items-center justify-between gap-2 hover:opacity-80"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#0F2421]">{row.title}</p>
                          <p className="text-xs text-[#526763]">{row.action}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#064E46]">Open</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Consent in practice */}
              <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-4 space-y-3">
                <h3 className="text-base font-bold text-[#0F2421]">Consent in practice</h3>
                <p className="text-xs font-semibold text-[#064E46]">
                  See the fields · Choose recipient and purpose · Confirm or cancel
                </p>

                <div className="rounded-xl bg-white border border-[#E5E0D5] p-3.5 space-y-3">
                  <p className="text-sm font-medium text-[#0F2421] leading-relaxed">
                    Share selected work history with Sector 12 employer for this tailoring opportunity?
                  </p>

                  {reviewingPractice && (
                    <div className="space-y-1.5 pt-1">
                      {(Object.keys(FIELD_LABELS) as PassportFieldKey[]).map((key) => {
                        const checked = practiceFields.includes(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => togglePracticeField(key)}
                            className="w-full flex items-center gap-2.5 text-left text-xs py-1.5"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                checked
                                  ? 'bg-[#064E46] border-[#064E46] text-white'
                                  : 'border-[#B9C4C1]'
                              }`}
                            >
                              {checked && <Check className="w-3 h-3" />}
                            </span>
                            <span className="text-[#0F2421] font-medium">{FIELD_LABELS[key]}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setReviewingPractice(false)}
                      className="rounded-xl border border-[#D4CFC3] bg-white px-4 py-2 text-xs font-semibold text-[#0F2421] min-h-[40px]"
                    >
                      Cancel
                    </button>
                    {reviewingPractice ? (
                      <button
                        type="button"
                        disabled={practiceFields.length === 0}
                        onClick={() => {
                          onCreateConsentGrant(
                            'Sector 12 Employer (Tailoring)',
                            'Tailoring work application',
                            practiceFields
                          );
                          setReviewingPractice(false);
                        }}
                        className="rounded-xl bg-[#064E46] px-4 py-2 text-xs font-semibold text-white min-h-[40px] disabled:opacity-40"
                      >
                        Confirm sharing
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReviewingPractice(true)}
                        className="rounded-xl bg-[#064E46] px-4 py-2 text-xs font-semibold text-white min-h-[40px]"
                      >
                        Review fields
                      </button>
                    )}
                  </div>
                </div>

                {/* Active Consent Grants List */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-[#526763] mb-2">
                    Active sharing grants ({state.consentGrants.filter((g) => g.active).length})
                  </p>
                  {state.consentGrants.filter((g) => g.active).length === 0 ? (
                    <p className="text-xs text-[#526763]">No active external shares right now.</p>
                  ) : (
                    <div className="space-y-2">
                      {state.consentGrants
                        .filter((g) => g.active)
                        .map((grant) => (
                          <div
                            key={grant.id}
                            className="rounded-xl bg-white border border-[#E5E0D5] p-3 flex items-start justify-between gap-2"
                          >
                            <div className="text-xs">
                              <p className="font-semibold text-[#0F2421]">{grant.recipient}</p>
                              <p className="text-[#526763] mt-0.5">{grant.purpose}</p>
                              <p className="text-[#064E46] mt-1 font-medium">
                                Shared: {grant.fields.map((f) => FIELD_LABELS[f]).join(', ')}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRevokeConsent(grant.id)}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#C8553D] hover:bg-[#FCEBE6] shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#6E807D]">
            sahara — with you, for you. Does not lend; the Passport is not a credit score or loan guarantee.
          </p>
        </div>
      )}
    </div>
  );
};
