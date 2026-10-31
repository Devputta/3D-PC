/**
 * Boardwalk — Server-Side Gemini API Proxy Handler
 *
 * Keeps the GEMINI_API_KEY secure on the server only.
 * Implements per-visitor rate limiting, strict PC hardware focus,
 * word count limits (< 120 words), and friendly off-topic refusals.
 */

import type { IncomingMessage, ServerResponse } from 'http';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limiting map: visitor IP -> entry
const visitorRateLimits = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 8;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = visitorRateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    visitorRateLimits.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
}

export async function handleAskApiRoute(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  // Determine visitor identifier for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'visitor';

  if (!checkRateLimit(ip)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Question limit reached. Please wait a minute before asking another question.'
      })
    );
    return;
  }

  // Parse JSON request body
  let bodyBuffer = '';
  try {
    for await (const chunk of req) {
      bodyBuffer += chunk;
      // Safeguard against oversized payloads (> 50KB)
      if (bodyBuffer.length > 50 * 1024) {
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Request body too large.' }));
        return;
      }
    }
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Could not read request body.' }));
    return;
  }

  let payload: {
    question?: string;
    partName?: string;
    partSummary?: string;
    partBody?: string[];
    partSpecs?: { label: string; value: string }[];
  } = {};

  try {
    payload = JSON.parse(bodyBuffer);
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
    return;
  }

  const { question, partName, partSummary, partBody, partSpecs } = payload;
  if (!question || typeof question !== 'string' || !question.trim()) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Please provide a valid question.' }));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Gemini API key is not configured on the server. Please verify your environment setup.'
      })
    );
    return;
  }

  const systemInstruction = `You are an expert PC hardware instructor for the Boardwalk interactive motherboard explorer.
Answer the student's question about the selected component accurately, directly, and in plain language.
Strict requirements:
1. Limit your answer to PC hardware, computer components, and computer architecture.
2. If the user asks something off-topic (not about computer hardware, parts, or PC computing), politely refuse: "I can only answer questions about computer hardware and components."
3. Keep the entire response under 120 words.
4. Do not use marketing adjectives, buzzwords, exclamation marks, or emojis.
5. Use plain text paragraphs only without markdown headings or chat banter.`;

  const specsText = (partSpecs || []).map((s) => `${s.label}: ${s.value}`).join('; ');
  const userContent = `Hardware component: ${partName || 'Motherboard component'}
Summary: ${partSummary || ''}
Architecture details: ${(partBody || []).join(' ')}
Typical specifications: ${specsText}

User's question: ${question.trim()}`;

  const models = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-flash-latest'];
  let candidateText = '';

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userContent }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 280,
            temperature: 0.3
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && typeof text === 'string') {
          candidateText = text.trim();
          break;
        }
      }
    } catch {
      // Try next fallback model
    }
  }

  if (!candidateText) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'The hardware assistant is temporarily unavailable. Please try again in a moment.'
      })
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ answer: candidateText }));
}
