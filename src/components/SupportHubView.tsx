import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Languages,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  UserPlus,
  ClipboardCheck,
  X,
} from 'lucide-react';
import { SUPPORT_RESOURCES } from '../data/initialData';
import { Translations } from '../i18n/translations';
import {
  JobOpportunity,
  PilotEnquiry,
  SaharaState,
  SupportMode,
  TabId,
} from '../types';
import {
  ClinicHospitalSymbol,
  GovernmentBuildingSymbol,
  LegalScalesSymbol,
  SkillCapSymbol,
} from './ProminentIcons';

interface SupportHubViewProps {
  state: SaharaState;
  t: Translations;
  mode: SupportMode;
  partnerSubTab: 'workflow' | 'areas';
  onChangeMode: (mode: SupportMode) => void;
  onChangePartnerSubTab: (tab: 'workflow' | 'areas') => void;
  onTogglePartnerConfirm: () => void;
  onPostEmployerJob: (job: Omit<JobOpportunity, 'id'>) => void;
  onSubmitPilotEnquiry: (enquiry: Omit<PilotEnquiry, 'id' | 'submittedAt'>) => void;
  onNavigate: (tab: TabId, sub?: string) => void;
}

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Introduce sahara and choose a language',
    detail: 'Switch between English, Hindi, or Gujarati from the top bar so women can read and hear prompts comfortably.',
    icon: Languages,
  },
  {
    num: '02',
    title: 'Help register and explain consent',
    detail: 'Walk through the Privacy & consent screen together. Make clear that sahara never sells personal data or acts as a credit score.',
    icon: UserPlus,
  },
  {
    num: '03',
    title: 'Support the first income or work entry',
    detail: 'Use "Speak to add income" with a real daily piecework sentence so she sees how voice records work.',
    icon: Briefcase,
  },
  {
    num: '04',
    title: 'Connect verified care and legal support',
    detail: 'Show her the Support areas directory (181 Abhayam, Sakhi One Stop Centre, DLSA legal aid) — usable without sharing Passport data.',
    icon: ShieldCheck,
  },
  {
    num: '05',
    title: 'Review concerns without presenting them as verified facts',
    detail: 'Log employer or route concerns carefully for SHG review while keeping unverified notes separate from verified records.',
    icon: ClipboardCheck,
  },
];

export const SupportHubView: React.FC<SupportHubViewProps> = ({
  state,
  t,
  mode,
  partnerSubTab,
  onChangeMode,
  onChangePartnerSubTab,
  onTogglePartnerConfirm,
  onPostEmployerJob,
  onSubmitPilotEnquiry,
  onNavigate,
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>('01');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'care' | 'legal' | 'health' | 'government'>('all');
  const [viewingJob, setViewingJob] = useState<JobOpportunity | null>(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Post job form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobSub, setNewJobSub] = useState('');
  const [newJobLoc, setNewJobLoc] = useState('Sector 12, Gandhinagar');
  const [newJobPay, setNewJobPay] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Pilot enquiry form state
  const [enqName, setEnqName] = useState('');
  const [enqOrg, setEnqOrg] = useState('');
  const [enqRole, setEnqRole] = useState<PilotEnquiry['role']>('NGO / SHG');
  const [enqMsg, setEnqMsg] = useState('');

  const filteredResources = SUPPORT_RESOURCES.filter((r) =>
    resourceFilter === 'all' ? true : r.category === resourceFilter
  );

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobPay.trim()) return;
    onPostEmployerJob({
      title: newJobTitle.trim(),
      subtitle: newJobSub.trim() || 'Reviewed local work',
      location: newJobLoc.trim() || 'Gandhinagar',
      payLabel: newJobPay.trim(),
      postedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      verified: true,
      verifiedBy: 'Gandhinagar Pilot Review',
      employerName: enqOrg.trim() || 'Local Gandhinagar Employer',
      description: newJobDesc.trim() || 'Reviewed local work opportunity posted through the employer desk.',
      requirements: ['Local Gandhinagar availability', 'Consent-led Passport application'],
    });
    setNewJobTitle('');
    setNewJobSub('');
    setNewJobPay('');
    setNewJobDesc('');
    setShowPostJobModal(false);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enqName.trim() || !enqMsg.trim()) return;
    onSubmitPilotEnquiry({
      name: enqName.trim(),
      organization: enqOrg.trim() || 'Community Partner',
      role: enqRole,
      message: enqMsg.trim(),
    });
    setEnqName('');
    setEnqOrg('');
    setEnqMsg('');
    setShowEnquiryModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header + Hub Switcher */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#064E46]">{t.welcomeBack}</p>
          <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2421]">
            {mode === 'partner'
              ? t.partnerSupport
              : mode === 'employers'
              ? t.forEmployers
              : t.gandhinagarPilot}
          </h1>
        </div>

        <div className="inline-flex rounded-xl bg-[#E4F0ED] p-1 border border-[#D4E6E1]">
          <button
            type="button"
            onClick={() => onChangeMode('partner')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'partner' ? 'bg-white text-[#0F2421] shadow-xs' : 'text-[#4B6B65]'
            }`}
          >
            NGOs &amp; Care
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('employers')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'employers' ? 'bg-white text-[#0F2421] shadow-xs' : 'text-[#4B6B65]'
            }`}
          >
            For Employers
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('pilot')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'pilot' ? 'bg-white text-[#0F2421] shadow-xs' : 'text-[#4B6B65]'
            }`}
          >
            Pilot
          </button>
        </div>
      </div>

      {/* MODE 1: PARTNER SUPPORT (Screenshots 6 & 7) */}
      {mode === 'partner' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#0F2421] text-balance">
              Meet women where support already exists.
            </h2>
            <p className="mt-1 text-xs font-semibold text-[#064E46]">For NGOs and SHGs</p>
            <p className="mt-2 text-sm text-[#526763] leading-relaxed">
              Support onboarding, regional language access, record keeping, referrals, and safety information.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#E4F0ED] border border-[#D4E6E1]">
            <button
              type="button"
              onClick={() => onChangePartnerSubTab('workflow')}
              className={`rounded-lg py-2.5 text-xs font-semibold transition-colors min-h-[40px] ${
                partnerSubTab === 'workflow'
                  ? 'bg-white text-[#0F2421] shadow-xs'
                  : 'text-[#4B6B65]'
              }`}
            >
              Partner workflow
            </button>
            <button
              type="button"
              onClick={() => onChangePartnerSubTab('areas')}
              className={`rounded-lg py-2.5 text-xs font-semibold transition-colors min-h-[40px] ${
                partnerSubTab === 'areas'
                  ? 'bg-white text-[#0F2421] shadow-xs'
                  : 'text-[#4B6B65]'
              }`}
            >
              Support areas
            </button>
          </div>

          {partnerSubTab === 'workflow' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <div className="space-y-2.5">
                {WORKFLOW_STEPS.map((step) => {
                  const Icon = step.icon;
                  const open = expandedStep === step.num;
                  return (
                    <div
                      key={step.num}
                      className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedStep(open ? null : step.num)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 min-h-[56px]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className="w-5 h-5 text-[#064E46] shrink-0" />
                          <span className="text-sm font-semibold text-[#0F2421] leading-snug">
                            {step.title}
                          </span>
                        </div>
                        <span className="font-mono-num text-xs font-bold text-[#064E46] shrink-0">
                          {step.num}
                        </span>
                      </button>
                      {open && (
                        <div className="px-4 pb-4 pt-1 border-t border-[#EAE3D4] text-xs text-[#526763] leading-relaxed">
                          {step.detail}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sample Partner View */}
              <div className="space-y-3">
                <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#0F2421]">Sample partner view</h3>
                      <p className="text-xs text-[#526763] mt-0.5">Live consent-gated summary</p>
                    </div>
                    <button
                      type="button"
                      onClick={onTogglePartnerConfirm}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors ${
                        state.partnerConfirmed
                          ? 'bg-[#EBF3F1] border-[#064E46] text-[#064E46]'
                          : 'bg-white border-[#D4CFC3] text-[#526763]'
                      }`}
                    >
                      {state.partnerConfirmed ? 'Partner-confirmed' : 'Mark confirmed'}
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-base font-bold text-[#0F2421]">{state.userName}</p>
                    <p className="text-xs text-[#526763] mt-0.5">
                      {state.userTitle} · {state.userLocation}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-[#E1F0F4] p-3">
                      <p className="text-[11px] text-[#45636B]">Identity verification</p>
                      <p className="mt-1 text-sm font-bold text-[#0F2421]">
                        {state.partnerConfirmed ? 'Partner-verified' : 'Pending'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#E1F0F4] p-3">
                      <p className="text-[11px] text-[#45636B]">Work entries</p>
                      <p className="mt-1 text-sm font-bold text-[#0F2421] tabular-nums">
                        {state.ledger.length + 3}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#E1F0F4] p-3">
                      <p className="text-[11px] text-[#45636B]">Skill records</p>
                      <p className="mt-1 text-sm font-bold text-[#0F2421] tabular-nums">
                        {state.courses.filter((c) => c.certified).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#C8F3DC] border border-[#B0E8CA] p-4 text-xs font-medium text-[#064E46] leading-relaxed">
                  Consent is purpose-specific. Personal location, health, and financial data is never sold.
                </div>

                <button
                  type="button"
                  onClick={() => onChangeMode('pilot')}
                  className="w-full rounded-xl border border-[#D4CFC3] bg-white py-3 text-sm font-semibold text-[#0F2421] hover:bg-[#F7F3EA] min-h-[46px]"
                >
                  Talk about the pilot
                </button>
              </div>
            </div>
          ) : (
            /* Support Areas Directory */
            <div className="space-y-4">
              {/* 2x2 Prominent Support & Skills Grid matching visual style */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <button
                  type="button"
                  onClick={() => setResourceFilter(resourceFilter === 'health' ? 'all' : 'health')}
                  className={`group text-center rounded-[20px] bg-gradient-to-b from-[#FACCC4] via-[#FBD9D3] to-[#FDE7E3] border px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] shadow-xs hover:brightness-[0.98] active:scale-[0.98] transition-all ${
                    resourceFilter === 'health' ? 'border-[#C83E26] ring-2 ring-[#C83E26]/25' : 'border-[#EEB0A6]'
                  }`}
                >
                  <ClinicHospitalSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
                  <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">
                    Clinics &amp; Hospitals
                  </p>
                  <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#6F2D23]">
                    <span>&lt; 2 km</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setResourceFilter(resourceFilter === 'legal' ? 'all' : 'legal')}
                  className={`group text-center rounded-[20px] bg-gradient-to-b from-[#BCE9D8] via-[#CCEFE1] to-[#DFF6EC] border px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] shadow-xs hover:brightness-[0.98] active:scale-[0.98] transition-all ${
                    resourceFilter === 'legal' ? 'border-[#064E46] ring-2 ring-[#064E46]/25' : 'border-[#96D5BE]'
                  }`}
                >
                  <LegalScalesSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
                  <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">
                    Legal Help
                  </p>
                  <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#184B43]">
                    <span>&lt; 1 km</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setResourceFilter(resourceFilter === 'government' ? 'all' : 'government')}
                  className={`group text-center rounded-[20px] bg-gradient-to-b from-[#DFCDF3] via-[#E9DBF7] to-[#F2EAFA] border px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] shadow-xs hover:brightness-[0.98] active:scale-[0.98] transition-all ${
                    resourceFilter === 'government' ? 'border-[#593B80] ring-2 ring-[#593B80]/25' : 'border-[#C7ACE5]'
                  }`}
                >
                  <GovernmentBuildingSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
                  <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">
                    Government Schemes
                  </p>
                  <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#442C66]">
                    <span>Explore</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('earnings', 'skills')}
                  className="group text-center rounded-[20px] bg-gradient-to-b from-[#FBD5B1] via-[#FDE1C6] to-[#FEECDB] border border-[#EEB986] shadow-xs px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] hover:brightness-[0.98] active:scale-[0.98] transition-all"
                >
                  <SkillCapSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
                  <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">
                    Skill Courses
                  </p>
                  <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#5E3A1C]">
                    <span>Join Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </p>
                </button>
              </div>

              <div className="rounded-xl bg-[#EBF3F1] border border-[#DCE8E4] px-4 py-3 text-xs text-[#064E46] font-medium">
                Care directory searches require no Passport sharing and stay private on your device.
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(
                  [
                    { id: 'all', label: 'All Support' },
                    { id: 'care', label: 'Care & Shelter' },
                    { id: 'legal', label: 'Legal Aid' },
                    { id: 'health', label: 'Healthcare' },
                    { id: 'government', label: 'SHG & Schemes' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setResourceFilter(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 min-h-[38px] ${
                      resourceFilter === cat.id
                        ? 'bg-gradient-to-b from-[#085E54] to-[#043C36] text-white shadow-xs'
                        : 'bg-white border border-[#E5E0D5] text-[#526763]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#064E46] capitalize">
                        {res.category} support · Gandhinagar
                      </p>
                      <h3 className="mt-1 text-base font-bold text-[#0F2421]">{res.name}</h3>
                      <p className="mt-1.5 text-xs text-[#526763] leading-relaxed">{res.summary}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#526763]">
                        <MapPin className="w-3.5 h-3.5 text-[#064E46] shrink-0" />
                        <span>{res.address}</span>
                      </p>
                      <p className="mt-1 text-xs text-[#526763]">{res.hours}</p>
                    </div>
                    <a
                      href={`tel:${res.phone}`}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#064E46] py-2.5 text-xs font-semibold text-white hover:bg-[#043B35] min-h-[44px]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {res.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: FOR EMPLOYERS (Screenshot 5) */}
      {mode === 'employers' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-lg font-bold text-[#0F2421]">
                Find local skills with clearer records.
              </h2>
              <p className="mt-1.5 text-sm text-[#526763] leading-relaxed">
                Post reviewed local and home-based work. Receive Passport details only when a woman consents.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPostJobModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#064E46] px-4 py-3 text-xs font-semibold text-white hover:bg-[#043B35] min-h-[44px] whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Post local opportunity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5 space-y-4">
              <h3 className="text-base font-bold text-[#0F2421]">Sample opportunities</h3>
              <div className="divide-y divide-[#E5E0D5]">
                {state.jobs.map((job) => (
                  <div key={job.id} className="py-3.5 first:pt-0 last:pb-0 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#0F2421]">
                        {job.title} · {job.subtitle}
                      </p>
                      <p className="mt-1 text-xs text-[#526763]">
                        {job.location} · {job.payLabel}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#6E807D]">
                        Posted {job.postedDate} ·{' '}
                        <span className="text-[#064E46] font-semibold">Verified</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingJob(job)}
                      className="rounded-xl border border-[#D4CFC3] bg-white px-4 py-2 text-xs font-semibold text-[#0F2421] hover:bg-[#EBF3F1] min-h-[40px] shrink-0"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="rounded-2xl bg-[#EBF3F1] border border-[#DCE8E4] p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#064E46]" />
                  <h3 className="text-base font-bold text-[#0F2421]">Consent first</h3>
                </div>
                <p className="mt-2 text-xs text-[#526763] leading-relaxed">
                  A woman chooses which Passport fields to share and the purpose.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5 space-y-3">
                {[
                  ['1', 'Post the opportunity'],
                  ['2', 'State what was checked'],
                  ['3', 'Respond to applications'],
                ].map(([num, label]) => (
                  <div
                    key={num}
                    className="flex items-center gap-3 pb-2.5 border-b border-[#E5E0D5] last:border-0 last:pb-0 text-sm text-[#0F2421]"
                  >
                    <span className="font-mono-num text-xs font-bold text-[#064E46]">{num}</span>
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onChangeMode('pilot')}
                className="w-full rounded-xl bg-[#064E46] py-3.5 text-sm font-semibold text-white hover:bg-[#043B35] min-h-[48px]"
              >
                Discuss the Gandhinagar pilot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: GANDHINAGAR PILOT (Screenshot 8) */}
      {mode === 'pilot' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5">
            <h2 className="text-lg font-bold text-[#0F2421]">
              Start with the people already doing the work.
            </h2>
            <p className="mt-2 text-sm text-[#526763] leading-relaxed">
              SHGs, NGOs, home-based businesses, domestic worker communities, training centres, and small local employers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5">
              <h3 className="text-base font-bold text-[#0F2421] mb-3">What the pilot will test</h3>
              <ol className="divide-y divide-[#E5E0D5]">
                {[
                  ['01', 'Language and low-literacy onboarding'],
                  ['02', 'Voice and form income records'],
                  ['03', 'Reviewed local and home-based work'],
                  ['04', 'The consent-led Independence Passport'],
                  ['05', 'Journey check-ins and trusted contacts'],
                  ['06', 'Healthcare, legal, and government support directory review'],
                ].map(([num, text]) => (
                  <li key={num} className="py-2.5 flex items-start gap-3 text-sm text-[#2F4541]">
                    <span className="font-mono-num text-xs font-bold text-[#064E46] mt-0.5">
                      {num}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#E1ECE9] border border-[#D2E2DE] p-4">
                  <p className="text-2xl font-extrabold text-[#064E46] tabular-nums">77/89</p>
                  <p className="mt-1 text-xs text-[#36504B] leading-snug">
                    Found SOS safety very useful
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EDF5F7] border border-[#DAE9EE] p-4">
                  <p className="text-2xl font-extrabold text-[#064E46] tabular-nums">71/89</p>
                  <p className="mt-1 text-xs text-[#36504B] leading-snug">
                    Found financial support helpful
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5">
                <h3 className="text-base font-bold text-[#0F2421] mb-3">Next steps</h3>
                <ol className="divide-y divide-[#E5E0D5]">
                  {[
                    ['01', 'Listen with women and partners'],
                    ['02', 'Test weak networks and regional languages'],
                    ['03', 'Publish what was learned and what remains uncertain'],
                  ].map(([num, text]) => (
                    <li key={num} className="py-2.5 flex items-start gap-3 text-sm text-[#2F4541]">
                      <span className="font-mono-num text-xs font-bold text-[#064E46] mt-0.5">
                        {num}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                type="button"
                onClick={() => setShowEnquiryModal(true)}
                className="w-full rounded-xl bg-[#064E46] py-3.5 text-sm font-semibold text-white hover:bg-[#043B35] min-h-[48px]"
              >
                Pilot enquiries ({state.pilotEnquiries.length} submitted)
              </button>

              <div className="rounded-xl bg-[#DDF2F6] border border-[#C6E6EC] p-3.5 text-xs text-[#2E545B]">
                Early signal; interviews with informal and self-employed women are planned.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employer Job Detail Modal */}
      {viewingJob && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E5E0D5] p-5 pb-8 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#064E46]">
                  Reviewed by {viewingJob.verifiedBy}
                </p>
                <h3 className="text-lg font-bold text-[#0F2421] mt-0.5">{viewingJob.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingJob(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
                aria-label="Close job preview"
              >
                <X className="w-5 h-5 text-[#526763]" />
              </button>
            </div>

            <p className="mt-2 text-sm text-[#526763]">{viewingJob.description}</p>
            <div className="mt-4 rounded-xl bg-[#F7F3EA] p-3.5 space-y-1.5 text-xs">
              <p>
                <strong>Employer:</strong> {viewingJob.employerName}
              </p>
              <p>
                <strong>Location:</strong> {viewingJob.location}
              </p>
              <p>
                <strong>Pay:</strong> {viewingJob.payLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setViewingJob(null);
                onNavigate('earnings', 'jobs');
              }}
              className="mt-4 w-full rounded-xl bg-[#064E46] py-3 text-sm font-semibold text-white min-h-[46px]"
            >
              Open in Jobs Near You
            </button>
          </div>
        </div>
      )}

      {/* Post New Reviewed Job Modal */}
      {showPostJobModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreateJob}
            className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E5E0D5] p-5 pb-8 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0F2421]">Post reviewed opportunity</h3>
              <button
                type="button"
                onClick={() => setShowPostJobModal(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
                aria-label="Close form"
              >
                <X className="w-5 h-5 text-[#526763]" />
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="Role (e.g. Tiffin prep or Blouse stitching)"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
            />
            <input
              type="text"
              placeholder="Schedule (e.g. Part-time · 3 days/week)"
              value={newJobSub}
              onChange={(e) => setNewJobSub(e.target.value)}
              className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Area (Gandhinagar)"
                value={newJobLoc}
                onChange={(e) => setNewJobLoc(e.target.value)}
                className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
              />
              <input
                type="text"
                required
                placeholder="Pay (e.g. Rs 300/day)"
                value={newJobPay}
                onChange={(e) => setNewJobPay(e.target.value)}
                className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Clear work description & payment terms"
              value={newJobDesc}
              onChange={(e) => setNewJobDesc(e.target.value)}
              className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#064E46] py-3 text-sm font-semibold text-white min-h-[48px]"
            >
              Publish to Jobs Near You
            </button>
          </form>
        </div>
      )}

      {/* Pilot Enquiry Modal */}
      {showEnquiryModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleEnquirySubmit}
            className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E5E0D5] p-5 pb-8 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0F2421]">Gandhinagar pilot enquiry</h3>
              <button
                type="button"
                onClick={() => setShowEnquiryModal(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
                aria-label="Close enquiry form"
              >
                <X className="w-5 h-5 text-[#526763]" />
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="Your name"
              value={enqName}
              onChange={(e) => setEnqName(e.target.value)}
              className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Organization / SHG"
                value={enqOrg}
                onChange={(e) => setEnqOrg(e.target.value)}
                className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
              />
              <select
                value={enqRole}
                onChange={(e) => setEnqRole(e.target.value as PilotEnquiry['role'])}
                className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3 py-2.5 text-sm"
              >
                <option value="NGO / SHG">NGO / SHG</option>
                <option value="Local Employer">Local Employer</option>
                <option value="Worker Community">Worker Community</option>
                <option value="Research / Civic">Research / Civic</option>
              </select>
            </div>
            <textarea
              rows={3}
              required
              placeholder="How would you like to participate in the Gandhinagar pilot?"
              value={enqMsg}
              onChange={(e) => setEnqMsg(e.target.value)}
              className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#064E46] py-3 text-sm font-semibold text-white min-h-[48px]"
            >
              Save Pilot Enquiry
            </button>

            {state.pilotEnquiries.length > 0 && (
              <div className="pt-2 border-t border-[#E5E0D5]">
                <p className="text-xs font-semibold text-[#064E46] mb-1.5">Submitted enquiries</p>
                {state.pilotEnquiries.map((q) => (
                  <div key={q.id} className="text-xs text-[#526763] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#064E46] shrink-0" />
                    <span className="truncate">
                      {q.name} ({q.role}) · {q.submittedAt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
