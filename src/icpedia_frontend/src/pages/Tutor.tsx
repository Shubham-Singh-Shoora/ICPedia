
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mic, MicOff } from 'lucide-react';
import VoiceAssistant from '@/components/VoiceAssistant';
import CodeCard from '@/components/CodeCard';
import Header from '@/components/Header';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'code';
  content: string;
  timestamp: Date;
  codeLanguage?: string;
  codeTitle?: string;
}

const Tutor = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI tutor for the Internet Computer. I can help you learn ICP, Motoko, and Rust. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Great question! Let me help you with that. The Internet Computer is a blockchain that can host smart contracts at web speed...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Start voice recognition
      console.log('Starting voice recognition...');
      // TODO: Implement voice recognition
    } else {
      // Stop voice recognition
      console.log('Stopping voice recognition...');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Voice Assistant */}
        <div className="w-1/3 bg-shadow-blue border-r border-border-color p-8">
          <VoiceAssistant 
            isSpeaking={isSpeaking}
            isListening={isListening}
            onMicToggle={handleMicToggle}
          />
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'code' ? (
                  <div className="max-w-4xl w-full">
                    <CodeCard
                      title={message.codeTitle || 'Code Example'}
                      language={message.codeLanguage || 'text'}
                      code={message.content}
                    />
                  </div>
                ) : (
                  <Card 
                    className={`max-w-md ${
                      message.type === 'user' 
                        ? 'bg-primary text-white' 
                        : 'glass-card'
                    }`}
                  >
                    <CardContent className="p-4">
                      <p className={`${
                        message.type === 'user' ? 'text-white' : 'text-accent'
                      }`}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-white/70' : 'text-subtle-text'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-6 bg-shadow-blue border-t border-border-color">
            <div className="flex items-center space-x-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about ICP, Motoko, or Rust..."
                className="flex-1 bg-dark-bg border-border-color text-accent"
              />
              <Button
                onClick={handleMicToggle}
                variant={isListening ? "default" : "outline"}
                size="icon"
                className={`${
                  isListening 
                    ? 'bg-primary hover:bg-hover-purple' 
                    : 'border-border-color hover:bg-shadow-blue'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                className="bg-primary hover:bg-hover-purple"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
