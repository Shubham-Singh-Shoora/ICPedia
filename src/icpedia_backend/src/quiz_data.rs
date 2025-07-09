use candid::CandidType;
use serde::{Deserialize, Serialize}; // for stable versions

#[derive(Clone, PartialEq, Debug, CandidType, Deserialize,Serialize)]
pub enum Difficulty {
    Easy,
    Medium,
    Hard,
}


#[derive(Clone, Debug, CandidType, Deserialize,Serialize)]
pub struct Question {
    pub id: u32,
    pub topic: String,
    pub difficulty: Difficulty,
    pub question: String,
    pub options: Vec<String>,
    pub answer: String,
}

pub fn get_questions() -> Vec<Question> {
    let mut questions: Vec<Question> = Vec::new();
    let mut id: u32 = 1;

    // Define topics and difficulty levels
    let topics = vec!["ICP", "Motoko", "Rust"];
    let difficulties = vec![Difficulty::Easy, Difficulty::Medium, Difficulty::Hard];

    for topic in topics {
        for difficulty in &difficulties {
            for i in 1..=5 {
                let (question_text, options, answer) = generate_question(topic, difficulty, i);
                questions.push(Question {
                    id,
                    topic: topic.to_string(),
                    difficulty: difficulty.clone(),
                    question: question_text,
                    options,
                    answer,
                });
                id += 1;
            }
        }
    }

    questions
}

fn generate_question(topic: &str, difficulty: &Difficulty, index: u32) -> (String, Vec<String>, String) {
    match (topic, difficulty, index) {
        // -------------------
        // ICP Questions
        // -------------------
        
    ("ICP", Difficulty::Easy, 1) => (
        "What is the full form of ICP?".to_string(),
    vec![
        "Internet Control Protocol",
        "Internet Computer Protocol",
        "Interconnected Cloud Platform",
        "Intelligent Code Platform"
    ].into_iter().map(String::from).collect(),
    "Internet Computer Protocol".to_string()
    ),
    ("ICP", Difficulty::Easy, 2) => (
    "What is a canister in ICP?".to_string(),
    vec![
        "A smart contract",
        "A Docker container",
        "A database",
        "A frontend file"
    ].into_iter().map(String::from).collect(),
    "A smart contract".to_string()
    ),
    ("ICP", Difficulty::Easy, 3) => (
    "Which programming language is natively supported in ICP?".to_string(),
    vec!["Python", "Rust", "Motoko", "Java"]
        .into_iter().map(String::from).collect(),
    "Motoko".to_string()
    ),
    ("ICP", Difficulty::Easy, 4) => (
    "Which company developed ICP?".to_string(),
    vec!["Google", "Microsoft", "DFINITY", "Facebook"]
        .into_iter().map(String::from).collect(),
    "DFINITY".to_string()
    ),
    ("ICP", Difficulty::Easy, 5) => (
    "ICP runs on which type of infrastructure?".to_string(),
    vec!["Centralized servers", "Traditional cloud", "Blockchain", "Local networks"]
        .into_iter().map(String::from).collect(),
    "Blockchain".to_string()
    ),

    ("ICP", Difficulty::Medium, 1) => (
    "Which tool is used to deploy ICP canisters locally?".to_string(),
    vec!["Vite", "Webpack", "dfx", "Node"]
        .into_iter().map(String::from).collect(),
    "dfx".to_string()
    ),
    ("ICP", Difficulty::Medium, 2) => (
    "Which file defines the canister interface?".to_string(),
    vec!["index.js", "Cargo.toml", "canister.did", "dfx.json"]
        .into_iter().map(String::from).collect(),
    "canister.did".to_string()
    ),
    ("ICP", Difficulty::Medium, 3) => (
    "What is the default port used by local ICP network?".to_string(),
    vec!["8000", "8001", "4943", "3000"]
        .into_iter().map(String::from).collect(),
    "4943".to_string()
    ),
    ("ICP", Difficulty::Medium, 4) => (
    "What command creates a new canister in dfx?".to_string(),
    vec!["dfx init", "dfx build", "dfx new", "dfx canister create"]
        .into_iter().map(String::from).collect(),
    "dfx canister create".to_string()
    ),
    ("ICP", Difficulty::Medium, 5) => (
    "What is the command to generate TypeScript bindings from DID?".to_string(),
    vec!["dfx generate", "dfx compile", "dfx build", "dfx deploy"]
        .into_iter().map(String::from).collect(),
    "dfx generate".to_string()
    ),

    ("ICP", Difficulty::Hard, 1) => (
    "What format is used to serialize calls between canisters?".to_string(),
    vec!["JSON", "WASM", "Candid", "Base64"]
        .into_iter().map(String::from).collect(),
    "Candid".to_string()
    ),
    ("ICP", Difficulty::Hard, 2) => (
    "How does ICP achieve scalability?".to_string(),
    vec!["Central servers", "Horizontal scaling", "Subnet replication", "Sharding"]
        .into_iter().map(String::from).collect(),
    "Subnet replication".to_string()
    ),
    ("ICP", Difficulty::Hard, 3) => (
    "What is the function of the NNS canister in ICP?".to_string(),
    vec!["Governance", "Frontend hosting", "Auth", "File storage"]
        .into_iter().map(String::from).collect(),
    "Governance".to_string()
    ),
    ("ICP", Difficulty::Hard, 4) => (
    "Which keyword in Motoko defines a shared async function?".to_string(),
    vec!["actor", "func", "async", "shared"]
        .into_iter().map(String::from).collect(),
    "shared".to_string()
    ),
    ("ICP", Difficulty::Hard, 5) => (
    "What is the DFINITY Foundation's role in ICP?".to_string(),
    vec!["Token minting", "Wallet provider", "Protocol maintenance", "None"]
        .into_iter().map(String::from).collect(),
    "Protocol maintenance".to_string()
    ),
 
        // -------------------
        //  Motoko Questions
        // -------------------
        ("Motoko", Difficulty::Easy, 1) => (
            "Motoko is a language for what platform?".to_string(),
            vec!["Ethereum", "ICP", "Solana", "Bitcoin"]
            .into_iter().map(String::from).collect(),
            "ICP".to_string()
    ),
    ("Motoko", Difficulty::Easy, 2) => ( 
        "Which keyword defines a function in Motoko?".to_string(),
        vec!["function", "fun", "func", "def"]
        .into_iter().map(String::from).collect(),
        "func".to_string()
    ),
    ("Motoko", Difficulty::Easy, 3) => (
        "What is the file extension for Motoko files?".to_string(),
        vec![".mo", ".moko", ".mot", ".rs"]
        .into_iter().map(String::from).collect(),
        ".mo".to_string()
    ),
    ("Motoko", Difficulty::Easy, 4) => (
    "How do you declare a variable in Motoko?".to_string(),
    vec!["let", "var", "mut", "const"]
    .into_iter().map(String::from).collect(),
    "let".to_string()
    ),
    ("Motoko", Difficulty::Easy, 5) => (
    "Which type is used for text in Motoko?".to_string(),
    vec!["String", "Text", "Char", "str"]
    .into_iter().map(String::from).collect(),
    "Text".to_string()
    ),

    ("Motoko", Difficulty::Medium, 1) => (
    "What does 'actor' mean in Motoko?".to_string(),
    vec!["A class", "A struct", "A canister object", "A module"]
    .into_iter().map(String::from).collect(),
    "A canister object".to_string()
    ),
    ("Motoko", Difficulty::Medium, 2) => (
    "What is the keyword for optional types in Motoko?".to_string(),
    vec!["option", "maybe", "?", "opt"]
    .into_iter().map(String::from).collect(),
    "opt".to_string()
    ),
    ("Motoko", Difficulty::Medium, 3) => (
    "Which Motoko type is used to represent a list?".to_string(),
    vec!["List", "Array", "Vec", "[T]"]
    .into_iter().map(String::from).collect(),
    "Array".to_string()
    ),
    ("Motoko", Difficulty::Medium, 4) => (
    "Which keyword allows asynchronous calls in Motoko?".to_string(),
    vec!["await", "shared", "async", "actor"]
        .into_iter().map(String::from).collect(),
    "async".to_string()
    ),
    ("Motoko", Difficulty::Medium, 5) => (
    "How do you import a library in Motoko?".to_string(),
    vec!["import x from y", "include x", "use x", "import x \"lib\";"]
        .into_iter().map(String::from).collect(),
    "import x \"lib\";".to_string()
    ),

    ("Motoko", Difficulty::Hard, 1) => (
    "What is the return type of a shared function in Motoko?".to_string(),
    vec!["async T", "T", "shared T", "actor T"]
        .into_iter().map(String::from).collect(),
    "async T".to_string()
    ),
    ("Motoko", Difficulty::Hard, 2) => (
    "Which method is used to serialize data in Motoko?".to_string(),
    vec!["toText()", "toJson()", "encode()", "Candid.encode()"]
        .into_iter().map(String::from).collect(),
    "Candid.encode()".to_string()
    ),
    ("Motoko", Difficulty::Hard, 3) => (
    "Which module provides timer functionalities in Motoko?".to_string(),
    vec!["Timers", "Time", "Clock", "Timer"]
        .into_iter().map(String::from).collect(),
    "Timer".to_string()
    ),
    ("Motoko", Difficulty::Hard, 4) => (
    "How is an async shared function declared in Motoko?".to_string(),
    vec!["shared async func", "actor func async", "async shared func", "shared func async"]
        .into_iter().map(String::from).collect(),
    "shared func async".to_string()
    ),
    ("Motoko", Difficulty::Hard, 5) => (
    "What happens when you call another actor in Motoko?".to_string(),
    vec!["Synchronous call", "Blocking call", "Asynchronous call", "No call possible"]
        .into_iter().map(String::from).collect(),
    "Asynchronous call".to_string()
    ),
        

    // -------------------
    // Rust Questions
    // -------------------
    ("Rust", Difficulty::Easy, 1) => (
        "Which keyword defines a variable in Rust?".to_string(),
        vec!["let", "var", "const", "define"].into_iter().map(String::from).collect(),
        "let".to_string()
    ),
    ("Rust", Difficulty::Easy, 2) => (
        "What does the `mut` keyword do in Rust?".to_string(),
        vec!["Makes variable private", "Makes variable mutable", "Deletes variable", "Imports module"]
            .into_iter().map(String::from).collect(),
        "Makes variable mutable".to_string()
    ),
    ("Rust", Difficulty::Easy, 3) => (
        "What type system does Rust have?".to_string(),
        vec!["Dynamic", "Static", "Flexible", "Loose"]
            .into_iter().map(String::from).collect(),
        "Static".to_string()
    ),
    ("Rust", Difficulty::Easy, 4) => (
        "Which data type is used for text in Rust?".to_string(),
        vec!["Text", "String", "str", "text"]
            .into_iter().map(String::from).collect(),
        "String".to_string()
    ),
    ("Rust", Difficulty::Easy, 5) => (
        "Which keyword is used to define a function?".to_string(),
        vec!["fn", "function", "def", "fun"]
            .into_iter().map(String::from).collect(),
        "fn".to_string()
    ),

    ("Rust", Difficulty::Medium, 1) => (
        "What is ownership in Rust?".to_string(),
        vec!["Memory model", "Type of variable", "Garbage collector", "None"]
            .into_iter().map(String::from).collect(),
        "Memory model".to_string()
    ),
    ("Rust", Difficulty::Medium, 2) => (
        "What does `clone()` do in Rust?".to_string(),
        vec!["Duplicates memory", "Shares pointer", "Mutates data", "Deletes reference"]
            .into_iter().map(String::from).collect(),
        "Duplicates memory".to_string()
    ),
    ("Rust", Difficulty::Medium, 3) => (
        "Which type allows multiple types in Rust?".to_string(),
        vec!["Array", "Tuple", "Enum", "Union"]
            .into_iter().map(String::from).collect(),
        "Enum".to_string()
    ),
    ("Rust", Difficulty::Medium, 4) => (
        "What is the keyword for error handling in Rust?".to_string(),
        vec!["catch", "throw", "match", "Result"]
            .into_iter().map(String::from).collect(),
        "Result".to_string()
    ),
    ("Rust", Difficulty::Medium, 5) => (
        "Which tool builds Rust projects?".to_string(),
        vec!["dfx", "cargo", "build", "rustc"]
            .into_iter().map(String::from).collect(),
        "cargo".to_string()
    ),

    ("Rust", Difficulty::Hard, 1) => (
        "What is the purpose of lifetimes in Rust?".to_string(),
        vec!["Concurrency", "Memory safety", "Speed", "Inheritance"]
            .into_iter().map(String::from).collect(),
        "Memory safety".to_string()
    ),
    ("Rust", Difficulty::Hard, 2) => (
        "What trait allows formatting with `{}`?".to_string(),
        vec!["Debug", "Clone", "Display", "Format"]
            .into_iter().map(String::from).collect(),
        "Display".to_string()
    ),
    ("Rust", Difficulty::Hard, 3) => (
        "Which macro handles errors in Rust?".to_string(),
        vec!["panic!", "unwrap!", "try!", "expect!"]
            .into_iter().map(String::from).collect(),
        "panic!".to_string()
    ),
    ("Rust", Difficulty::Hard, 4) => (
        "What is a smart pointer in Rust?".to_string(),
        vec!["A function", "An enum", "A struct that behaves like a pointer", "A string"]
            .into_iter().map(String::from).collect(),
        "A struct that behaves like a pointer".to_string()
    ),
    ("Rust", Difficulty::Hard, 5) => (
        "Which crate is used for web assembly in Rust ICP apps?".to_string(),
        vec!["serde", "wasm_bindgen", "ic_cdk", "tokio"]
            .into_iter().map(String::from).collect(),
        "ic_cdk".to_string()
    ),


        _ => (
            "Placeholder question".to_string(),
            vec!["A", "B", "C", "D"].into_iter().map(String::from).collect(),
            "A".to_string()
        )
    }
}

