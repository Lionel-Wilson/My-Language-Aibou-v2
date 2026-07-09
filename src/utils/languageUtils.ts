// Language code mapping for Web Speech API
// Maps our language names to BCP 47 language codes for speech synthesis

export const getSpeechLangCode = (language: string): string => {
  const languageMap: Record<string, string> = {
    'English': 'en-US',
    'Spanish': 'es-ES',
    'Spanish (Argentina)': 'es-AR',
    'Spanish (Bolivia)': 'es-BO',
    'Spanish (Chile)': 'es-CL',
    'Spanish (Colombia)': 'es-CO',
    'Spanish (Costa Rica)': 'es-CR',
    'Spanish (Cuba)': 'es-CU',
    'Spanish (Dominican Republic)': 'es-DO',
    'Spanish (Ecuador)': 'es-EC',
    'Spanish (El Salvador)': 'es-SV',
    'Spanish (Guatemala)': 'es-GT',
    'Spanish (Honduras)': 'es-HN',
    'Spanish (Mexico)': 'es-MX',
    'Spanish (Nicaragua)': 'es-NI',
    'Spanish (Panama)': 'es-PA',
    'Spanish (Paraguay)': 'es-PY',
    'Spanish (Peru)': 'es-PE',
    'Spanish (Puerto Rico)': 'es-PR',
    'Spanish (Uruguay)': 'es-UY',
    'Spanish (Venezuela)': 'es-VE',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Italian': 'it-IT',
    'Portuguese': 'pt-PT',
    'Russian': 'ru-RU',
    'Japanese': 'ja-JP',
    'Korean': 'ko-KR',
    'Chinese': 'zh-CN',
    'Arabic': 'ar-SA',
    'Hindi': 'hi-IN',
  };

  return languageMap[language] || 'en-US'; // Default to English if language not found
};

// Check if speech synthesis is supported
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// Get available voices for a specific language
export const getVoicesForLanguage = (langCode: string): SpeechSynthesisVoice[] => {
  if (!isSpeechSynthesisSupported()) return [];
  
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith(langCode.split('-')[0]));
};