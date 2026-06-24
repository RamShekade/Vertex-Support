import { AIMessage, AIMessageRole } from "../../../models/message";
import ConversationRepository from "../repository/conversationRepository";
import { chatRequest } from "../../../models/api/createChat";
import { callGemini } from "./callGemini";
import { AppError } from "../../../models/Errors";

const MAX_LENGTH = 5000;
const repo = new ConversationRepository();

function PreProcessMessages(message: string): string {
    
    if (!message?.trim()) throw new Error("Message cannot be empty");
    
    const trimmedMessage = message.trim().replace(/\s+/g, " ");
    if (trimmedMessage.length > MAX_LENGTH) {
        throw new Error(`Message exceeds ${MAX_LENGTH} characters`);
    }

    return trimmedMessage;
}

export async function processMessage(request: chatRequest): Promise<{ conversationId: string; message: string; }> {

    try {
        const { conversationId, message } = request;
        const preProcessedMessage = PreProcessMessages(message);

        let history: AIMessage[] = [];
        let newConversationId: string = "";
        if (conversationId) {
            history = repo.getMessages(conversationId, 10);
            repo.addMessage(conversationId, AIMessageRole.User, preProcessedMessage);
        } else {
            newConversationId = repo.createConversation();
            repo.addMessage(newConversationId, AIMessageRole.User, preProcessedMessage);
        }

        const response = await callGemini(preProcessedMessage, history);
        repo.addMessage(conversationId || newConversationId, AIMessageRole.Model, response);

        return {
            conversationId: conversationId || newConversationId,
            message: response
        };
    } catch (error) {
        console.error("Error in processMessage:", error);
        throw error as AppError;
    }    
}
