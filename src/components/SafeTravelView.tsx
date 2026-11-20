import React, { useState } from 'react';
import {
  Bus,
  Check,
  CheckCircle2,
  Copy,
  LocateFixed,
  MapPin,
  Phone,
  Share2,
  ShieldAlert,
  X,
} from 'lucide-react';
import { HELP_POINTS } from '../data/initialData';
import { Translations } from '../i18n/translations';
import { HelpPoint, SaharaState } from '../types';

interface SafeTravelViewProps {
  state: SaharaState;
  t: Translations;
  onCheckIn: (coordsText: string | null) => void;
  onToggleContact: (contactId: string) => void;
  onSetTripSharing: (active: boolean, destination: string) => void;
}

export const SafeTravelView: React.FC<SafeTravelViewProps> = ({
  state,
  t,
  onCheckIn,
  onToggleContact,
  onSetTripSharing,
}) => {
  const [selectedHelpPoint, setSelectedHelpPoint] = useState<HelpPoint>(HELP_POINTS[0]);
  const [busEtaMins, setBusEtaMins] = useState(2);
  const [busUpdatedAt, setBusUpdatedAt] = useState('9:43 AM');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showSOSSheet, setShowSOSSheet] = useState(false);
  const [destinationInput, setDestinationInput] = useState(state.tripDestination);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const selectedContacts = state.trustedContacts.filter((c) => c.selectedForTrip);

  const handleLiveGPS = () => {
    navigator.vibrate?.(10);
    if (!navigator.geolocation) {
      setGpsStatus('Using Gandhinagar Sector 12 saved location.');
      return;
    }
    setGpsStatus('Reading device GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`;
        setGpsStatus(`Live GPS locked: ${coords}`);
        onCheckIn(coords);
      },
      () => {
        setGpsStatus('Location permission skipped · Using Sector 12, Gandhinagar.');
        onCheckIn('23.2156° N, 72.6369° E (Sector 12, Gandhinagar)');
      },
      { timeout: 6000 }
    );
  };

  const handleRefreshBus = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setBusEtaMins((prev) => (prev <= 1 ? 4 : prev - 1));
    setBusUpdatedAt(formatted);
  };

  const handleCopySOSMessage = async () => {
    const msg = `SAHARA Check-in Alert from ${state.userName}: I need assistance near ${
      state.lastCheckInCoords || 'Sector 12, Gandhinagar'
    }. Please call me.`;
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    } catch {
      setCopiedMsg(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-[#064E46]">{t.welcomeBack}</p>
        <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2421]">
          {t.safeTravel}
        </h1>
      </div>

      {/* Status Check-In Banner */}
      <div className="rounded-2xl bg-[#EBF3F1] border border-[#DCE8E4] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#064E46] flex items-center justify-center text-white shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#064E46]">{t.youAreSafe}</p>
            <p className="text-xs text-[#526763]">
              {t.checkedInAt} {state.lastCheckInTime}
              {state.tripSharingActive && (
                <> · Sharing trip with {selectedContacts.length} contacts</>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.vibrate?.(12);
            onCheckIn(state.lastCheckInCoords);
          }}
          className="rounded-xl bg-gradient-to-b from-[#085E54] to-[#043C36] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:brightness-105 min-h-[40px]"
        >
          {t.checkInNow}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Interactive Gandhinagar Safety Map */}
        <div className="lg:col-span-3 rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] overflow-hidden">
          <div className="relative w-full h-72 sm:h-80 bg-[#E9ECE9]">
            <svg
              viewBox="0 0 400 260"
              className="w-full h-full"
              role="img"
              aria-label="Interactive Gandhinagar safety route map"
            >
              {/* City blocks & parks */}
              <rect width="400" height="260" fill="#EAECE9" />
              <path
                d="M155 260 C165 200 185 150 220 110 C255 70 280 40 315 0 L355 0 C320 48 292 82 260 122 C226 164 204 205 196 260 Z"
                fill="#88B5D3"
                opacity="0.7"
              />
              <path
                d="M115 245 C120 180 142 135 182 95 C208 68 232 40 250 10 L285 20 C260 65 232 95 205 128 C172 165 154 202 146 250 Z"
                fill="#A8CCA3"
                opacity="0.75"
              />
              {/* Arterial roads */}
              <path d="M0 78 L400 42" stroke="#E07A5F" strokeWidth="3.5" opacity="0.7" />
              <path d="M40 260 L195 0" stroke="#FFFFFF" strokeWidth="5" />
              <path d="M0 175 L400 165" stroke="#FFFFFF" strokeWidth="4" />
              <path d="M290 0 L330 260" stroke="#FFFFFF" strokeWidth="4" />
              {/* Sector Grid Labels */}
              <text x="64" y="54" fontSize="10" fill="#526763" fontWeight="600">
                SECTOR 11
              </text>
              <text x="275" y="108" fontSize="10" fill="#526763" fontWeight="600">
                SECTOR 12
              </text>
              <text x="58" y="212" fontSize="10" fill="#526763" fontWeight="600">
                RANDESAN
              </text>

              {/* Safe Route Polyline */}
              <polyline
                points="144,172 192,150 244,125 296,68"
                fill="none"
                stroke="#064E46"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="144,172 192,150 244,125 296,68"
                fill="none"
                stroke="#C8F3DC"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />

              {/* Your Location Marker */}
              <circle cx="144" cy="172" r="14" fill="#064E46" opacity="0.18" />
              <circle cx="144" cy="172" r="7" fill="#064E46" stroke="#FFFFFF" strokeWidth="2.5" />

              {/* Clickable Help Points */}
              {HELP_POINTS.map((hp) => {
                const cx = (hp.x / 100) * 400;
                const cy = (hp.y / 100) * 260;
                const isSelected = selectedHelpPoint.id === hp.id;
                return (
                  <g
                    key={hp.id}
                    onClick={() => setSelectedHelpPoint(hp)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="18" fill="#C8553D" opacity="0.22" />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill="#D96B52"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Legend Overlay matching Screenshot 4 */}
            <div className="absolute bottom-3 left-3 rounded-xl bg-[#FCF9F2]/95 backdrop-blur-xs border border-[#E5E0D5] px-3 py-2.5 shadow-sm space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#0F2421]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#064E46] inline-block" />
                <span>Your location</span>
              </div>
              <div className="flex items-center gap-2 text-[#0F2421]">
                <span className="w-3 h-0.5 bg-[#064E46] inline-block" />
                <span>Safe route</span>
              </div>
              <div className="flex items-center gap-2 text-[#0F2421]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D96B52] inline-block" />
                <span>Help point</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLiveGPS}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-white/95 border border-[#E5E0D5] px-3 py-2 text-xs font-semibold text-[#064E46] shadow-xs hover:bg-[#EBF3F1] min-h-[40px]"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>Use Live GPS</span>
            </button>
          </div>

          {/* Selected Help Point Details */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[#FCF9F2] border-t border-[#E5E0D5]">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#C8553D]">
                Selected help point · {selectedHelpPoint.distance}
              </p>
              <p className="text-sm font-bold text-[#0F2421] truncate">{selectedHelpPoint.name}</p>
              <p className="text-xs text-[#526763] truncate">
                {selectedHelpPoint.address} · {selectedHelpPoint.hours}
              </p>
              {gpsStatus && <p className="mt-1 text-xs text-[#064E46] font-medium">{gpsStatus}</p>}
            </div>
            <a
              href={`tel:${selectedHelpPoint.phone}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E46] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#043B35] min-h-[40px] shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {selectedHelpPoint.phone}</span>
            </a>
          </div>
        </div>

        {/* Right / Bottom Travel Controls */}
        <div className="lg:col-span-2 space-y-3">
          {/* Women-only Bus Card */}
          <div className="rounded-2xl bg-[#F7F3EA] border border-[#EAE3D4] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#064E46]" />
                  <h2 className="text-sm font-bold text-[#0F2421]">{t.womenOnlyBus}</h2>
                </div>
                <p className="mt-1 text-base font-extrabold text-[#064E46] tabular-nums">
                  {busEtaMins} min away
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefreshBus}
                className="rounded-xl border border-[#D4CFC3] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F2421] hover:bg-[#EBF3F1] min-h-[36px]"
              >
                Refresh ETA
              </button>
            </div>
            <p className="mt-2 text-xs text-[#526763]">
              Route: Sector 12 → Civil Hospital → Randesan
            </p>
            <div className="mt-2 pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-xs text-[#526763]">
              <span>Information only</span>
              <span>Last updated {busUpdatedAt}</span>
            </div>
          </div>

          {/* Share Trip Button */}
          <button
            type="button"
            onClick={() => setShowShareSheet(true)}
            className={`w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-bold shadow-xs transition-all min-h-[52px] ${
              state.tripSharingActive
                ? 'bg-gradient-to-b from-[#085E54] to-[#043C36] text-white'
                : 'bg-gradient-to-b from-[#BCE9D8] to-[#D8F3E8] border border-[#96D5BE] text-[#0F2421] hover:brightness-[0.98]'
            }`}
          >
            <Share2 className="w-5 h-5" />
            <span>{state.tripSharingActive ? t.stopSharingTrip : t.shareTrip}</span>
          </button>

          {/* SOS Button */}
          <button
            type="button"
            onClick={() => {
              navigator.vibrate?.([100, 50, 100]);
              setShowSOSSheet(true);
            }}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-[#F8BFB5] via-[#FAD0C9] to-[#FCE1DC] border border-[#E79587] shadow-xs py-3.5 text-base font-extrabold text-[#9A2614] hover:brightness-[0.98] active:scale-[0.99] transition-all min-h-[54px]"
          >
            <ShieldAlert className="w-6 h-6 text-[#B92E18]" />
            <span>{t.sos}</span>
          </button>

          <p className="text-center text-xs font-medium text-[#526763]">{t.tapForHelp}</p>
          <p className="text-center text-[11px] text-[#6E807D] leading-relaxed px-2">
            {t.safetyDisclaimer}
          </p>
        </div>
      </div>

      {/* Share Trip Drawer */}
      {showShareSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Share Trip with trusted contacts"
        >
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E5E0D5] p-5 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-[#064E46]">Journey check-in</p>
                <h3 className="text-lg font-bold text-[#0F2421]">Share Trip</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareSheet(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
                aria-label="Close trip sharing"
              >
                <X className="w-5 h-5 text-[#526763]" />
              </button>
            </div>

            <label className="block text-xs font-medium text-[#526763] mb-1">
              Journey route or destination
            </label>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              className="w-full rounded-xl border border-[#D4CFC3] bg-white px-3.5 py-2.5 text-sm text-[#0F2421]"
            />

            <p className="mt-4 mb-2 text-xs font-semibold text-[#526763]">
              Choose trusted contacts
            </p>
            <div className="space-y-2">
              {state.trustedContacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => onToggleContact(contact.id)}
                  className={`w-full text-left flex items-center justify-between rounded-xl border p-3 ${
                    contact.selectedForTrip
                      ? 'bg-[#EBF3F1] border-[#064E46]'
                      : 'bg-white border-[#E5E0D5]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0F2421]">{contact.name}</p>
                    <p className="text-xs text-[#526763]">
                      {contact.role} · {contact.phone}
                    </p>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      contact.selectedForTrip ? 'text-[#064E46]' : 'text-[#C8D1CE]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {state.tripSharingActive ? (
                <button
                  type="button"
                  onClick={() => {
                    onSetTripSharing(false, destinationInput);
                    setShowShareSheet(false);
                  }}
                  className="col-span-2 rounded-xl bg-[#C8553D] py-3 text-sm font-semibold text-white min-h-[48px]"
                >
                  Stop Sharing Location
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowShareSheet(false)}
                    className="rounded-xl border border-[#D4CFC3] bg-white py-3 text-sm font-semibold text-[#0F2421] min-h-[48px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={selectedContacts.length === 0}
                    onClick={() => {
                      onSetTripSharing(true, destinationInput);
                      setShowShareSheet(false);
                    }}
                    className="rounded-xl bg-[#064E46] py-3 text-sm font-semibold text-white disabled:opacity-40 min-h-[48px]"
                  >
                    Start Sharing
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SOS Immediate Help Sheet */}
      {showSOSSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="SOS Emergency Help"
        >
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E7B5A7] p-5 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#C8553D]">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-lg font-extrabold text-[#0F2421]">Immediate Help</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSOSSheet(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
                aria-label="Close SOS panel"
              >
                <X className="w-5 h-5 text-[#526763]" />
              </button>
            </div>

            <p className="text-xs text-[#526763] leading-relaxed">
              Call an official helpline directly or copy your current location to send to your trusted contacts.
            </p>

            <div className="mt-4 space-y-2.5">
              <a
                href="tel:181"
                className="w-full flex items-center justify-between rounded-xl bg-[#C8553D] px-4 py-3.5 text-white font-semibold text-sm min-h-[52px]"
              >
                <span>181 Abhayam Women Helpline</span>
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="tel:112"
                className="w-full flex items-center justify-between rounded-xl bg-white border border-[#D4CFC3] px-4 py-3 text-[#0F2421] font-semibold text-sm min-h-[48px]"
              >
                <span>112 Emergency Police</span>
                <Phone className="w-4 h-4 text-[#064E46]" />
              </a>
              <a
                href="tel:108"
                className="w-full flex items-center justify-between rounded-xl bg-white border border-[#D4CFC3] px-4 py-3 text-[#0F2421] font-semibold text-sm min-h-[48px]"
              >
                <span>108 Ambulance &amp; Medical</span>
                <Phone className="w-4 h-4 text-[#064E46]" />
              </a>
            </div>

            <div className="mt-4 rounded-xl bg-[#F7F3EA] border border-[#EAE3D4] p-3.5">
              <p className="text-xs font-semibold text-[#0F2421]">Location details</p>
              <p className="mt-0.5 text-xs text-[#526763]">
                {state.lastCheckInCoords || 'Sector 12, Gandhinagar'}
              </p>
              <button
                type="button"
                onClick={handleCopySOSMessage}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4CFC3] px-3 py-2 text-xs font-semibold text-[#064E46] min-h-[38px]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedMsg ? 'Alert SMS text copied' : 'Copy SMS alert with location'}</span>
              </button>
            </div>

            <p className="mt-3 text-[11px] text-[#6E807D] leading-relaxed">
              {t.safetyDisclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
