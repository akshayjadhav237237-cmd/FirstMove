export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!global.rlMap) global.rlMap = new Map();
  const now = Date.now();
  const rec = global.rlMap.get(ip) || { count: 0, reset: now + 60000 };
  if (now > rec.reset) { rec.count = 0; rec.reset = now + 60000; }
  rec.count++;
  global.rlMap.set(ip, rec);
  if (rec.count > 10) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const { idea } = req.body || {};
  if (!idea || idea.trim().length < 5) return res.status(400).json({ error: 'Idea text is required.' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'API key not configured.' });

  const payload = {
    system_instruction: {
      parts: [{ text: "You are a sharp startup advisor running a Socratic ideation session. Given a rough early-stage idea, generate exactly 3 targeted clarifying questions. Each question must target a specific unknown that would change the execution plan if answered differently. Focus on: who specifically has this problem, what the real bottleneck is, and what success looks like in 30 days. Be direct, never generic. Never ask yes/no questions. Use simple language — no jargon." }]
    },
    contents: [{ role: "user", parts: [{ text: `Idea: ${idea}` }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          socratic_questions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                target_variable: { type: "STRING" },
                question_text: { type: "STRING" },
                contextual_rationale: { type: "STRING" }
              },
              required: ["id", "target_variable", "question_text", "contextual_rationale"]
            }
          }
        },
        required: ["socratic_questions"]
      }
    }
  };

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    if (!r.ok) throw new Error(await r.text());
    const d = await r.json();
    const parsed = JSON.parse(d.candidates[0].content.parts[0].text);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Clarify error:', err);
    return res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
  }
}
