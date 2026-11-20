import React from 'react';
import {
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { TAILORING_THUMB } from '../data/initialData';
import { Translations } from '../i18n/translations';
import { JobOpportunity, SaharaState, TabId } from '../types';
import {
  ClinicHospitalSymbol,
  EarningsWalletSymbol,
  TravelShieldSymbol,
  VoiceMicSymbol,
  WorkBriefcaseSymbol,
} from './ProminentIcons';
import { TrustRing } from './TrustRing';
import { WeeklyBarChart } from './WeeklyBarChart';

interface HomeViewProps {
  state: SaharaState;
  t: Translations;
  weeklyIncome: number;
  trustScore: number;
  onNavigate: (tab: TabId, subOption?: string) => void;
  onOpenVoice: () => void;
  onApplyJob: (job: JobOpportunity) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  state,
  t,
  weeklyIncome,
  trustScore,
  onNavigate,
  onOpenVoice,
  onApplyJob,
}) => {
  const featuredJob = state.jobs[0];

  return (
    <div className="space-y-5">
      {/* Greeting Header */}
      <section className="pt-1">
        <p className="text-xs font-semibold text-[#064E46]">{t.welcomeBack}</p>
        <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2421] text-balance">
          {t.namasteAsha}
        </h1>
        <p className="mt-3 text-xs font-semibold text-[#064E46]">{t.doingGreat}</p>
        <h2 className="mt-0.5 text-lg font-bold text-[#0F2421]">{t.dayAtGlance}</h2>
      </section>

      {/* 2x2 Quick Action Grid */}
      <section aria-label="Quick actions" className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => onNavigate('earnings', 'jobs')}
          className="group text-center rounded-[20px] bg-gradient-to-b from-[#BCE9D8] via-[#CCEFE1] to-[#DFF6EC] border border-[#96D5BE] shadow-xs px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] hover:brightness-[0.98] active:scale-[0.98] transition-all"
        >
          <WorkBriefcaseSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
          <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">{t.findWork}</p>
          <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#184B43]">
            <span>{t.findWorkSub}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('earnings', 'ledger')}
          className="group text-center rounded-[20px] bg-gradient-to-b from-[#FBD5B1] via-[#FDE1C6] to-[#FEECDB] border border-[#EEB986] shadow-xs px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] hover:brightness-[0.98] active:scale-[0.98] transition-all"
        >
          <EarningsWalletSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
          <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">{t.myEarnings}</p>
          <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#5E3A1C]">
            <span>{t.myEarningsSub}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('safety')}
          className="group text-center rounded-[20px] bg-gradient-to-b from-[#DFCDF3] via-[#E9DBF7] to-[#F2EAFA] border border-[#C7ACE5] shadow-xs px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] hover:brightness-[0.98] active:scale-[0.98] transition-all"
        >
          <TravelShieldSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
          <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">{t.travelSafe}</p>
          <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#442C66]">
            <span>{t.travelSafeSub}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('support', 'support-areas')}
          className="group text-center rounded-[20px] bg-gradient-to-b from-[#FACCC4] via-[#FBD9D3] to-[#FDE7E3] border border-[#EEB0A6] shadow-xs px-3.5 py-5 flex flex-col items-center justify-center min-h-[146px] hover:brightness-[0.98] active:scale-[0.98] transition-all"
        >
          <ClinicHospitalSymbol className="w-12 h-12 mb-2.5 drop-shadow-xs group-hover:scale-105 transition-transform" />
          <p className="text-[15px] font-extrabold text-[#0F2421] leading-tight">{t.getSupport}</p>
          <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#6F2D23]">
            <span>{t.getSupportSub}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>
      </section>

      {/* Main 2-column responsive layout on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trust Profile Card */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="w-full text-left rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5 hover:border-[#064E46]/30 transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#0F2421]">{t.yourTrustProfile}</h3>
              <p className="text-xs text-[#526763] mt-0.5">{t.sampleProfile}</p>
            </div>
            <TrustRing percent={trustScore} size={74} strokeWidth={8} />
          </div>

          <ul className="mt-4 space-y-2 text-sm text-[#2F4541]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#064E46] shrink-0" />
              <span>{t.incomeHistory}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#064E46] shrink-0" />
              <span>{t.communityTrust}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#064E46] shrink-0" />
              <span>{t.verifiedIdentity}</span>
            </li>
          </ul>
        </button>

        {/* Featured Verified Opportunity */}
        {featuredJob && (
          <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-5 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#DCE8E4] shrink-0 flex items-center justify-center">
                <img
                  src={featuredJob.imageUrl || TAILORING_THUMB}
                  alt={featuredJob.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#064E46]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.verified}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate text-[#526763] font-normal">{featuredJob.location}</span>
                </div>
                <h3 className="mt-1 text-base font-bold text-[#0F2421] truncate">
                  {featuredJob.title}
                </h3>
                <p className="text-xs text-[#526763] mt-0.5">{featuredJob.subtitle}</p>
                <p className="mt-2 text-sm font-bold text-[#0F2421] tabular-nums">
                  {featuredJob.payLabel}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-[#E5E0D5]">
              <button
                type="button"
                onClick={() => onNavigate('earnings', 'jobs')}
                className="text-xs font-semibold text-[#064E46] hover:underline min-h-[40px] px-1"
              >
                {t.viewAllOpportunities}
              </button>
              <button
                type="button"
                onClick={() => onApplyJob(featuredJob)}
                className={`rounded-xl px-5 py-2.5 text-xs font-semibold min-h-[44px] transition-colors whitespace-nowrap shrink-0 ${
                  featuredJob.applied
                    ? 'bg-[#C8F3DC] text-[#064E46]'
                    : 'bg-white border border-[#D4CFC3] text-[#0F2421] hover:bg-[#EBF3F1]'
                }`}
              >
                {featuredJob.applied ? t.applied : t.apply}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Weekly Income + Voice Income CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('earnings', 'ledger')}
          className="w-full text-left rounded-[20px] bg-gradient-to-b from-[#CEE9E2] to-[#E2F3EE] border border-[#A9D5CA] shadow-xs p-5 flex items-center justify-between gap-4 hover:brightness-[0.98] transition-all"
        >
          <div>
            <p className="text-xs font-bold text-[#064E46]">{t.yourWeeklyIncome}</p>
            <p className="mt-1 text-2xl font-extrabold text-[#0F2421] tabular-nums">
              Rs {weeklyIncome.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs font-bold text-[#064E46] tabular-nums">
              ↑ 12% vs last week
            </p>
          </div>
          <WeeklyBarChart entries={state.ledger} compact />
        </button>

        <button
          type="button"
          onClick={onOpenVoice}
          className="w-full text-left rounded-[20px] bg-gradient-to-b from-[#FACCC4] to-[#FDE4DF] border border-[#EEB0A6] shadow-xs p-5 flex items-center justify-between gap-4 hover:brightness-[0.98] active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/85 border border-[#F0BFB7] flex items-center justify-center shrink-0 shadow-xs">
              <VoiceMicSymbol className="w-9 h-9" />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-[#0F2421]">{t.speakToAddIncome}</p>
              <p className="text-xs font-semibold text-[#6F2D23] mt-0.5">{t.inYourLanguage}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9A3120] shrink-0" />
        </button>
      </div>
    </div>
  );
};
