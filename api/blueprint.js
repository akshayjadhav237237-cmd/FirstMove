export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple in-memory rate limiting (max 10 req/min per IP)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (!global.rateLimitMap) global.rateLimitMap = new Map();
  const now = Date.now();
  const record = global.rateLimitMap.get(ip) || { count: 0, resetTime: now + 60000 };
  if (now > record.resetTime) { record.count = 0; record.resetTime = now + 60000; }
  record.count++;
  global.rateLimitMap.set(ip, record);
  if (record.count > 10) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  const { idea, qa } = req.body;
  if (!idea || idea.trim().length < 5) {
    return res.status(400).json({ error: 'Idea text is required.' });
  }
  if (!qa || !Array.isArray(qa) || qa.length === 0) {
    return res.status(400).json({ error: 'Questions and answers are required.' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  const qaText = qa.map(q => `Q: ${q.question_text}\nA: ${q.answer}`).join('\n\n');
  const contentsText = `Idea: ${idea}\n\nClarifying answers:\n${qaText}`;

  const body = {
    system_instruction: {
      parts: [{ text: "You are a ruthless early-stage advisor who uses the DVF framework (Desirability, Viability, Feasibility) from IDEO and Lean Startup methodology. Given an idea and clarifying answers, identify exactly 3 load-bearing assumptions — one per DVF dimension. Assign honest confidence scores: most early-stage assumptions should score below 65 because they are untested. Sequence the roadmap so the lowest-confidence assumption is addressed first. Do not tell the user whether the idea is good or bad. Your job is to surface what they do not know yet, not to validate their enthusiasm." }]
    },
    contents: [{ 
      role: "user", 
      parts: [{ text: contentsText }] 
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          sharpened_problem_statement: { type: "STRING" },
          assumptions_matrix: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                dimension: { 
                  type: "STRING", 
                  enum: ["DESIRABILITY", "VIABILITY", "FEASIBILITY"] 
                },
                assumption_statement: { type: "STRING" },
                confidence_assessment: {
                  type: "OBJECT",
                  properties: {
                    confidence_score: { type: "INTEGER" },
                    qualitative_label: { 
                      type: "STRING", 
                      enum: ["HIGH", "MODERATE", "LOW"] 
                    },
                    contributing_factors: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    }
                  },
                  required: ["confidence_score", "qualitative_label", "contributing_factors"]
                }
              },
              required: ["id", "dimension", "assumption_statement", "confidence_assessment"]
            }
          },
          prioritized_roadmap: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                sequence_number: { type: "INTEGER" },
                target_assumptions: { 
                  type: "ARRAY", 
                  items: { type: "STRING" } 
                },
                mitigation_action: { type: "STRING" },
                test_metrics: { type: "STRING" }
              },
              required: ["sequence_number", "target_assumptions", "mitigation_action", "test_metrics"]
            }
          },
          immediate_next_step: {
            type: "OBJECT",
            properties: {
              action_item: { type: "STRING" },
              objective: { type: "STRING" }
            },
            required: ["action_item", "objective"]
          }
        },
        required: ["sharpened_problem_statement", "assumptions_matrix", "prioritized_roadmap", "immediate_next_step"]
      }
    }
  };

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      throw new Error(`Gemini error: ${err}`);
    }

    const data = await geminiRes.json();
    const text = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Blueprint API error:', error);
    return res.status(500).json({ error: 'Failed to generate blueprint. Please try again.' });
  }
}
