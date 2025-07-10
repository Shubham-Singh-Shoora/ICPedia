use candid::Principal;
use ic_cdk::{caller, storage};
use serde::{Deserialize, Serialize};
use shared::{ChatMessage, MessageType, UserError, UserProfile};
use std::collections::HashMap;

/// User canister state
#[derive(Default, Clone, candid::CandidType, Serialize, Deserialize)]
pub struct UserState {
    pub profile: UserProfile,
    pub initialized: bool,
    pub chat_messages: Vec<ChatMessage>,
}

// Thread-local storage for user state
thread_local! {
    static STATE: std::cell::RefCell<UserState> = std::cell::RefCell::new(UserState::default());
}

/// Initialize the user canister with owner and username
#[ic_cdk::init]
fn init(owner: Principal, username: String) {
    let now = ic_cdk::api::time();

    let profile = UserProfile {
        owner,
        username,
        quizzes_completed: 0,
        videos_watched: 0,
        xp: 0,
        learning_streak: 0,
        created_at: now,
        last_activity: now,
    };

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        state_mut.profile = profile;
        state_mut.initialized = true;
    });
}

/// Check if caller is authorized (must be the owner)
fn check_authorization() -> Result<(), UserError> {
    let caller = caller();

    STATE.with(|state| {
        let state_ref = state.borrow();
        if !state_ref.initialized {
            return Err(UserError::NotInitialized);
        }

        if state_ref.profile.owner != caller {
            return Err(UserError::Unauthorized);
        }

        Ok(())
    })
}

/// Complete a quiz and update user profile
#[ic_cdk::update]
pub fn complete_quiz(quiz_xp: u32) -> Result<UserProfile, UserError> {
    check_authorization()?;

    if quiz_xp == 0 || quiz_xp > 1000 {
        return Err(UserError::InvalidInput("Invalid XP amount".to_string()));
    }

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        let profile = &mut state_mut.profile;

        profile.quizzes_completed += 1;
        profile.xp += quiz_xp;
        profile.last_activity = ic_cdk::api::time();

        // Update learning streak logic (simplified)
        update_learning_streak(profile);

        Ok(profile.clone())
    })
}

/// Watch a video and update user profile
#[ic_cdk::update]
pub fn watch_video(video_xp: u32) -> Result<UserProfile, UserError> {
    check_authorization()?;

    if video_xp == 0 || video_xp > 500 {
        return Err(UserError::InvalidInput("Invalid XP amount".to_string()));
    }

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        let profile = &mut state_mut.profile;

        profile.videos_watched += 1;
        profile.xp += video_xp;
        profile.last_activity = ic_cdk::api::time();

        // Update learning streak logic (simplified)
        update_learning_streak(profile);

        Ok(profile.clone())
    })
}

/// Get user profile
#[ic_cdk::query]
pub fn get_profile() -> Result<UserProfile, UserError> {
    check_authorization()?;

    STATE.with(|state| {
        let state_ref = state.borrow();
        Ok(state_ref.profile.clone())
    })
}

/// Get public profile (minimal info, no authorization required)
#[ic_cdk::query]
pub fn get_public_profile() -> Result<(String, u32, u32), UserError> {
    STATE.with(|state| {
        let state_ref = state.borrow();
        if !state_ref.initialized {
            return Err(UserError::NotInitialized);
        }

        let profile = &state_ref.profile;
        Ok((
            profile.username.clone(),
            profile.xp,
            profile.learning_streak,
        ))
    })
}

/// Update username
#[ic_cdk::update]
pub fn update_username(new_username: String) -> Result<UserProfile, UserError> {
    check_authorization()?;

    if new_username.is_empty() || new_username.len() > 50 {
        return Err(UserError::InvalidInput(
            "Invalid username length".to_string(),
        ));
    }

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        let profile = &mut state_mut.profile;

        profile.username = new_username;
        profile.last_activity = ic_cdk::api::time();

        Ok(profile.clone())
    })
}

/// Reset learning progress (for testing or user request)
#[ic_cdk::update]
pub fn reset_progress() -> Result<UserProfile, UserError> {
    check_authorization()?;

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        let profile = &mut state_mut.profile;

        profile.quizzes_completed = 0;
        profile.videos_watched = 0;
        profile.xp = 0;
        profile.learning_streak = 0;
        profile.last_activity = ic_cdk::api::time();

        Ok(profile.clone())
    })
}

/// Helper function to update learning streak
fn update_learning_streak(profile: &mut UserProfile) {
    let now = ic_cdk::api::time();
    let one_day_nanos = 24 * 60 * 60 * 1_000_000_000; // 1 day in nanoseconds

    // Simplified streak logic: if last activity was more than 2 days ago, reset streak
    if now.saturating_sub(profile.last_activity) > (2 * one_day_nanos) {
        profile.learning_streak = 1;
    } else if now.saturating_sub(profile.last_activity) > one_day_nanos {
        // If it's been more than a day but less than 2, increment streak
        profile.learning_streak += 1;
    }
    // If activity is within the same day, don't change streak
}

/// Get canister owner
#[ic_cdk::query]
pub fn get_owner() -> Result<Principal, UserError> {
    STATE.with(|state| {
        let state_ref = state.borrow();
        if !state_ref.initialized {
            return Err(UserError::NotInitialized);
        }
        Ok(state_ref.profile.owner)
    })
}

/// Check if the canister is properly initialized and healthy
#[ic_cdk::query]
pub fn canister_status() -> Result<(bool, String, u64), UserError> {
    STATE.with(|state| {
        let state_ref = state.borrow();
        if !state_ref.initialized {
            return Ok((false, "Not initialized".to_string(), 0));
        }

        Ok((
            true,
            state_ref.profile.username.clone(),
            state_ref.profile.created_at,
        ))
    })
}

/// Check if canister exists and is accessible (no authorization required)
#[ic_cdk::query]
pub fn ping() -> String {
    STATE.with(|state| {
        let state_ref = state.borrow();
        if state_ref.initialized {
            format!("User canister active for: {}", state_ref.profile.username)
        } else {
            "User canister exists but not initialized".to_string()
        }
    })
}

/// Store a chat message
#[ic_cdk::update]
pub fn store_chat_message(
    message_type: MessageType,
    content: String,
    code_language: Option<String>,
    code_title: Option<String>,
) -> Result<ChatMessage, UserError> {
    check_authorization()?;

    if content.is_empty() || content.len() > 10000 {
        return Err(UserError::InvalidInput(
            "Invalid message content".to_string(),
        ));
    }

    let message = ChatMessage {
        id: format!("{}", ic_cdk::api::time()),
        message_type,
        content,
        timestamp: ic_cdk::api::time(),
        code_language,
        code_title,
    };

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        state_mut.chat_messages.push(message.clone());

        // Keep only the last 1000 messages to prevent storage overflow
        if state_mut.chat_messages.len() > 1000 {
            state_mut.chat_messages.drain(0..100);
        }

        // Update last activity
        state_mut.profile.last_activity = ic_cdk::api::time();

        Ok(message)
    })
}

/// Get recent chat messages
#[ic_cdk::query]
pub fn get_chat_messages(limit: Option<u32>) -> Result<Vec<ChatMessage>, UserError> {
    check_authorization()?;

    let limit = limit.unwrap_or(50).min(100) as usize;

    STATE.with(|state| {
        let state_ref = state.borrow();
        let messages = &state_ref.chat_messages;

        if messages.len() <= limit {
            Ok(messages.clone())
        } else {
            Ok(messages[messages.len() - limit..].to_vec())
        }
    })
}

/// Clear chat history
#[ic_cdk::update]
pub fn clear_chat_history() -> Result<(), UserError> {
    check_authorization()?;

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        state_mut.chat_messages.clear();
        state_mut.profile.last_activity = ic_cdk::api::time();
        Ok(())
    })
}

/// Pre-upgrade hook to save state to stable memory
#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    STATE.with(|state| {
        let state_data = state.borrow().clone();
        storage::stable_save((state_data,)).expect("Failed to save state before upgrade");
    });
}

/// Post-upgrade hook to restore state from stable memory
#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let (state_data,): (UserState,) =
        storage::stable_restore().expect("Failed to restore state after upgrade");

    STATE.with(|state| {
        *state.borrow_mut() = state_data;
    });
}

// Export candid interface
ic_cdk::export_candid!();
