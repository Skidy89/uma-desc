import db from "./backend.js";

const createConversation = db.prepare(`
  INSERT OR IGNORE INTO conversations (id)
  VALUES (?)
`);

const saveMessage = db.prepare(`
  INSERT INTO messages (conversation_id, role, content)
  VALUES (?, ?, ?)
`);

const getMessages = db.prepare(`
  SELECT role, content, created_at
  FROM messages
  WHERE conversation_id = ?
  ORDER BY id ASC
`);

const getConversation = db.prepare(`
  SELECT id, created_at
  FROM conversations
  WHERE id = ?
`);

export function createNewConversation(conversationId: string) {
  createConversation.run(conversationId);
}
export function saveNewMessage(
  conversationId: string,
  role: string,
  content: string,
) {
  saveMessage.run(conversationId, role, content);
}
export function getConversationMessages(conversationId: string) {
  return getMessages.all(conversationId);
}
export function getConversationById(conversationId: string) {
  return getConversation.get(conversationId);
}
