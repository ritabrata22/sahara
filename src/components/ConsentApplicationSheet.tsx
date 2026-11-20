import React, { useState } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';
import { JobOpportunity, PassportFieldKey } from '../types';

interface ConsentApplicationSheetProps {
  job: JobOpportunity | null;
  onClose: () => void;
  onConfirmApply: (jobId: string, selectedFields: PassportFieldKey[]) => void;
}

const FIELD_OPTIONS: { key: PassportFieldKey; label: string; detail: string }[] = [
  {
    key: 'workHistory',
    label: 'Selected work history',
    detail: '2 home-based tailoring & uniform alteration records',
  },
  {
    key: 'skillRecords',
    label: 'Skill records',
    detail: 'Completed blouse pattern & bookkeeping certificates',
  },
  {
    key: 'references',
    label: 'Community references',
    detail: 'SHG group leader & boutique partner confirmations',
  },
  {
    key: 'identityStatus',
    label: 'Identity verification status',
    detail: 'Partner-confirmed status only (no ID numbers shared)',
  },
  {
    key: 'incomeSummary',
    label: 'Monthly income summary',
    detail: 'Only share if needed — optional for work applications',
  },
];

export const ConsentApplicationSheet: React.FC<ConsentApplicationSheetProps> = ({
  job,
  onClose,
  onConfirmApply,
}) => {
  const [selected, setSelected] = useState<PassportFieldKey[]>(['workHistory', 'skillRecords']);

  if (!job) return null;

  const toggleField = (field: PassportFieldKey) => {
    setSelected((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Consent-led job application"
    >
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E5E0D5] shadow-2xl max-h-[90dvh] overflow-y-auto p-5 pb-8">
        <div className="w-10 h-1.5 bg-[#D4CFC3] rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3F1] flex items-center justify-center text-[#064E46]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#064E46]">Consent in practice</p>
              <h2 className="text-lg font-bold text-[#0F2421]">{job.title}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
            aria-label="Close application sheet"
          >
            <X className="w-5 h-5 text-[#526763]" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-[#E5E0D5] p-4">
          <p className="text-sm font-medium text-[#0F2421] leading-relaxed">
            Share selected Passport fields with <strong>{job.employerName}</strong> ({job.location}) for this opportunity?
          </p>
          <p className="mt-1.5 text-xs text-[#526763]">
            {job.payLabel} · Reviewed by {job.verifiedBy}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-[#526763]">
            Choose exact fields to share ({selected.length} selected)
          </p>
          {FIELD_OPTIONS.map((field) => {
            const active = selected.includes(field.key);
            return (
              <button
                key={field.key}
                type="button"
                onClick={() => toggleField(field.key)}
                className={`w-full text-left flex items-start gap-3 rounded-2xl border p-3.5 transition-colors min-h-[56px] ${
                  active
                    ? 'bg-[#EBF3F1] border-[#064E46]'
                    : 'bg-white border-[#E5E0D5] hover:bg-[#F7F3EA]'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                    active
                      ? 'bg-[#064E46] border-[#064E46] text-white'
                      : 'bg-white border-[#B9C4C1]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0F2421]">{field.label}</p>
                  <p className="text-xs text-[#526763] mt-0.5">{field.detail}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-[#526763]">
          You can revoke this sharing permission anytime from Privacy & consent.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#D4CFC3] bg-white py-3 text-sm font-semibold text-[#0F2421] hover:bg-[#F7F3EA] min-h-[48px]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => onConfirmApply(job.id, selected)}
            className="rounded-xl bg-[#064E46] py-3 text-sm font-semibold text-white hover:bg-[#043B35] disabled:opacity-40 min-h-[48px]"
          >
            Confirm & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
