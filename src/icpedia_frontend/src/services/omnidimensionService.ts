// Omnidimension AI Service
export interface OmniChatRequest {
    message: string;
    conversation_id?: string;
}

export interface OmniChatResponse {
    reply: string;
    conversation_id: string;
    status: string;
    error?: string;
}

export class OmnidimensionService {
    private apiKey: string;
    private agentId: string;
    private baseUrl: string;
    private forceMockMode: boolean;

    constructor() {
        this.apiKey = import.meta.env.VITE_OMNI_API_KEY || '';
        this.agentId = import.meta.env.VITE_OMNI_AGENT_ID || '';
        this.baseUrl = import.meta.env.VITE_OMNI_BASE_URL || 'https://api.omnidimension.ai/v1/agent/';
        this.forceMockMode = import.meta.env.VITE_FORCE_MOCK_AI === 'true';

        if (!this.apiKey || !this.agentId || this.apiKey === 'your_omnidimension_api_key_here' || this.agentId === 'your_agent_id_here' || this.forceMockMode) {
            console.warn('Omnidimension API key or Agent ID not configured, or mock mode forced. Using mock responses for development.');
        }
    }

    async sendMessage(message: string, conversationId?: string): Promise<OmniChatResponse> {
        // Check if properly configured or if mock mode is forced
        if (!this.apiKey || !this.agentId || this.apiKey === 'your_omnidimension_api_key_here' || this.agentId === 'your_agent_id_here' || this.forceMockMode) {
            // Return mock response for development
            return this.getMockResponse(message, conversationId);
        }

        try {
            const requestBody: OmniChatRequest = {
                message,
                ...(conversationId && { conversation_id: conversationId })
            };

            // Add timeout and better error handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${this.baseUrl}${this.agentId}/chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return {
                reply: data.reply || 'Sorry, I couldn\'t process that request.',
                conversation_id: data.conversation_id || conversationId || '',
                status: data.status || 'success',
                error: data.error
            };
        } catch (error) {
            console.error('Error calling Omnidimension API:', error);

            // Check if it's a network error and provide helpful feedback
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                console.warn('Network error: API might be unreachable. Using mock response for development.');
            } else if (error instanceof Error && error.name === 'AbortError') {
                console.warn('API request timed out. Using mock response.');
            }

            // Fallback to mock response on error
            return this.getMockResponse(message, conversationId);
        }
    }

    private getMockResponse(message: string, conversationId?: string): OmniChatResponse {
        const mockResponses = [
            {
                keywords: ['canister', 'container'],
                response: `Great question about canisters! A canister is like a smart contract container on the Internet Computer. Think of it as a secure, tamper-proof application that can store data and execute code.

Here's a simple example:

\`\`\`motoko
import Debug "mo:base/Debug";

actor HelloCanister {
  public func greet(name: Text): async Text {
    "Hello, " # name # "! Welcome to the Internet Computer!"
  };
}
\`\`\`

Canisters can handle HTTP requests, store data permanently, and interact with other canisters. They're the building blocks of dApps on ICP!`
            },
            {
                keywords: ['motoko', 'language'],
                response: `Motoko is the native programming language for the Internet Computer! It's designed specifically for building canisters with features like:

• **Actor-based**: Each canister is an actor
• **Async/await**: Built-in support for asynchronous programming  
• **Orthogonal persistence**: Data automatically persists
• **Type safety**: Strong static typing

Here's a quick example:

\`\`\`motoko
import Map "mo:base/HashMap";
import Text "mo:base/Text";

actor UserRegistry {
  private var users = Map.HashMap<Text, Nat>(10, Text.equal, Text.hash);
  
  public func registerUser(name: Text): async Nat {
    let id = users.size();
    users.put(name, id);
    id
  };
}
\`\`\``
            },
            {
                keywords: ['rust', 'cdk'],
                response: `Rust is another excellent choice for canister development! The IC CDK (Canister Development Kit) provides all the tools you need.

Here's a simple Rust canister:

\`\`\`rust
use ic_cdk::export::candid::{candid_method, CandidType, Deserialize};
use ic_cdk_macros::{query, update};

#[derive(CandidType, Deserialize)]
struct User {
    name: String,
    age: u32,
}

#[update]
#[candid_method(update)]
fn create_user(name: String, age: u32) -> User {
    User { name, age }
}

#[query]
#[candid_method(query)]
fn get_user_info(user: User) -> String {
    format!("{} is {} years old", user.name, user.age)
}
\`\`\`

Rust offers memory safety, performance, and excellent tooling for canister development!`
            }
        ];

        // Find appropriate response based on keywords
        const lowerMessage = message.toLowerCase();
        let response = mockResponses.find(mock =>
            mock.keywords.some(keyword => lowerMessage.includes(keyword))
        );

        if (!response) {
            response = {
                keywords: [],
                response: `I understand you're asking about "${message}". While I don't have real AI connectivity right now (please configure your Omnidimension API credentials), I can tell you that the Internet Computer is a revolutionary blockchain that can host full-stack applications!

Key concepts to explore:
• **Canisters**: Smart contract containers
• **Motoko & Rust**: Programming languages for ICP
• **Candid**: Interface description language
• **DFX**: Development framework

Would you like to know more about any of these topics?`
            };
        }

        return {
            reply: response.response,
            conversation_id: conversationId || `mock-${Date.now()}`,
            status: 'success (mock)',
            error: undefined
        };
    }

    isConfigured(): boolean {
        if (this.forceMockMode) {
            return true; // Mock mode is always "configured"
        }
        return !!(this.apiKey && this.agentId &&
            this.apiKey !== 'your_omnidimension_api_key_here' &&
            this.agentId !== 'your_agent_id_here');
    }
}

export const omnidimensionService = new OmnidimensionService();
