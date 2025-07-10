import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { _SERVICE, ChatMessage, MessageType, UserError } from '../declarations/user_canister';
import { idlFactory } from '../declarations/user_canister/index.js';

export type Result<T, E> = { Ok: T } | { Err: E };

export class UserCanisterService {
    private actor: _SERVICE | null = null;
    private agent: HttpAgent | null = null;
    private authClient: AuthClient | null = null;

    async init(canisterId: string) {
        // Skip initialization if canister ID is not properly configured
        if (!canisterId || canisterId === 'your_user_canister_id_here') {
            console.warn('User canister ID not configured. Message storage will be disabled.');
            return;
        }

        try {
            // Initialize auth client
            this.authClient = await AuthClient.create();

            // Create agent
            const host = import.meta.env.VITE_DFX_NETWORK === 'local'
                ? `http://127.0.0.1:${import.meta.env.VITE_LOCAL_REPLICA_PORT || 4943}`
                : 'https://ic0.app';

            this.agent = new HttpAgent({
                host,
                identity: this.authClient.getIdentity()
            });

            // Fetch root key for local development
            if (import.meta.env.VITE_DFX_NETWORK === 'local') {
                await this.agent.fetchRootKey();
            }

            // Test connection before creating actor
            try {
                await this.agent.status();
            } catch (error) {
                console.warn('Cannot connect to ICP replica. Please ensure dfx is running with: dfx start');
                throw new Error('ICP replica not available. Run "dfx start" to start local development.');
            }

            // Create actor using generated declarations
            this.actor = Actor.createActor<_SERVICE>(idlFactory, {
                agent: this.agent,
                canisterId,
            });

            // Test the actor with a ping
            try {
                await this.actor.ping();
                console.log('User canister connection successful');
            } catch (error) {
                console.warn('User canister ping failed. Canister may not be deployed or accessible.');
                throw new Error('User canister not accessible. Please deploy with: dfx deploy user_canister');
            }

        } catch (error) {
            console.error('Error initializing user canister service:', error);
            throw error;
        }
    }

    async storeMessage(
        messageType: 'User' | 'AI' | 'Code',
        content: string,
        codeLanguage?: string,
        codeTitle?: string
    ): Promise<ChatMessage> {
        if (!this.actor) {
            throw new Error('Canister not initialized');
        }

        const messageTypeVariant: MessageType = { [messageType]: null } as MessageType;

        try {
            const result = await this.actor.store_chat_message(
                messageTypeVariant,
                content,
                codeLanguage ? [codeLanguage] : [],
                codeTitle ? [codeTitle] : []
            );

            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(`Canister error: ${JSON.stringify(result.Err)}`);
            }
        } catch (error) {
            console.error('Error storing message:', error);
            throw error;
        }
    }

    async getMessages(limit?: number): Promise<ChatMessage[]> {
        if (!this.actor) {
            throw new Error('Canister not initialized');
        }

        try {
            const result = await this.actor.get_chat_messages(
                limit ? [limit] : []
            );

            if ('Ok' in result) {
                return result.Ok;
            } else {
                throw new Error(`Canister error: ${JSON.stringify(result.Err)}`);
            }
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }

    async clearHistory(): Promise<void> {
        if (!this.actor) {
            throw new Error('Canister not initialized');
        }

        try {
            const result = await this.actor.clear_chat_history();

            if ('Err' in result) {
                throw new Error(`Canister error: ${JSON.stringify(result.Err)}`);
            }
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    }

    async ping(): Promise<string> {
        if (!this.actor) {
            throw new Error('Canister not initialized');
        }

        try {
            return await this.actor.ping();
        } catch (error) {
            console.error('Error pinging canister:', error);
            throw error;
        }
    }

    isInitialized(): boolean {
        return this.actor !== null;
    }
}

export const userCanisterService = new UserCanisterService();
