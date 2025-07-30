// Global variables
let stream = null;
let capturedPhoto = null;
let reports = JSON.parse(localStorage.getItem('safetyReports')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Demo users database (also stored in localStorage)
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        email: 'worker@company.com',
        password: 'password123',
        name: 'John Worker',
        role: 'worker',
        department: 'manufacturing'
    },
    {
        email: 'safety@company.com',
        password: 'password123',
        name: 'Safety Officer Smith',
        role: 'safety_officer',
        department: 'safety'
    }
];

// Initialize localStorage with demo users if empty
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}

// --- AI Chatbot Assistant ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

// Configuration
const AI_ASSISTANT_NAME = "Safety Assistant";
const INITIAL_GREETING = "Hi! I'm your Safety Assistant. Ask me anything about workplace safety, hazard reporting, or safety procedures.";
const SAFETY_KNOWLEDGE = {
    "reporting": [
        "To file a safety report, use the 'Submit Report' button in the app.",
        "Include clear photos of the hazard when reporting for faster resolution.",
        "Reports should include location, hazard type, and severity level."
    ],
    "emergency": [
        "For immediate emergencies, call your local emergency number first.",
        "Know the location of fire extinguishers and emergency exits in your area.",
        "In case of chemical spills, evacuate and notify supervisors immediately."
    ],
    "ppe": [
        "Common PPE includes hard hats, safety glasses, gloves, and steel-toe boots.",
        "Inspect PPE before each use for any damage or wear.",
        "Your supervisor can provide specific PPE requirements for your role."
    ],
    "hazards": [
        "Common workplace hazards include slips/trips, electrical issues, and chemical exposure.",
        "Always tag out malfunctioning equipment immediately.",
        "Report near-misses to help prevent future accidents."
    ],
    "general": [
        "Regular safety training is required for all employees.",
        "Keep work areas clean and free of obstructions.",
        "Never bypass safety guards on machinery."
    ]
};

chatbotToggle.onclick = () => {
    chatbotWindow.style.display = 'block';
    chatbotToggle.style.display = 'none';
    chatbotInput.value = '';
    chatbotInput.focus();
};

chatbotClose.onclick = () => {
    chatbotWindow.style.display = 'none';
    chatbotToggle.style.display = 'block';
};

function addMessage(text, sender = 'user') {
    const msg = document.createElement('div');
    msg.className = `chatbot-msg ${sender}`;
    msg.innerHTML = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Initial greeting
addMessage(INITIAL_GREETING, 'bot');

// Show typing indicator
function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chatbot-msg bot typing-indicator';
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatbotMessages.appendChild(typing);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typing;
}

// Remove typing indicator
function hideTypingIndicator(typingElement) {
    if (typingElement && typingElement.parentNode) {
        typingElement.remove();
    }
}

// Generate AI-like response
function generateAIResponse(userQuery) {
    const lowerQuery = userQuery.toLowerCase();
    let responsePool = [];
    
    // Categorize the query and select appropriate responses
    if (/report|submit|file/i.test(lowerQuery)) {
        responsePool = responsePool.concat(SAFETY_KNOWLEDGE.reporting);
    }
    if (/emergency|urgent|fire|spill/i.test(lowerQuery)) {
        responsePool = responsePool.concat(SAFETY_KNOWLEDGE.emergency);
    }
    if (/ppe|equipment|gear|glove|helmet/i.test(lowerQuery)) {
        responsePool = responsePool.concat(SAFETY_KNOWLEDGE.ppe);
    }
    if (/hazard|danger|risk|unsafe/i.test(lowerQuery)) {
        responsePool = responsePool.concat(SAFETY_KNOWLEDGE.hazards);
    }
    
    // Always include general safety knowledge
    responsePool = responsePool.concat(SAFETY_KNOWLEDGE.general);
    
    // Select a random response from the pool
    const randomResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
    
    // Add some variability
    const prefixes = [
        "Based on safety protocols,",
        "For your situation,",
        "Regarding your question,",
        "According to workplace safety standards,"
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    return `${prefix} ${randomResponse}`;
}

// Handle form submission
chatbotForm.onsubmit = async function(e) {
    e.preventDefault();
    const userText = chatbotInput.value.trim();
    if (!userText) return;
    
    addMessage(userText, 'user');
    chatbotInput.value = '';
    
    const typingElement = showTypingIndicator();
    
    // Simulate AI processing delay
    setTimeout(() => {
        hideTypingIndicator(typingElement);
        const response = generateAIResponse(userText);
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
};

// Rest of your existing code (authentication, camera, reports, etc.) remains the same...
// [Keep all your existing functions below this point]