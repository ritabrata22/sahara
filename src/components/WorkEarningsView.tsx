import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  MapPin,
  Mic,
  Plus,
  Trash2,
} from 'lucide-react';
import { TAILORING_THUMB, WORKSHOP_THUMB } from '../data/initialData';
import { Translations } from '../i18n/translations';
import { EarningsSubTab, IncomeEntry, JobOpportunity, SaharaState } from '../types';
import { VoiceMicSymbol } from './ProminentIcons';
import { WeeklyBarChart } from './WeeklyBarChart';

interface WorkEarningsViewProps {
  state: SaharaState;
  t: Translations;
  activeSubTab: EarningsSubTab;
  weeklyIncome: number;
  onChangeSubTab: (tab: EarningsSubTab) => void;
  onApplyJob: (job: JobOpportunity) => void;
  onOpenVoice: () => void;
  onDeleteEntry: (id: string) => void;
  onAdvanceCourse: (courseId: string) => void;
  onOpenEmployers: () => void;
}

export const WorkEarningsView: React.FC<WorkEarningsViewProps> = ({
  state,
  t,
  activeSubTab,
  weeklyIncome,
  onChangeSubTab,
  onApplyJob,
  onOpenVoice,
  onDeleteEntry,
  onAdvanceCourse,
  onOpenEmployers,
}) => {
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'income' | 'expense'>('all');

  const locations = ['All', 'Sector 12', 'Randesan', 'Kudasan', 'Gandhinagar'];
  const filteredJobs = state.jobs.filter((job) =>
    locationFilter === 'All'
      ? true
      : job.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const filteredLedger = state.ledger.filter((entry) =>
    ledgerFilter === 'all' ? true : entry.type === ledgerFilter
  );

  const totalExpenses = state.ledger
    .filter((e) => e.type === 'expense')
    .reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-[#064E46]">{t.welcomeBack}</p>
        <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2421]">
          {t.workAndEarnings}
        </h1>
      </div>

      {/* Segmented Control */}
      <div
        role="tablist"
        aria-label="Work and Earnings sections"
        className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#E4F0ED] border border-[#D4E6E1]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === 'jobs'}
          onClick={() => onChangeSubTab('jobs')}
          className={`rounded-lg py-2.5 px-2 text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap truncate ${
            activeSubTab === 'jobs'
              ? 'bg-white text-[#0F2421] shadow-xs'
              : 'text-[#4B6B65] hover:text-[#0F2421]'
          }`}
        >
          {t.jobsNearYou}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === 'ledger'}
          onClick={() => onChangeSubTab('ledger')}
          className={`rounded-lg py-2.5 px-2 text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap truncate ${
            activeSubTab === 'ledger'
              ? 'bg-white text-[#0F2421] shadow-xs'
              : 'text-[#4B6B65] hover:text-[#0F2421]'
          }`}
        >
          {t.myEarnings}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === 'skills'}
          onClick={() => onChangeSubTab('skills')}
          className={`rounded-lg py-2.5 px-2 text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap truncate ${
            activeSubTab === 'skills'
              ? 'bg-white text-[#0F2421] shadow-xs'
              : 'text-[#4B6B65] hover:text-[#0F2421]'
          }`}
        >
          {t.skillCourses}
        </button>
      </div>

      {/* TAB 1: JOBS NEAR YOU */}
      {activeSubTab === 'jobs' && (
        <div className="space-y-4">
          {/* Location filter row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocationFilter(loc)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[38px] ${
                  locationFilter === loc
                    ? 'bg-[#064E46] text-white'
                    : 'bg-white border border-[#E5E0D5] text-[#526763] hover:bg-[#F7F3EA]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-4 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {job.imageUrl ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#DCE8E4] shrink-0">
                      <img
                        src={job.imageUrl}
                        alt={job.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-[#C8F3DC] flex items-center justify-center text-[#064E46] shrink-0">
                      <Briefcase className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#064E46]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.verified ? t.verified : 'Reviewed'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#526763] font-normal truncate">{job.postedDate}</span>
                    </div>
                    <h2 className="mt-1 text-base font-bold text-[#0F2421]">{job.title}</h2>
                    <p className="text-xs text-[#526763]">{job.subtitle}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#526763]">
                      <MapPin className="w-3.5 h-3.5 text-[#064E46] shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-[#0F2421] tabular-nums">
                      {job.payLabel}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#526763] leading-relaxed">{job.description}</p>

                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-xs transition-all min-h-[48px] ${
                    job.applied
                      ? 'bg-gradient-to-b from-[#BCE9D8] to-[#D8F3E8] border border-[#96D5BE] text-[#064E46]'
                      : 'bg-gradient-to-b from-[#085E54] to-[#043C36] text-white hover:brightness-105'
                  }`}
                >
                  <span>{job.applied ? `${t.applied} · Update shared fields` : t.applyNow}</span>
                  {!job.applied && <ArrowRight className="w-4 h-4" />}
                </button>
              </article>
            ))}
          </div>

          {/* Weekly Income + Voice Prompt + Employer View link */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChangeSubTab('ledger')}
              className="w-full text-left rounded-[20px] bg-gradient-to-b from-[#CEE9E2] to-[#E2F3EE] border border-[#A9D5CA] shadow-xs p-5 flex items-center justify-between gap-4 hover:brightness-[0.98] transition-all"
            >
              <div>
                <p className="text-xs font-bold text-[#064E46]">{t.yourWeeklyIncome}</p>
                <p className="mt-1 text-2xl font-extrabold text-[#0F2421] tabular-nums">
                  Rs {weeklyIncome.toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-xs font-bold text-[#064E46] tabular-nums">↑ 12%</p>
              </div>
              <WeeklyBarChart entries={state.ledger} compact />
            </button>

            <button
              type="button"
              onClick={onOpenVoice}
              className="w-full text-left rounded-[20px] bg-gradient-to-b from-[#FACCC4] to-[#FDE4DF] border border-[#EEB0A6] shadow-xs p-5 flex items-center gap-4 hover:brightness-[0.98] transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/85 border border-[#F0BFB7] flex items-center justify-center shrink-0 shadow-xs">
                <VoiceMicSymbol className="w-9 h-9" />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-[#0F2421]">{t.speakToAddIncome}</p>
                <p className="text-xs font-medium text-[#6F2D23] mt-0.5">
                  Aaj maine silai se 500 rupaye kamaye.
                </p>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenEmployers}
            className="w-full rounded-xl border border-[#D4CFC3] bg-white py-3 text-sm font-semibold text-[#0F2421] hover:bg-[#F7F3EA] transition-colors min-h-[46px]"
          >
            {t.viewAllOpportunities} &amp; Employer portal
          </button>
        </div>
      )}

      {/* TAB 2: MY EARNINGS LEDGER */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl bg-[#EBF3F1] border border-[#DCE8E4] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#064E46]">{t.yourWeeklyIncome}</p>
                  <p className="mt-1 text-3xl font-extrabold text-[#0F2421] tabular-nums">
                    Rs {weeklyIncome.toLocaleString('en-IN')}
                  </p>
                  <p className="mt-1 text-xs text-[#526763] tabular-nums">
                    Expenses logged: Rs {totalExpenses.toLocaleString('en-IN')} · Net: Rs{' '}
                    {(weeklyIncome - totalExpenses).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenVoice}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#064E46] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#043B35] min-h-[44px]"
                >
                  <Mic className="w-4 h-4" />
                  <span>{t.speakToAddIncome}</span>
                </button>
              </div>
              <WeeklyBarChart entries={state.ledger} />
            </div>

            <div className="rounded-2xl bg-[#FCEBE6] border border-[#F3D8D0] p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#C8553D]">Voice-first bookkeeping</p>
                <h2 className="mt-1 text-base font-bold text-[#0F2421]">
                  Record daily piecework or costs in Hindi, Gujarati, or English
                </h2>
                <p className="mt-2 text-xs text-[#6B4A44] leading-relaxed">
                  Your entries are stored on this device and count toward your Independence Passport income history only when you choose to share them.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenVoice}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E7C2B7] py-3 text-sm font-semibold text-[#C8553D] hover:bg-[#FFF9F7] min-h-[46px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add voice or manual entry</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#0F2421]">
              Recent records ({filteredLedger.length})
            </h3>
            <div className="inline-flex rounded-lg bg-[#EBF3F1] p-0.5">
              {(['all', 'income', 'expense'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLedgerFilter(f)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize ${
                    ledgerFilter === f ? 'bg-white text-[#064E46] shadow-xs' : 'text-[#526763]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredLedger.map((entry: IncomeEntry) => (
              <div
                key={entry.id}
                className="rounded-2xl bg-white border border-[#E5E0D5] p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#526763]">
                    <span className="font-semibold text-[#064E46]">{entry.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.dayLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.source === 'voice' ? 'Voice recorded' : 'Manual'}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#0F2421] truncate">
                    {entry.description}
                  </p>
                  {entry.transcript && (
                    <p className="mt-0.5 text-xs text-[#526763] italic truncate">
                      “{entry.transcript}”
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-sm font-extrabold tabular-nums ${
                      entry.type === 'expense' ? 'text-[#C8553D]' : 'text-[#064E46]'
                    }`}
                  >
                    {entry.type === 'expense' ? '-' : '+'}Rs {entry.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[#738582] hover:text-[#C8553D] hover:bg-[#FCEBE6]"
                    aria-label={`Delete ${entry.description}`}
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SKILL COURSES */}
      {activeSubTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.courses.map((course) => {
            const pct = Math.round((course.completedModules / course.modules.length) * 100);
            return (
              <div
                key={course.id}
                className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#DCE8E4] shrink-0">
                      <img
                        src={course.imageUrl || (course.id === 'course-1' ? TAILORING_THUMB : WORKSHOP_THUMB)}
                        alt={course.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#064E46]">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>{course.certified ? 'Skill record added' : `${pct}% complete`}</span>
                      </div>
                      <h2 className="mt-1 text-base font-bold text-[#0F2421]">{course.title}</h2>
                      <p className="text-xs text-[#526763] mt-0.5">
                        {course.provider} · {course.duration}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 w-full h-2 rounded-full bg-[#E3DDD0] overflow-hidden">
                    <div
                      className="h-full bg-[#064E46] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {course.modules.map((mod, idx) => {
                      const done = idx < course.completedModules;
                      return (
                        <li
                          key={mod}
                          className={`flex items-center gap-2 text-xs ${
                            done ? 'text-[#0F2421] font-medium' : 'text-[#526763]'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              done ? 'text-[#064E46]' : 'text-[#BCC7C4]'
                            }`}
                          />
                          <span>{mod}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {!course.certified ? (
                  <button
                    type="button"
                    onClick={() => onAdvanceCourse(course.id)}
                    className="mt-4 w-full rounded-xl bg-[#064E46] py-2.5 text-xs font-semibold text-white hover:bg-[#043B35] min-h-[44px]"
                  >
                    Complete next module ({course.completedModules + 1}/{course.modules.length})
                  </button>
                ) : (
                  <div className="mt-4 rounded-xl bg-[#C8F3DC] py-2.5 px-3 text-center text-xs font-semibold text-[#064E46]">
                    Recorded in Independence Passport
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
