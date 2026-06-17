import { getMockClarify, getMockAnalyze } from './mockData.js';

export async function resilientFetch(url, options, ideaText) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (err) {
    console.warn("API failed — demo fallback:", err.message);
    const mockData = url.includes('clarify')
      ? getMockClarify(ideaText)
      : getMockAnalyze(ideaText);
    return { ok: true, json: async () => mockData };
  }
}
