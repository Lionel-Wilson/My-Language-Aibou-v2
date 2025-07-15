import { ApiRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiService {
  private static async makeRequest(endpoint: string, data: ApiRequest): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.text();
        throw new Error(result.replace(/^"|"$/g, ''));
      }

      const result = await response.text();
      return result.replace(/^"|"$/g, ''); // Remove surrounding quotes if present
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async getDefinition(word: string, nativeLanguage: string): Promise<string> {
    return this.makeRequest('/word/definition', { word, nativeLanguage });
  }

  static async getSynonyms(word: string, nativeLanguage: string): Promise<string> {
    return this.makeRequest('/word/synonyms', { word, nativeLanguage });
  }

  static async getWordHistory(word: string, nativeLanguage: string): Promise<string> {
    return this.makeRequest('/word/history', { word, nativeLanguage });
  }

  static async explainSentence(sentence: string, nativeLanguage: string): Promise<string> {
    return this.makeRequest('/sentence/explanation', { sentence, nativeLanguage });
  }

  static async correctSentence(sentence: string, nativeLanguage: string): Promise<string> {
    return this.makeRequest('/sentence/correction', { sentence, nativeLanguage });
  }
}