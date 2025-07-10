import { useState, useCallback, useEffect, useRef } from 'react';
import { voiceAssistantService } from '@/services/voiceAssistantService';

export interface UseVoiceAssistantProps {
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (error: string) => void;
  autoStopListening?: boolean; // Stop listening after final result
  speechRate?: number;
  speechPitch?: number;
  speechVolume?: number;
}

export const useVoiceAssistant = ({
  onTranscript,
  onSpeechStart,
  onSpeechEnd,
  onError,
  autoStopListening = true,
  speechRate = 1,
  speechPitch = 1,
  speechVolume = 1
}: UseVoiceAssistantProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState<string>('');

  const listeningTimeoutRef = useRef<NodeJS.Timeout>();

  // Check support and permissions on mount
  useEffect(() => {
    const checkSupport = async () => {
      const speechRecognitionSupported = voiceAssistantService.isSpeechRecognitionSupported();
      const speechSynthesisSupported = voiceAssistantService.isSpeechSynthesisSupported();

      setIsSupported(speechRecognitionSupported && speechSynthesisSupported);

      if (speechRecognitionSupported) {
        const permission = await voiceAssistantService.requestMicrophonePermission();
        setHasPermission(permission);
      }
    };

    checkSupport();
  }, []);

  // Handle transcript results
  const handleTranscript = useCallback((transcript: string, isFinal: boolean) => {
    setCurrentTranscript(transcript);
    onTranscript?.(transcript, isFinal);

    if (isFinal && autoStopListening) {
      // Auto-stop after getting final result
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }

      listeningTimeoutRef.current = setTimeout(() => {
        stopListening();
      }, 500); // Small delay to ensure we capture the complete result
    }
  }, [onTranscript, autoStopListening]);

  // Handle errors
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsListening(false);
    setIsSpeaking(false);
    onError?.(errorMessage);
  }, [onError]);

  // Start listening for speech
  const startListening = useCallback(async () => {
    if (!isSupported || !hasPermission || isListening) {
      return;
    }

    try {
      setError('');
      setCurrentTranscript('');

      await voiceAssistantService.startListening(
        handleTranscript,
        handleError,
        {
          lang: 'en-US',
          continuous: true,
          interimResults: true
        }
      );

      setIsListening(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start listening';
      handleError(errorMessage);
    }
  }, [isSupported, hasPermission, isListening, handleTranscript, handleError]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }

    voiceAssistantService.stopListening();
    setIsListening(false);
    setCurrentTranscript('');
  }, []);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Speak text
  const speak = useCallback(async (text: string) => {
    if (!isSupported || isSpeaking || !text.trim()) {
      return;
    }

    try {
      setError('');

      const preferredVoice = voiceAssistantService.getPreferredVoice();

      await voiceAssistantService.speak(
        text,
        {
          voice: preferredVoice || undefined,
          rate: speechRate,
          pitch: speechPitch,
          volume: speechVolume
        },
        () => {
          setIsSpeaking(true);
          onSpeechStart?.();
        },
        () => {
          setIsSpeaking(false);
          onSpeechEnd?.();
        },
        handleError
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to speak';
      handleError(errorMessage);
    }
  }, [isSupported, isSpeaking, speechRate, speechPitch, speechVolume, onSpeechStart, onSpeechEnd, handleError]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    voiceAssistantService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Get available voices
  const getVoices = useCallback(() => {
    return voiceAssistantService.getVoices();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
      voiceAssistantService.stopListening();
      voiceAssistantService.stopSpeaking();
    };
  }, []);

  return {
    // State
    isListening,
    isSpeaking,
    isSupported,
    hasPermission,
    currentTranscript,
    error,

    // Actions
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    getVoices,

    // Helpers
    isActive: isListening || isSpeaking,
    canUseVoice: isSupported && hasPermission
  };
};
