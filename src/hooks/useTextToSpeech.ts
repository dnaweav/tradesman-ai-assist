
import { useState, useCallback, useRef } from 'react';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    // Stop any current speech
    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Configure speech settings
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Set up event listeners
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    // Start speaking
    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (utteranceRef.current) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      utteranceRef.current = null;
    }
  }, []);

  return { speak, stop, isPlaying };
}
