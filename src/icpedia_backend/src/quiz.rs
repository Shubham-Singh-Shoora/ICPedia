// use enum Difficulty from quis_data.rs 
use crate::quiz_data::Difficulty;

use serde::{Deserialize, Serialize};
use candid::CandidType;

//progress report struct
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct UserQuizState {
    pub current_question_id: u32,
    pub current_difficulty: Difficulty,
    pub score: u32,
    pub history: Vec<(u32, bool)>, // (question_id, correct/incorrect)
}


// quiz logic 
pub fn next_difficulty(prev_correct: bool, prev_difficulty: &Difficulty) -> Difficulty {
    match (prev_correct, prev_difficulty) {
        (false, Difficulty::Hard) => Difficulty::Medium,
        (false, Difficulty::Medium) => Difficulty::Easy,
        (true, Difficulty::Easy) => Difficulty::Medium,
        (true, Difficulty::Medium) => Difficulty::Hard,
        _ => prev_difficulty.clone(),
    }
}