
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mic, MicOff, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VoiceAssistant from '@/components/VoiceAssistant';
import CodeCard from '@/components/CodeCard';
import Header from '@/components/Header';
import { useAIChat } from '@/hooks/useAIChat';
import { AuthClient } from '@dfinity/auth-client';

const Tutor = () => {
  // Configuration - replace with actual user canister ID from your system
  const userCanisterId = import.meta.env.VITE_USER_CANISTER_ID || undefined;

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use the AI chat hook with voice integration
  const {
    messages,
    isLoading,
    sendMessage,
    clearHistory,
    canisterInitialized,
    isAIConfigured,
    isListening,
    isSpeaking,
    isVoiceSupported,
    hasVoicePermission,
    currentTranscript,
    toggleListening,
    canUseVoice
  } = useAIChat({
    userCanisterId,
    onError: setError,
    enableVoice: true
  });




  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authClient = await AuthClient.create();
        const authenticated = await authClient.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (!authenticated) {
          // Redirect to home page if not authenticated
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/';
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-accent">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }



  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    setError('');

    try {
      await sendMessage(message);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setError('');
    } catch (err) {
      setError('Failed to clear chat history.');
    }
  };

  const handleMicToggle = () => {
    if (!canUseVoice) {
      setError('Voice functionality not available. Please check microphone permissions.');
      return;
    }

    toggleListening();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Update input with voice transcript
  useEffect(() => {
    if (currentTranscript && !isLoading) {
      setInputValue(currentTranscript);
    }
  }, [currentTranscript, isLoading]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      {/* Error Alert */}
      {error && (
        <div className="p-4">
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Configuration Warning */}
      {!isAIConfigured && (
        <div className="p-4">
          <Alert className="max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              AI service not configured. Please set up your Omnidimension API key and agent ID in the environment variables.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Voice Assistant */}
          <div className="lg:col-span-1">
            <Card className="premium-card h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-headings font-semibold text-accent mb-2">AI Tutor</h2>
                  <p className="text-subtle-text text-sm">Your personal Web3 learning assistant</p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <VoiceAssistant
                    isSpeaking={isLoading}
                    isListening={isListening}
                    onMicToggle={handleMicToggle}
                  />
                </div>

                {/* Status Information */}
                <div className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-subtle-text">AI Service</span>
                      <span className={isAIConfigured ? "text-success-green" : "text-error-red"}>
                        {isAIConfigured ? "Connected" : "Not configured"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-subtle-text">Storage</span>
                      <span className={canisterInitialized ? "text-success-green" : "text-error-red"}>
                        {canisterInitialized ? "Connected" : "Not connected"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-subtle-text">Voice</span>
                      <span className={canUseVoice ? "text-success-green" : "text-error-red"}>
                        {canUseVoice ? "Available" : isVoiceSupported ? "No permission" : "Not supported"}
                      </span>
                    </div>
                  </div>

                  {currentTranscript && (
                    <div className="p-3 bg-dark-bg rounded-lg">
                      <p className="text-xs text-accent">
                        Listening: "{currentTranscript}"
                      </p>
                    </div>
                  )}

                  {messages.length > 1 && (
                    <Button
                      onClick={handleClearHistory}
                      variant="outline"
                      size="sm"
                      className="w-full border-border-color hover:bg-shadow-blue"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear History
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="premium-card h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-border-color">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-headings font-semibold text-accent">Learning Session</h3>
                      <p className="text-sm text-subtle-text">Ask questions about ICP, Motoko, Rust, and more</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-primary animate-pulse' : 'bg-success-green'}`}></div>
                      <span className="text-xs text-subtle-text">
                        {isLoading ? 'Thinking...' : 'Ready'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-headings font-semibold text-accent mb-2">Welcome to your AI Tutor!</h4>
                      <p className="text-subtle-text max-w-md mx-auto">
                        Start by asking any question about the Internet Computer, Motoko, Rust, or Web3 development.
                        You can type or use voice input.
                      </p>
                    </div>
                  )}

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
                        <div className={`max-w-md ${message.type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                          <Card
                            className={`${message.type === 'user'
                              ? 'bg-gradient-to-br from-primary to-secondary text-white'
                              : 'glass-card'
                              }`}
                          >
                            <CardContent className="p-4">
                              <p className={`${message.type === 'user' ? 'text-white' : 'text-accent'
                                }`}>
                                {message.content}
                              </p>
                              <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-subtle-text'
                                }`}>
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input Section */}
                <div className="p-6 border-t border-border-color">
                  <div className="flex items-center space-x-4">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isListening ? "Listening..." : "Ask me anything about ICP, Motoko, or Rust..."}
                      className="flex-1 bg-dark-bg border-border-color text-accent placeholder:text-subtle-text"
                      disabled={isLoading || isListening}
                    />
                    <Button
                      onClick={handleMicToggle}
                      variant={isListening ? "default" : "outline"}
                      size="icon"
                      className={`${isListening
                        ? 'bg-primary hover:bg-hover-purple'
                        : 'border-border-color hover:bg-shadow-blue'
                        }`}
                      disabled={isLoading || !canUseVoice}
                      title={!canUseVoice ? "Voice not available" : isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-primary hover:bg-hover-purple"
                      disabled={isLoading || !inputValue.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {isLoading && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-subtle-text">
                        {isSpeaking ? 'AI is speaking...' : 'AI is thinking...'}
                      </p>
                    </div>
                  )}

                  {isListening && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-accent">
                        🎤 Listening... Speak clearly and I'll send your message automatically
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
