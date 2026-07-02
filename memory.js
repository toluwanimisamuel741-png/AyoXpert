const { SYSTEM_PROMPT } = require("./prompts");

// Stores conversations in memory
const conversations = {};

// Get or create a conversation
function getConversation(chatId) {
  if (!conversations[chatId]) {
    conversations[chatId] = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      }
    ];
  }

  return conversations[chatId];
}

// Add a user message
function addUserMessage(chatId, message) {
  const conversation = getConversation(chatId);

  conversation.push({
    role: "user",
    content: message
  });

  // Keep only the system prompt + latest 20 messages
  if (conversation.length > 21) {
    conversations[chatId] = [
      conversation[0],
      ...conversation.slice(-20)
    ];
  }
}

// Add an AI reply
function addAssistantMessage(chatId, message) {
  const conversation = getConversation(chatId);

  conversation.push({
    role: "assistant",
    content: message
  });

  if (conversation.length > 21) {
    conversations[chatId] = [
      conversation[0],
      ...conversation.slice(-20)
    ];
  }
}

// Reset conversation
function resetConversation(chatId) {
  delete conversations[chatId];
}

module.exports = {
  getConversation,
  addUserMessage,
  addAssistantMessage,
  resetConversation
};
