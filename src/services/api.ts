import {ApiRequest, LookupResponse} from '../types';



export class ApiService {
  private static base = import.meta.env.VITE_API_BASE_URL ?? '';
  private static version = '/api/v4';

  // TEXT responses (legacy endpoints)
  private static async makeTextRequest(endpoint: string, data: ApiRequest): Promise<string> {
    const response = await fetch(this.base +this.version+ endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const msg = await response.text().catch(() => '');
      throw new Error(msg || `API error ${response.status}`);
    }

    const result = await response.text();
    const trimmed = result.trim();
    if (!trimmed) return trimmed;

    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'string') return parsed;
    } catch {
      // Fall back to legacy quote trimming for non-JSON responses
    }

    return trimmed.replace(/^"|"$/g, '');
  }

  // JSON responses (new endpoints)
  private static async makeJsonRequest<T>(endpoint: string, data: ApiRequest): Promise<T> {
    const response = await fetch(this.base+this.version + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // try to surface server message
      const maybeJson = await response.json().catch(async () => ({ message: await response.text().catch(() => '') }));
      const msg = (maybeJson as any)?.message || `API error ${response.status}`;
      throw new Error(msg);
    }

    return (await response.json()) as T;
  }

  // ---- Existing text endpoints ----
  static async getDefinition(word: string, nativeLanguage: string): Promise<string> {
    return this.makeTextRequest('/word/definition', { word, nativeLanguage });
  }
  static async getSynonyms(word: string, nativeLanguage: string): Promise<string> {
    return this.makeTextRequest('/word/synonyms', { word, nativeLanguage });
  }
  static async getWordHistory(word: string, nativeLanguage: string): Promise<string> {
    return this.makeTextRequest('/word/history', { word, nativeLanguage });
  }
  static async explainSentence(sentence: string, nativeLanguage: string, isDetailed: boolean = false): Promise<string> {
    return this.makeTextRequest('/sentence/explanation', { sentence, nativeLanguage, isDetailed });
  }

  static async correctSentence(sentence: string, nativeLanguage: string): Promise<string> {
    return this.makeTextRequest('/sentence/correction', { sentence, nativeLanguage });
  }

  // ---- New lookup (JSON) ----
  static async lookupWord(word: string, nativeLanguage: string): Promise<LookupResponse> {
    return this.makeJsonRequest<LookupResponse>('/word/lookup', { word, nativeLanguage });
  }
}