
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceAssistantProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  onMicToggle?: () => void;
}

const VoiceAssistant = ({ isSpeaking = false, isListening = false, onMicToggle }: VoiceAssistantProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isSpeaking) {
      setAnimationClass('animate-pulse-glow');
    } else if (isListening) {
      setAnimationClass('animate-pulse');
    } else {
      setAnimationClass('');
    }
  }, [isSpeaking, isListening]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className={`relative w-48 h-48 mb-6 ${animationClass}`}>
        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center glass-card">
          <div className="w-32 h-32 bg-dark-bg rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        </div>
        
        {/* Animated rings */}
        {(isSpeaking || isListening) && (
          <>
            <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-4 border-2 border-secondary rounded-full animate-ping opacity-30 delay-100"></div>
          </>
        )}
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-headings font-semibold text-accent mb-2">
          AI Tutor
        </h3>
        <p className="text-subtle-text">
          {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready to help you learn'}
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
