export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!global.rlMap2) global.rlMap2 = new Map();
  const now = Date.now();
  const rec = global.rlMap2.get(ip) || { count: 0, reset: now + 60000 };
  if (now > rec.reset) { rec.count = 0; rec.reset = now + 60000; }
  rec.count++;
  global.rlMap2.set(ip, rec);
  if (rec.count > 10) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const { idea, qa } = req.body || {};
  if (!idea || idea.trim().length < 5) return res.status(400).json({ error: 'Idea text is required.' });
  if (!qa || !Array.isArray(qa) || qa.length === 0) return res.status(400).json({ error: 'Q&A pairs are required.' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'API key not configured.' });

  const qaText = qa.map(q => `Q: ${q.question_text}\nA: ${q.answer}`).join('\n\n');

  const payload = {
    system_instruction: {
      parts: [{ text: "You are a multi-agent AI system simulating three specialized advisors: a Lead Strategist (optimistic opportunity analysis), a Risk Analyst (critical threat assessment using DVF framework), and a Devil's Advocate (adversarial challenge of core premises). For each agent, write a verdict paragraph and 3 key points. Assign honest scores (most early-stage assumptions score below 65). Then produce a complete blueprint with sharpened problem statement, 3 DVF assumptions with confidence scores, a sequenced roadmap starting with the riskiest assumption, an immediate next step, and 3 outcome scenarios (optimistic, neutral, pessimistic) each with probability, headline, key_conditions, impact_score (1-10), and estimated_timeline. Do not validate the idea — surface what is unknown." }]
    },
    contents: [{ role: "user", parts: [{ text: `Idea: ${idea}\n\nClarifying answers:\n${qaText}` }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          debate: {
            type: "OBJECT",
            properties: {
              strategist: {
                type: "OBJECT",
                properties: {
                  verdict: { type: "STRING" },
                  key_points: { type: "ARRAY", items: { type: "STRING" } },
                  opportunity_score: { type: "INTEGER" }
                },
                required: ["verdict", "key_points", "opportunity_score"]
              },
              risk_analyst: {
                type: "OBJECT",
                properties: {
                  verdict: { type: "STRING" },
                  key_points: { type: "ARRAY", items: { type: "STRING" } },
                  risk_score: { type: "INTEGER" }
                },
                required: ["verdict", "key_points", "risk_score"]
              },
              devils_advocate: {
                type: "OBJECT",
                properties: {
                  verdict: { type: "STRING" },
                  key_points: { type: "ARRAY", items: { type: "STRING" } },
                  challenge_score: { type: "INTEGER" }
                },
                required: ["verdict", "key_points", "challenge_score"]
              }
            },
            required: ["strategist", "risk_analyst", "devils_advocate"]
          },
          blueprint: {
            type: "OBJECT",
            properties: {
              sharpened_problem_statement: { type: "STRING" },
              assumptions_matrix: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "STRING" },
                    dimension: { type: "STRING", enum: ["DESIRABILITY", "VIABILITY", "FEASIBILITY"] },
                    assumption_statement: { type: "STRING" },
                    confidence_assessment: {
                      type: "OBJECT",
                      properties: {
                        confidence_score: { type: "INTEGER" },
                        qualitative_label: { type: "STRING", enum: ["HIGH", "MODERATE", "LOW"] },
                        contributing_factors: { type: "ARRAY", items: { type: "STRING" } }
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
                    target_assumptions: { type: "ARRAY", items: { type: "STRING" } },
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
              },
              scenarios: {
                type: "OBJECT",
                properties: {
                  optimistic: {
                    type: "OBJECT",
                    properties: {
                      probability: { type: "NUMBER" },
                      headline: { type: "STRING" },
                      key_conditions: { type: "ARRAY", items: { type: "STRING" } },
                      impact_score: { type: "INTEGER" },
                      estimated_timeline: { type: "STRING" }
                    },
                    required: ["probability", "headline", "key_conditions", "impact_score", "estimated_timeline"]
                  },
                  neutral: {
                    type: "OBJECT",
                    properties: {
                      probability: { type: "NUMBER" },
                      headline: { type: "STRING" },
                      key_conditions: { type: "ARRAY", items: { type: "STRING" } },
                      impact_score: { type: "INTEGER" },
                      estimated_timeline: { type: "STRING" }
                    },
                    required: ["probability", "headline", "key_conditions", "impact_score", "estimated_timeline"]
                  },
                  pessimistic: {
                    type: "OBJECT",
                    properties: {
                      probability: { type: "NUMBER" },
                      headline: { type: "STRING" },
                      key_conditions: { type: "ARRAY", items: { type: "STRING" } },
                      impact_score: { type: "INTEGER" },
                      estimated_timeline: { type: "STRING" }
                    },
                    required: ["probability", "headline", "key_conditions", "impact_score", "estimated_timeline"]
                  }
                },
                required: ["optimistic", "neutral", "pessimistic"]
              }
            },
            required: ["sharpened_problem_statement", "assumptions_matrix", "prioritized_roadmap", "immediate_next_step", "scenarios"]
          }
        },
        required: ["debate", "blueprint"]
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
    console.error('Analyze error:', err);
    return res.status(500).json({ error: 'Failed to generate analysis. Please try again.' });
  }
}
