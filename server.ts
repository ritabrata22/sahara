import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'sahara-api' });
  });

  app.post('/api/voice-income', async (req, res) => {
    try {
      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
        });
        return;
      }

      const { transcript, audioBase64, mimeType, language } = req.body ?? {};
      let resolvedTranscript = typeof transcript === 'string' ? transcript.trim() : '';

      if (!resolvedTranscript && typeof audioBase64 === 'string' && audioBase64.length > 0) {
        const audioResponse = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: typeof mimeType === 'string' ? mimeType : 'audio/webm',
                  data: audioBase64,
                },
              },
              {
                text: `Transcribe this short voice note accurately. The speaker may speak Hindi, Gujarati, Hinglish, or English (user language preference: ${language || 'en'}). Return only the spoken words.`,
              },
            ],
          },
        });
        resolvedTranscript = (audioResponse.text ?? '').trim();
      }

      if (!resolvedTranscript) {
        res.status(400).json({ error: 'No speech or transcript text was detected. Please try speaking again.' });
        return;
      }

      const extraction = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Extract a structured financial ledger record from this spoken income or expense entry by an informal or home-based woman worker in India (e.g., tailoring, domestic work, tiffin/food, crafts, supplies).
Spoken text: "${resolvedTranscript}"
Preferred UI language: ${language || 'en'}.

Rules:
- amount must be a positive number in INR (Indian Rupees). If no amount is mentioned, estimate 0.
- type must be either "income" or "expense".
- category should be one of: "Tailoring", "Domestic Work", "Tiffin & Food", "Handicrafts", "Materials & Supplies", "Transport", "Other Work".
- description should be a short, clear 3-8 word summary in plain English or matching simple phrasing.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER, description: 'Amount in INR' },
              type: { type: Type.STRING, description: 'income or expense' },
              category: { type: Type.STRING, description: 'Work or expense category' },
              description: { type: Type.STRING, description: 'Concise work summary' },
              cleanTranscript: { type: Type.STRING, description: 'Cleaned spoken transcript' },
              languageDetected: { type: Type.STRING, description: 'Detected language name' },
            },
          },
        },
      });

      const parsed = JSON.parse((extraction.text ?? '{}').trim());
      res.json({
        transcript: parsed.cleanTranscript || resolvedTranscript,
        amount: typeof parsed.amount === 'number' && parsed.amount > 0 ? parsed.amount : 0,
        type: parsed.type === 'expense' ? 'expense' : 'income',
        category: parsed.category || 'Tailoring',
        description: parsed.description || resolvedTranscript,
        languageDetected: parsed.languageDetected || 'Hindi / English',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process voice entry.';
      console.error('Voice income error:', message);
      res.status(500).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SAHARA server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
