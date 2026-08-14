let chatHistory = [];

async function sendMessage() {

    const input = document.getElementById("user-input");
    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Show user's message
    addMessage(message, "user");

    // Save user message
    chatHistory.push({
        role: "user",
        message: message
    });

    input.value = "";

    // Show typing indicator
    const typingId = addTypingIndicator();

    try {

        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,
                history: chatHistory
            })
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator(typingId);

        // Display AI response
        addMessage(data.response, "bot");

        // Save AI response
        chatHistory.push({
            role: "assistant",
            message: data.response
        });

    } catch (error) {

        removeTypingIndicator(typingId);

        addMessage(
            "I'm having trouble reaching the AI service right now. Please try again in a moment.",
            "bot"
        );

        console.error(error);
    }
}


function addMessage(message, sender) {

    const chatBox = document.getElementById("chat-box");

    const messageDiv = document.createElement("div");

    messageDiv.innerHTML = formatMessage(message);

    if (sender === "user") {
        messageDiv.className = "user-message";
    } else {
        messageDiv.className = "bot-message";
    }

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function formatMessage(message) {
    return message
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "• $1")
        .replace(/\n/g, "<br>");
}


function addTypingIndicator() {
    const typing = document.createElement("div");

    typing.className = "bot-message typing";

    typing.innerHTML = `
        <span class="bot-icon">🤖</span>
        <span>AI is typing</span>
        <span class="typing-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </span>
    `;

    document.getElementById("chat-box").appendChild(typing);

    document.getElementById("chat-box").scrollTop =
        document.getElementById("chat-box").scrollHeight;

    return typing;
}

function removeTypingIndicator(typingElement) {
    if (typingElement) {
        typingElement.remove();
    }
}


function clearChat() {

    const chatBox = document.getElementById("chat-box");

    chatBox.innerHTML = `
        <div class="bot-message">
            Hello! 👋 I'm your personal AI assistant. How can I help you?
        </div>
    `;

    chatHistory = [];
}

function quickQuestion(question) {

    const input = document.getElementById("user-input");

    input.value = question;

    sendMessage();
}


// Press Enter to send message
document.getElementById("user-input").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});

document.getElementById("user-input").addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }

});
