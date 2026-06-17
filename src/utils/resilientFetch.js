import { getMockClarify, getMockBlueprint } from './mockData.js';

export async function resilientFetch(url, options, ideaText) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    console.warn("Network failed — serving demo fallback:", error.message);
    const mockData = url.includes('clarify')
      ? getMockClarify(ideaText)
      : getMockBlueprint(ideaText);
    return {
      ok: true,
      json: async () => mockData
    };
  }
}
