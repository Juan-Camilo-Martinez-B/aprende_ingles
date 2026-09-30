import { useCallback, useEffect, useRef, useState } from 'react';

export type SpeechRecognitionResult = {
  transcript: string;
  confidence: number;
};

type UseSpeechRecognitionReturn = {
  isListening: boolean;
  transcript: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string | null;
};

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const createRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    return recognition;
  }, [isSupported]);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    setConfidence(0);

    const recognition = createRecognition();
    if (!recognition) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0];
      if (result) {
        const best = result[0];
        setTranscript(best.transcript);
        setConfidence(best.confidence);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setError('No se detectó voz. Intenta de nuevo.');
      } else if (event.error === 'audio-capture') {
        setError('No se pudo acceder al micrófono.');
      } else if (event.error === 'not-allowed') {
        setError('Permiso de micrófono denegado. Habilítalo en tu navegador.');
      } else {
        setError('Error al escuchar. Intenta de nuevo.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setError('Error al iniciar reconocimiento de voz.');
      setIsListening(false);
    }
  }, [createRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    startListening,
    stopListening,
    isSupported,
    error,
  };
}

/**
 * Compares the user's spoken text against the expected text.
 * Returns true if the user's pronunciation matches closely enough.
 */
export function matchesPronunciation(spoken: string, expected: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ');

  const spokenNorm = normalize(spoken);
  const expectedNorm = normalize(expected);

  // Exact match
  if (spokenNorm === expectedNorm) return true;

  // Contains the expected word
  if (spokenNorm.includes(expectedNorm)) return true;

  // The expected contains the spoken (for single letters)
  if (expectedNorm.includes(spokenNorm) && spokenNorm.length >= 1) return true;

  // For single letters like "A", "B", etc. check common speech recognition outputs
  // Speech recognition often outputs the word that sounds like the letter name
  const letterPhonetics: Record<string, string[]> = {
    a: ['a', 'ay', 'eh', 'ei'],
    b: ['b', 'be', 'bee', 'bi'],
    c: ['c', 'see', 'sea', 'si', 'ce'],
    d: ['d', 'de', 'dee', 'di'],
    e: ['e', 'ee', 'i'],
    f: ['f', 'ef', 'eff'],
    g: ['g', 'gee', 'ji', 'ge'],
    h: ['h', 'aitch', 'ach', 'each', 'age', 'etch', 'eight'],
    i: ['i', 'eye', 'ai'],
    j: ['j', 'jay', 'jey', 'je'],
    k: ['k', 'kay', 'key', 'ke'],
    l: ['l', 'el', 'ell'],
    m: ['m', 'em', 'am'],
    n: ['n', 'en'],
    o: ['o', 'oh', 'ou'],
    p: ['p', 'pee', 'pe', 'pi'],
    q: ['q', 'queue', 'cue', 'cu', 'kyu', 'kew'],
    r: ['r', 'are', 'ar'],
    s: ['s', 'es', 'ess'],
    t: ['t', 'tee', 'te', 'ti', 'tea'],
    u: ['u', 'you', 'yu', 'iu'],
    v: ['v', 've', 'vi', 'vee'],
    w: ['w', 'double u', 'double you', 'doubleyou', 'doubleyu'],
    x: ['x', 'ex', 'eks'],
    y: ['y', 'why', 'wai', 'uai'],
    z: ['z', 'zee', 'zed', 'ze', 'zi'],
  };

  // Check letter phonetics
  if (expectedNorm.length === 1 && letterPhonetics[expectedNorm]) {
    const alternatives = letterPhonetics[expectedNorm];
    if (alternatives.some((alt) => spokenNorm === alt || spokenNorm.includes(alt))) {
      return true;
    }
  }

  // For numbers, check if spoken matches
  const numberWords: Record<string, string[]> = {
    one: ['1', 'one', 'won'],
    two: ['2', 'two', 'too', 'to'],
    three: ['3', 'three', 'tree'],
    four: ['4', 'four', 'for', 'fore'],
    five: ['5', 'five'],
    six: ['6', 'six', 'sicks'],
    seven: ['7', 'seven'],
    eight: ['8', 'eight', 'ate'],
    nine: ['9', 'nine'],
    ten: ['10', 'ten'],
    eleven: ['11', 'eleven'],
    twelve: ['12', 'twelve'],
    thirteen: ['13', 'thirteen'],
    fourteen: ['14', 'fourteen'],
    fifteen: ['15', 'fifteen'],
    sixteen: ['16', 'sixteen'],
    seventeen: ['17', 'seventeen'],
    eighteen: ['18', 'eighteen'],
    nineteen: ['19', 'nineteen'],
    twenty: ['20', 'twenty'],
    thirty: ['30', 'thirty'],
    forty: ['40', 'forty'],
    fifty: ['50', 'fifty'],
    sixty: ['60', 'sixty'],
    seventy: ['70', 'seventy'],
    eighty: ['80', 'eighty'],
    ninety: ['90', 'ninety'],
    'one hundred': ['100', 'one hundred', 'a hundred', 'hundred'],
  };

  if (numberWords[expectedNorm]) {
    const alternatives = numberWords[expectedNorm];
    if (alternatives.some((alt) => spokenNorm === alt || spokenNorm.includes(alt))) {
      return true;
    }
  }

  return false;
}
