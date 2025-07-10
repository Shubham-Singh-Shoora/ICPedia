import { useState, useCallback, useEffect } from 'react';
import { omnidimensionService } from '@/services/omnidimensionService';
import { userCanisterService, ChatMessage as CanisterChatMessage } from '@/services/userCanisterService';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'code';
  content: string;
  timestamp: Date;
  codeLanguage?: string;
  codeTitle?: string;
}

export interface UseAIChatProps {
  userCanisterId?: string;
  onError?: (error: string) => void;
  enableVoice?: boolean;
}

export const useAIChat = ({ userCanisterId, onError, enableVoice = true }: UseAIChatProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [canisterInitialized, setCanisterInitialized] = useState(false);

  // Voice assistant integration
  const {
    isListening,
    isSpeaking,
    isSupported: isVoiceSupported,
    hasPermission: hasVoicePermission,
    currentTranscript,
    toggleListening,
    speak,
    stopSpeaking,
    canUseVoice
  } = useVoiceAssistant({
    onTranscript: (transcript, isFinal) => {
      if (isFinal && transcript.trim()) {
        // Auto-send voice message when speech is complete
        sendMessage(transcript);
      }
    },
    onError: (error) => {
      onError?.(`Voice error: ${error}`);
    },
    autoStopListening: true
  });

  // Initialize canister service
  useEffect(() => {
    const initCanister = async () => {
      if (userCanisterId && !canisterInitialized) {
        try {
          await userCanisterService.init(userCanisterId);
          setCanisterInitialized(true);

          // Load existing messages
          await loadMessagesFromCanister();
        } catch (error) {
          console.error('Failed to initialize canister:', error);
          // Don't show error for missing configuration
          if (userCanisterId !== 'your_user_canister_id_here') {
            onError?.('Failed to connect to your personal storage canister. Messages will not be saved.');
          }
        }
      }
    };

    initCanister();
  }, [userCanisterId, canisterInitialized, onError]);

  // Convert canister message to local format
  const convertCanisterMessage = useCallback((canisterMsg: CanisterChatMessage): ChatMessage => {
    let type: 'user' | 'ai' | 'code' = 'user';

    if ('AI' in canisterMsg.message_type) type = 'ai';
    else if ('Code' in canisterMsg.message_type) type = 'code';
    else if ('User' in canisterMsg.message_type) type = 'user';

    return {
      id: canisterMsg.id,
      type,
      content: canisterMsg.content,
      timestamp: new Date(Number(canisterMsg.timestamp) / 1_000_000), // Convert nanoseconds to milliseconds
      codeLanguage: canisterMsg.code_language?.[0],
      codeTitle: canisterMsg.code_title?.[0],
    };
  }, []);

  // Load messages from canister
  const loadMessagesFromCanister = useCallback(async () => {
    if (!canisterInitialized) return;

    try {
      const canisterMessages = await userCanisterService.getMessages(50);
      const convertedMessages = canisterMessages.map(convertCanisterMessage);
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Failed to load messages from canister:', error);
    }
  }, [canisterInitialized, convertCanisterMessage]);

  // Store message in canister
  const storeMessageInCanister = useCallback(async (
    type: 'user' | 'ai' | 'code',
    content: string,
    codeLanguage?: string,
    codeTitle?: string
  ) => {
    if (!canisterInitialized) {
      console.log('Canister not initialized, skipping message storage');
      return;
    }

    try {
      const messageType = type === 'user' ? 'User' : type === 'ai' ? 'AI' : 'Code';
      await userCanisterService.storeMessage(messageType, content, codeLanguage, codeTitle);
    } catch (error) {
      console.warn('Failed to store message in canister:', error);
      // Don't show error to user for storage failures
    }
  }, [canisterInitialized]);

  // Send message to AI and handle response
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);

    // Store user message in canister
    await storeMessageInCanister('user', userMessage);

    try {
      // Send to Omnidimension AI
      const aiResponse = await omnidimensionService.sendMessage(userMessage, conversationId);

      if (aiResponse.conversation_id) {
        setConversationId(aiResponse.conversation_id);
      }

      // Add AI response
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);

      // Store AI response in canister
      await storeMessageInCanister('ai', aiResponse.reply);

      // Speak AI response if voice is enabled and supported
      if (enableVoice && canUseVoice && !isSpeaking) {
        // Clean the response for speech (remove markdown, etc.)
        const cleanedResponse = cleanTextForSpeech(aiResponse.reply);
        speak(cleanedResponse);
      }

      // Check if the response contains code and add it as a separate message
      if (aiResponse.reply.includes('```')) {
        const codeBlocks = extractCodeBlocks(aiResponse.reply);
        for (const codeBlock of codeBlocks) {
          const codeMsg: ChatMessage = {
            id: (Date.now() + Math.random()).toString(),
            type: 'code',
            content: codeBlock.code,
            timestamp: new Date(),
            codeLanguage: codeBlock.language,
            codeTitle: codeBlock.title,
          };

          setMessages(prev => [...prev, codeMsg]);
          await storeMessageInCanister('code', codeBlock.code, codeBlock.language, codeBlock.title);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
      onError?.('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, conversationId, storeMessageInCanister, onError]);

  // Extract code blocks from AI response
  const extractCodeBlocks = useCallback((text: string) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const codeBlocks: Array<{ code: string; language: string; title: string }> = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      const title = `${language.charAt(0).toUpperCase() + language.slice(1)} Example`;

      codeBlocks.push({ code, language, title });
    }

    return codeBlocks;
  }, []);

  // Clean text for speech synthesis
  const cleanTextForSpeech = useCallback((text: string) => {
    // Remove markdown formatting
    let cleanText = text
      .replace(/```[\s\S]*?```/g, ' code example ') // Replace code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code backticks
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Limit length for speech (too long responses are not good for TTS)
    if (cleanText.length > 500) {
      const sentences = cleanText.split(/[.!?]+/);
      cleanText = sentences.slice(0, 3).join('. ') + '.';
    }

    return cleanText;
  }, []);

  // Clear chat history
  const clearHistory = useCallback(async () => {
    setMessages([]);
    setConversationId('');

    if (canisterInitialized) {
      try {
        await userCanisterService.clearHistory();
      } catch (error) {
        console.error('Failed to clear canister history:', error);
      }
    }
  }, [canisterInitialized]);

  // Add initial AI greeting if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const greetingMsg: ChatMessage = {
        id: '1',
        type: 'ai',
        content: 'Hello! I\'m your AI tutor for the Internet Computer. I can help you learn ICP, Motoko, and Rust. What would you like to explore today?',
        timestamp: new Date(),
      };
      setMessages([greetingMsg]);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearHistory,
    canisterInitialized,
    isAIConfigured: omnidimensionService.isConfigured(),

    // Voice functionality
    isListening,
    isSpeaking,
    isVoiceSupported,
    hasVoicePermission,
    currentTranscript,
    toggleListening,
    speak,
    stopSpeaking,
    canUseVoice: enableVoice && canUseVoice
  };
};
