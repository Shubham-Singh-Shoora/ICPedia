use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

/// Error types for directory canister operations
#[derive(CandidType, Deserialize, Debug)]
pub enum DirectoryError {
    Unauthorized,
    CanisterCreationFailed(String),
    InstallationFailed(String),
    InvalidPrincipal,
}

/// Error types for user canister operations
#[derive(CandidType, Deserialize, Debug)]
pub enum UserError {
    Unauthorized,
    InvalidInput(String),
    NotInitialized,
}

/// Chat message types for AI tutor conversations
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum MessageType {
    User,
    AI,
    Code,
}

/// Chat message structure for storing conversations
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ChatMessage {
    pub id: String,
    pub message_type: MessageType,
    pub content: String,
    pub timestamp: u64,
    pub code_language: Option<String>,
    pub code_title: Option<String>,
}

/// Registry entry for mapping user principal to their canister
#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct UserCanisterEntry {
    pub canister_id: Principal,
    pub created_at: u64,
    pub username: String,
}

/// User profile containing learning progress and statistics
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserProfile {
    pub owner: Principal,
    pub username: String,
    pub quizzes_completed: u32,
    pub videos_watched: u32,
    pub xp: u32,
    pub learning_streak: u32,
    pub created_at: u64,
    pub last_activity: u64,
}

impl Default for UserProfile {
    fn default() -> Self {
        Self {
            owner: Principal::anonymous(),
            username: String::new(),
            quizzes_completed: 0,
            videos_watched: 0,
            xp: 0,
            learning_streak: 0,
            created_at: 0,
            last_activity: 0,
        }
    }
}
