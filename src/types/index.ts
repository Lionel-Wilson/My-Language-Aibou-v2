export interface ApiResponse {
  content: string;
  timestamp?: string;
}

export interface ApiRequest {
  word?: string;
  sentence?: string;
  nativeLanguage: string;
}

export interface HistoryItem {
  id: string;
  type: 'dictionary' | 'analyse' | 'correction';
  query: string;
  response: string;
  timestamp: number;
  language: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}