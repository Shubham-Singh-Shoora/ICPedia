
#[cfg(test)]
mod export {
    use super::*;
    use candid::export_service;

    #[test]
    fn export_did() {
        export_service!();
        std::fs::write("icpedia_backend.did", __export_service()).unwrap();
    }
}

mod quiz;
mod quiz_data;

use quiz::*;
use quiz_data::*;
use std::collections::HashMap;
use ic_cdk::{query, update};
use candid::Principal;


use std::cell::RefCell;

thread_local! {
    static USERS: RefCell<HashMap<Principal, UserQuizState>> = RefCell::new(HashMap::new());
}


#[update]
fn submit_answer(question_id: u32, answer: String) -> String {
    let caller = ic_cdk::caller();
    let questions = get_questions();

    USERS.with(|users| {
        let mut users = users.borrow_mut();

        let user_state = users.entry(caller).or_insert(UserQuizState {
            current_question_id: 0,
            current_difficulty: Difficulty::Easy,
            score: 0,
            history: vec![],
        });

        let correct = questions.iter()
            .find(|q| q.id == question_id)
            .map(|q| q.answer == answer)
            .unwrap_or(false);

        user_state.history.push((question_id, correct));
        if correct {
            user_state.score += 1;
        }

        user_state.current_difficulty = next_difficulty(correct, &user_state.current_difficulty);

        format!(
            "Answer is {}. New difficulty: {:?}",
            if correct { "Good job , Correct answer !" } else { "Oops , Incorrect answer !" },
            user_state.current_difficulty
        )
    })
}

#[update]
fn get_next_question(topic: String) -> Option<Question> {
    let caller = ic_cdk::caller();

    // Access USERS safely using `with`
    let mut next_question: Option<Question> = None;

    USERS.with(|users| {
        let mut users = users.borrow_mut();

        // Initialize user state if not exists
        let user_state = users.entry(caller).or_insert(UserQuizState {
            current_question_id: 0,
            current_difficulty: Difficulty::Easy,
            score: 0,
            history: vec![],
        });

        // Get all questions
        let questions = get_questions();

        // Filter based on topic and current difficulty
        let filtered: Vec<&Question> = questions.iter()
            .filter(|q| q.topic == topic && q.difficulty == user_state.current_difficulty)
            .collect();

        // Find a question not already attempted
        for q in filtered {
            if !user_state.history.iter().any(|(id, _)| *id == q.id) {
                user_state.current_question_id = q.id;
                next_question = Some(q.clone());
                break;
            }
        }
    });

    next_question
}



#[query]
fn get_user_progress() -> Option<UserQuizState> {
    let caller = ic_cdk::caller();
    USERS.with(|users| users.borrow().get(&caller).cloned())
}

