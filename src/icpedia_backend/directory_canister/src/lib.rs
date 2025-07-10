use candid::Principal;
use ic_cdk::{
    api::management_canister::main::{
        create_canister, install_code, CanisterSettings, CreateCanisterArgument,
        InstallCodeArgument,
    },
    call, caller, id, storage,
};
use serde::{Deserialize, Serialize};
use shared::{DirectoryError, UserCanisterEntry};
use std::collections::HashMap;

/// Directory canister state
#[derive(Default, Clone, candid::CandidType, Serialize, Deserialize)]
pub struct DirectoryState {
    /// Maps user Principal to their canister information
    pub user_registry: HashMap<Principal, UserCanisterEntry>,
    /// Admin principals who can manage the directory
    pub admins: Vec<Principal>,
    /// WASM module for user canisters
    pub user_canister_wasm: Vec<u8>,
}

// Thread-local storage for the directory state
thread_local! {
    static STATE: std::cell::RefCell<DirectoryState> = std::cell::RefCell::new(DirectoryState::default());
}

/// Initialize the directory canister
#[ic_cdk::init]
fn init() {
    let caller = caller();
    STATE.with(|state| {
        state.borrow_mut().admins.push(caller);
    });
}

/// Get or create a user canister for the authenticated caller
#[ic_cdk::update]
pub async fn get_or_create_user_canister(username: String) -> Result<Principal, DirectoryError> {
    let user_principal = caller();

    // Check if user already has a canister
    let existing_canister =
        STATE.with(|state| state.borrow().user_registry.get(&user_principal).cloned());

    if let Some(entry) = existing_canister {
        return Ok(entry.canister_id);
    }

    // Create new canister for the user
    create_user_canister(user_principal, username).await
}

/// Create a new user canister
async fn create_user_canister(
    user_principal: Principal,
    username: String,
) -> Result<Principal, DirectoryError> {
    // Get the user canister WASM
    let wasm_module = STATE.with(|state| state.borrow().user_canister_wasm.clone());

    if wasm_module.is_empty() {
        return Err(DirectoryError::CanisterCreationFailed(
            "User canister WASM not uploaded".to_string(),
        ));
    }

    // Set canister settings with user as controller
    let settings = CanisterSettings {
        controllers: Some(vec![user_principal, id()]), // User and directory canister as controllers
        compute_allocation: None,
        memory_allocation: None,
        freezing_threshold: None,
        reserved_cycles_limit: None,
    };

    // Create the canister
    let create_args = CreateCanisterArgument {
        settings: Some(settings),
    };

    let (canister_record,) = create_canister(create_args, 1_000_000_000_000u128)
        .await
        .map_err(|e| {
            DirectoryError::CanisterCreationFailed(format!("Failed to create canister: {:?}", e))
        })?;

    let canister_id = canister_record.canister_id;

    // Prepare installation arguments
    let init_args = candid::encode_args((user_principal, username.clone())).map_err(|e| {
        DirectoryError::InstallationFailed(format!("Failed to encode init args: {:?}", e))
    })?;

    // Install the user canister WASM
    let install_args = InstallCodeArgument {
        mode: ic_cdk::api::management_canister::main::CanisterInstallMode::Install,
        canister_id,
        wasm_module: wasm_module,
        arg: init_args,
    };

    install_code(install_args).await.map_err(|e| {
        DirectoryError::InstallationFailed(format!("Failed to install code: {:?}", e))
    })?;

    // Register the canister in our directory
    let entry = UserCanisterEntry {
        canister_id,
        created_at: ic_cdk::api::time(),
        username,
    };

    STATE.with(|state| {
        state
            .borrow_mut()
            .user_registry
            .insert(user_principal, entry);
    });

    Ok(canister_id)
}

/// Get user canister ID if it exists
#[ic_cdk::query]
pub fn get_user_canister(user_principal: Principal) -> Option<Principal> {
    STATE.with(|state| {
        state
            .borrow()
            .user_registry
            .get(&user_principal)
            .map(|entry| entry.canister_id)
    })
}

/// Get all registered users (admin only)
#[ic_cdk::query]
pub fn get_all_users() -> Result<Vec<(Principal, UserCanisterEntry)>, DirectoryError> {
    let caller = caller();

    STATE.with(|state| {
        let state_ref = state.borrow();
        if !state_ref.admins.contains(&caller) {
            return Err(DirectoryError::Unauthorized);
        }

        Ok(state_ref
            .user_registry
            .iter()
            .map(|(k, v)| (*k, v.clone()))
            .collect())
    })
}

/// Upload user canister WASM (admin only)
#[ic_cdk::update]
pub fn upload_user_canister_wasm(wasm_module: Vec<u8>) -> Result<(), DirectoryError> {
    let caller = caller();

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        if !state_mut.admins.contains(&caller) {
            return Err(DirectoryError::Unauthorized);
        }

        state_mut.user_canister_wasm = wasm_module;
        Ok(())
    })
}

/// Add admin (existing admin only)
#[ic_cdk::update]
pub fn add_admin(new_admin: Principal) -> Result<(), DirectoryError> {
    let caller = caller();

    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        if !state_mut.admins.contains(&caller) {
            return Err(DirectoryError::Unauthorized);
        }

        if !state_mut.admins.contains(&new_admin) {
            state_mut.admins.push(new_admin);
        }
        Ok(())
    })
}

/// Check if a user canister exists and return detailed information
#[ic_cdk::query]
pub fn check_user_canister_exists(
    user_principal: Principal,
) -> Result<Option<UserCanisterEntry>, DirectoryError> {
    STATE.with(|state| {
        let entry = state.borrow().user_registry.get(&user_principal).cloned();

        Ok(entry)
    })
}

/// Get user canister information by principal (returns full entry)
#[ic_cdk::query]
pub fn get_user_canister_info(user_principal: Principal) -> Option<UserCanisterEntry> {
    STATE.with(|state| state.borrow().user_registry.get(&user_principal).cloned())
}

/// Check if user canister exists (simple boolean response)
#[ic_cdk::query]
pub fn user_canister_exists(user_principal: Principal) -> bool {
    STATE.with(|state| state.borrow().user_registry.contains_key(&user_principal))
}

/// Verify that a user canister exists and is accessible
#[ic_cdk::update]
pub async fn verify_user_canister(
    user_principal: Principal,
) -> Result<(bool, Option<String>), DirectoryError> {
    let canister_info =
        STATE.with(|state| state.borrow().user_registry.get(&user_principal).cloned());

    match canister_info {
        None => Ok((false, None)),
        Some(entry) => {
            // Try to ping the canister to verify it's accessible
            match call::<(), (String,)>(entry.canister_id, "ping", ()).await {
                Ok((response,)) => Ok((true, Some(response))),
                Err(_) => Ok((
                    false,
                    Some("Canister registered but not accessible".to_string()),
                )),
            }
        }
    }
}

/// Pre-upgrade hook to save state
#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    STATE.with(|state| {
        let state_data = state.borrow().clone();
        storage::stable_save((state_data,)).expect("Failed to save state before upgrade");
    });
}

/// Post-upgrade hook to restore state
#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let (state_data,): (DirectoryState,) =
        storage::stable_restore().expect("Failed to restore state after upgrade");

    STATE.with(|state| {
        *state.borrow_mut() = state_data;
    });
}

// Export candid interface
ic_cdk::export_candid!();
