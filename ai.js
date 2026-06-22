/* =========================
   Hillside AI - Pro (Lite Engine)
   ChatGPT-style offline logic (no API)
   ========================= */

const knowledge = {
"hello": "Hello! Welcome to Hillside AI.",
"hi": "Hello there.",
"hey": "Hi there! How can I help you?",

"how are you": "I am fine. I am Hillside AI ready to help you learn.",

"what is ai": "Artificial Intelligence enables computers to perform tasks that normally require human-like reasoning, learning, and decision-making.",
"what is a computer": "A computer is an electronic device that processes data and performs tasks based on instructions.",
"what is html": "HTML (HyperText Markup Language) is used to create the structure of web pages.",
"what is css": "CSS (Cascading Style Sheets) is used to style and design web pages.",
"what is javascript": "JavaScript is a programming language used to make websites interactive and dynamic.",

"what is electricity": "Electricity is the flow of electric charge that powers devices.",
"what is photosynthesis": "Photosynthesis is the process where plants use sunlight to make food.",

"what is biology": "Biology is the study of living organisms and life processes.",

"who is the president of zambia": "The President of Zambia is Hakainde Hichilema.",
"capital of zambia": "The capital city of Zambia is Lusaka.",
"what is zambia": "Zambia is a landlocked country in Southern Africa.",

"what is 2+2": "2 + 2 = 4",
"what is 5x6": "5 × 6 = 30",
"what is 10x10": "10 × 10 = 100",
"what is 100/2": "100 ÷ 2 = 50",

"thank you": "You are welcome.",
"thanks": "You are welcome.",
"bye": "Goodbye! Have a nice day."
};

/* =========================
   Smart AI Engine
   ========================= */

const aliases = {
"whats ai": "what is ai",
"what's ai": "what is ai",
"ai meaning": "what is ai",
"meaning of ai": "what is ai",

"hey": "hi",
"hello there": "hi",

"who is zambias president": "who is the president of zambia",
"who is zambia president": "who is the president of zambia",

"what is bio": "what is biology",
"biology meaning": "what is biology"
};

const stopWords = [
"is","are","the","of","to","and","a","an","what","why","how","who","does","for","in","on","at"
];

function cleanText(text){
    return text
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .trim();
}

function tokenize(text){
    return text.split(" ").filter(w => !stopWords.includes(w));
}

function askAI(){

let input = document.getElementById("question").value;
let chatbox = document.getElementById("chatbox");

let question = cleanText(input);

if(question === "") return;

/* =========================
   USER MESSAGE
   ========================= */
chatbox.innerHTML += `
<div class="user-msg">You: ${input}</div>
`;

/* =========================
   APPLY ALIASES
   ========================= */
if(aliases[question]){
    question = aliases[question];
}

/* =========================
   DIRECT MATCH (FAST PATH)
   ========================= */
if(knowledge[question]){
    chatbox.innerHTML += `
    <div class="ai-msg">Hillside AI: ${knowledge[question]}</div>
    `;
    document.getElementById("question").value = "";
    chatbox.scrollTop = chatbox.scrollHeight;
    return;
}

/* =========================
   FUZZY MATCH ENGINE
   ========================= */
let qWords = tokenize(question);

let bestMatch = null;
let bestScore = 0;

for(let key in knowledge){

    let kWords = tokenize(key);
    let score = 0;

    for(let w of qWords){
        if(kWords.includes(w)){
            score += 2;
        } else if(key.includes(w)){
            score += 1;
        }
    }

    // boost exact keyword overlap
    if(score > 0 && qWords.length > 1){
        score = score + (qWords.length * 0.1);
    }

    if(score > bestScore){
        bestScore = score;
        bestMatch = key;
    }
}

/* =========================
   SMART FALLBACK ENGINE
   ========================= */
let answer = "";

if(bestScore >= 4){
    answer = knowledge[bestMatch];
}

else if(bestScore >= 2.5){
    answer = "I think you are asking about: " + bestMatch + ". " + knowledge[bestMatch];
}

else if(bestScore >= 1.5){
    answer = "Did you mean: " + bestMatch + "? " + knowledge[bestMatch];
}

else{

    if(question.includes("ai") || question.includes("computer") || question.includes("technology")){
        answer = "This is a technology topic. It relates to computers, systems, and intelligent machines.";
    }

    else if(question.includes("zambia") || question.includes("president") || question.includes("lusaka") || question.includes("hakainde")){
        answer = "This is related to Zambia. The current President is Hakainde Hichilema.";
    }

    else if(question.includes("biology") || question.includes("science") || question.includes("life")){
        answer = "This is a science topic. Biology studies living organisms and life processes.";
    }

    else if(question.includes("math") || question.includes("x") || question.includes("+") || question.includes("÷")){
        answer = "This is a mathematics question. Try asking like 'what is 5x6'.";
    }

    else if(qWords.length <= 1){
        answer = "Please ask a more complete question like 'what is html' so I can help you better.";
    }

    else{
        answer = "I am not fully sure about that. Try rephrasing your question more clearly.";
    }
}

/* =========================
   AI MESSAGE
   ========================= */
chatbox.innerHTML += `
<div class="ai-msg">Hillside AI: ${answer}</div>
`;

/* =========================
   CLEANUP
   ========================= */
document.getElementById("question").value = "";
chatbox.scrollTop = chatbox.scrollHeight;

}
