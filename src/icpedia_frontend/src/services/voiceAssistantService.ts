// Voice Assistant Service - Handles speech recognition and synthesis

// Type declarations for speech APIs
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    serviceURI: string;

    start(): void;
    stop(): void;
    abort(): void;

    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };

  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

export interface VoiceConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface SpeechConfig {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class VoiceAssistantService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private isSpeaking = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  // Start listening for speech
  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    config: VoiceConfig = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        const error = 'Speech recognition not supported';
        onError(error);
        reject(new Error(error));
        return;
      }

      if (this.isListening) {
        resolve();
        return;
      }

      // Configure recognition
      if (config.lang) this.recognition.lang = config.lang;
      if (config.continuous !== undefined) this.recognition.continuous = config.continuous;
      if (config.interimResults !== undefined) this.recognition.interimResults = config.interimResults;

      // Set up event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('Voice recognition started');
        resolve();
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        onResult(transcript.trim(), isFinal);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        onError(`Speech recognition error: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('Voice recognition ended');
      };

      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onError(errorMessage);
        reject(error);
      }
    });
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Speak text
  speak(
    text: string,
    config: SpeechConfig = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        const error = 'Speech synthesis not supported';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      // Stop any current speech
      this.stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure speech
      if (config.voice) utterance.voice = config.voice;
      if (config.rate !== undefined) utterance.rate = config.rate;
      if (config.pitch !== undefined) utterance.pitch = config.pitch;
      if (config.volume !== undefined) utterance.volume = config.volume;

      // Set up event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('Speech synthesis started');
        onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        console.log('Speech synthesis ended');
        onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('Speech synthesis error:', event.error);
        const errorMessage = `Speech synthesis error: ${event.error}`;
        onError?.(errorMessage);
        reject(new Error(errorMessage));
      };

      // Start speaking
      this.synthesis.speak(utterance);
    });
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  // Get preferred voice (English, female if available)
  getPreferredVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();

    // Try to find a female English voice
    let preferredVoice = voices.find(voice =>
      voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
    );

    // Fallback to any English voice
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => voice.lang.startsWith('en'));
    }

    // Final fallback to first available voice
    return preferredVoice || voices[0] || null;
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }

  // Check if currently speaking
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  // Check if speech synthesis is supported
  isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Request microphone permission
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }
}

// Global instance
export const voiceAssistantService = new VoiceAssistantService();
