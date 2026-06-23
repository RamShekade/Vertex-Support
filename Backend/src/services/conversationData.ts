import ConversationRepository from "../repository/conversationRepository";

const repo = new ConversationRepository();

export function getConversationMessages(sessionId: string) {

    if (!sessionId) throw new Error("conversation ID is required");

    return repo.getMessages(sessionId);
}

export function getAllConversations() {
    return repo.getConversations();
}
