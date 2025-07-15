import { ApiRequest, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v2';

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      return result.replace(/^"|"$/g, ''); // Remove surrounding quotes if present
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch data. Please try again.');
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