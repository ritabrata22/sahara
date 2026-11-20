import React, { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Mic, Square, Volume2, X } from 'lucide-react';
import { IncomeEntry, Language } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface VoiceIncomeSheetProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSaveEntry: (entry: Omit<IncomeEntry, 'id'>) => void;
}

const SAMPLE_PHRASES: Record<Language, string[]> = {
  en: [
    'Today I earned 500 rupees from blouse stitching',
    'Earned 350 rupees from domestic work in Sector 12',
    'Spent 120 rupees on cotton thread and lining cloth',
  ],
  hi: [
    'Aaj maine silai se 500 rupaye kamaye',
    'आज मैंने ब्लाउज सिलाई से 700 रुपये कमाए',
    'धागे और अस्तर के लिए 150 रुपये खर्च किए',
  ],
  gu: [
    'આજે મેં સિલાઈથી 500 રૂપિયા કમાયા',
    'સેક્ટર 12 માં ઘરકામથી 400 રૂપિયા મળ્યા',
    'દોરા અને અસ્તર માટે 120 રૂપિયા ખર્ચ્યા',
  ],
};

function offlineParseFallback(text: string): {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
} {
  const numMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  const amount = numMatch ? Math.round(parseFloat(numMatch[1].replace(',', ''))) : 0;
  const lower = text.toLowerCase();
  const isExpense =
    lower.includes('spent') ||
    lower.includes('kharch') ||
    lower.includes('खर्च') ||
    lower.includes('ખર્ચ') ||
    lower.includes('bought') ||
    lower.includes('thread');
  const category =
    lower.includes('domestic') || lower.includes('ghar') || lower.includes('ઘરકામ')
      ? 'Domestic Work'
      : isExpense
      ? 'Materials & Supplies'
      : 'Tailoring';
  return {
    amount,
    type: isExpense ? 'expense' : 'income',
    category,
    description: text.slice(0, 64),
  };
}

export const VoiceIncomeSheet: React.FC<VoiceIncomeSheetProps> = ({
  isOpen,
  language,
  onClose,
  onSaveEntry,
}) => {
  const isOnline = useOnlineStatus();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editable confirmation fields
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('Tailoring');
  const [description, setDescription] = useState('');
  const [hasParsed, setHasParsed] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecordingCleanup();
    }
  }, [isOpen]);

  const stopRecordingCleanup = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      const rec = recognitionRef.current as { stop?: () => void } | null;
      rec?.stop?.();
    } catch {
      // ignore cleanup errors
    }
    setIsRecording(false);
  };

  if (!isOpen) return null;

  const parseWithServer = async (payload: { transcript?: string; audioBase64?: string; mimeType?: string }) => {
    setErrorMsg(null);
    setIsProcessing(true);

    if (!isOnline && payload.transcript) {
      const local = offlineParseFallback(payload.transcript);
      setAmount(local.amount ? String(local.amount) : '');
      setType(local.type);
      setCategory(local.category);
      setDescription(local.description);
      setHasParsed(true);
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch('/api/voice-income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not process voice note.');
      }
      setTranscript(data.transcript || payload.transcript || '');
      setAmount(data.amount ? String(data.amount) : '');
      setType(data.type === 'expense' ? 'expense' : 'income');
      setCategory(data.category || 'Tailoring');
      setDescription(data.description || data.transcript || '');
      setHasParsed(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Voice processing failed.';
      setErrorMsg(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceCapture = async () => {
    setErrorMsg(null);
    navigator.vibrate?.(12);

    // Prefer MediaRecorder to send audio to Gemini server-side; also run SpeechRecognition live preview if supported
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (SpeechRec && !navigator.mediaDevices?.getUserMedia) {
      const recognition = new SpeechRec() as {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-IN';
      recognition.interimResults = true;
      let latest = '';
      recognition.onresult = (event) => {
        const res = event.results[event.results.length - 1];
        if (res && res[0]) {
          latest = res[0].transcript;
          setTranscript(latest);
        }
      };
      recognition.onerror = () => {
        setIsRecording(false);
        setErrorMsg('Microphone permission denied or unavailable.');
      };
      recognition.onend = () => {
        setIsRecording(false);
        if (latest.trim()) {
          parseWithServer({ transcript: latest.trim() });
        }
      };
      recognitionRef.current = recognition;
      setIsRecording(true);
      recognition.start();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size < 200) {
          setErrorMsg('Recording was too short. Tap the mic and speak clearly.');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = String(reader.result || '').split(',')[1] || '';
          if (base64) {
            parseWithServer({
              audioBase64: base64,
              mimeType: blob.type || 'audio/webm',
            });
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      recorder.start();
    } catch {
      setErrorMsg('Microphone access is blocked. You can type or tap a sample sentence below.');
    }
  };

  const stopVoiceCapture = () => {
    navigator.vibrate?.(10);
    stopRecordingCleanup();
  };

  const speakPrompt = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      language === 'hi'
        ? 'कृपया बोलें, आज आपने कितना कमाया या खर्च किया।'
        : language === 'gu'
        ? 'કૃપા કરીને બોલો, આજે તમે કેટલા રૂપિયા કમાયા કે ખર્ચ્યા.'
        : 'Please speak what you earned or spent today.'
    );
    utter.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-IN';
    window.speechSynthesis.speak(utter);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setErrorMsg('Please enter an amount greater than 0.');
      return;
    }
    const today = new Date();
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    onSaveEntry({
      date: today.toISOString().slice(0, 10),
      dayLabel: dayLabels[today.getDay()],
      amount: Math.round(numericAmount),
      type,
      category,
      description: description.trim() || `${category} entry`,
      source: transcript ? 'voice' : 'manual',
      transcript: transcript || undefined,
    });
    setTranscript('');
    setAmount('');
    setDescription('');
    setHasParsed(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Speak to add income"
    >
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E5E0D5] shadow-2xl max-h-[90dvh] overflow-y-auto p-5 pb-8">
        <div className="w-10 h-1.5 bg-[#D4CFC3] rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#064E46]">Voice & Quick Entry</p>
            <h2 className="text-xl font-bold text-[#0F2421]">Speak to add income</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={speakPrompt}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[#E5E0D5] bg-white text-[#064E46] hover:bg-[#EBF3F1]"
              aria-label="Hear voice instruction"
              title="Hear voice instruction"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
              aria-label="Close voice sheet"
            >
              <X className="w-5 h-5 text-[#526763]" />
            </button>
          </div>
        </div>

        {/* Mic Trigger Zone */}
        <div className="mt-4 rounded-2xl bg-[#FCEBE6] border border-[#F2D5CC] p-5 text-center">
          <button
            type="button"
            onClick={isRecording ? stopVoiceCapture : startVoiceCapture}
            disabled={isProcessing}
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
              isRecording
                ? 'bg-[#C8553D] text-white ring-4 ring-[#C8553D]/25'
                : 'bg-white text-[#C8553D] hover:bg-[#FFF8F6]'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start speaking'}
          >
            {isProcessing ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : isRecording ? (
              <Square className="w-6 h-6 fill-current" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
          <p className="mt-3 text-sm font-semibold text-[#0F2421]">
            {isProcessing
              ? 'Understanding your voice note...'
              : isRecording
              ? 'Listening... Tap square to finish'
              : 'Tap mic & speak in Hindi, Gujarati, or English'}
          </p>
          <p className="mt-1 text-xs text-[#526763]">
            Example: “Aaj maine silai se 500 rupaye kamaye.”
          </p>
        </div>

        {/* Quick phrase chips / text bar */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-[#526763] mb-1.5">
            Or type / tap a spoken example
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. Aaj silai se 500 rupaye kamaye"
              className="flex-1 rounded-xl border border-[#D9D3C7] bg-white px-3.5 py-2.5 text-sm text-[#0F2421] focus:outline-none focus:ring-2 focus:ring-[#064E46]"
            />
            <button
              type="button"
              disabled={!transcript.trim() || isProcessing}
              onClick={() => parseWithServer({ transcript: transcript.trim() })}
              className="rounded-xl bg-[#064E46] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-[#043B35] min-h-[44px] whitespace-nowrap shrink-0"
            >
              Extract
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SAMPLE_PHRASES[language].map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => {
                  setTranscript(phrase);
                  parseWithServer({ transcript: phrase });
                }}
                className="text-left rounded-lg border border-[#E5E0D5] bg-white px-2.5 py-1.5 text-xs text-[#374B47] hover:bg-[#EBF3F1] transition-colors"
              >
                “{phrase}”
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 rounded-xl bg-[#FCEBE6] border border-[#E7B5A7] px-3.5 py-2.5 text-xs font-medium text-[#9A3520]">
            {errorMsg}
          </div>
        )}

        {/* Confirmation Form */}
        <form onSubmit={handleSave} className="mt-5 pt-4 border-t border-[#E5E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#064E46]">
              {hasParsed ? 'Confirm extracted record' : 'Manual record details'}
            </span>
            <div className="inline-flex rounded-lg bg-[#EBF3F1] p-0.5">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  type === 'income' ? 'bg-white text-[#064E46] shadow-xs' : 'text-[#526763]'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  type === 'expense' ? 'bg-white text-[#C8553D] shadow-xs' : 'text-[#526763]'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#526763] mb-1">Amount (Rs)</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full rounded-xl border border-[#D9D3C7] bg-white px-3.5 py-2.5 text-sm font-semibold tabular-nums text-[#0F2421] focus:outline-none focus:ring-2 focus:ring-[#064E46]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#526763] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#D9D3C7] bg-white px-3 py-2.5 text-sm text-[#0F2421] focus:outline-none focus:ring-2 focus:ring-[#064E46]"
              >
                <option value="Tailoring">Tailoring</option>
                <option value="Domestic Work">Domestic Work</option>
                <option value="Tiffin & Food">Tiffin & Food</option>
                <option value="Handicrafts">Handicrafts</option>
                <option value="Materials & Supplies">Materials & Supplies</option>
                <option value="Transport">Transport</option>
                <option value="Other Work">Other Work</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#526763] mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Blouse stitching order"
              className="w-full rounded-xl border border-[#D9D3C7] bg-white px-3.5 py-2.5 text-sm text-[#0F2421] focus:outline-none focus:ring-2 focus:ring-[#064E46]"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064E46] py-3.5 text-sm font-semibold text-white hover:bg-[#043B35] active:scale-[0.99] transition-all min-h-[48px]"
          >
            <Check className="w-4 h-4" />
            <span>Save to My Earnings</span>
          </button>
        </form>
      </div>
    </div>
  );
};
