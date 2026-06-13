import { AIMessage } from "../models/message";
import ConversationRepository from "../repository/conversationRepository";
import { chatRequest } from "../models/api/create-chat";
import { AIMessageRole } from "../models/message";
import { callGemini } from "./callGemini";

const MAX_LENGTH = 5000;
const repo = new ConversationRepository();

function PreProcessMessages(message: string): string {

    if (!message?.trim()) throw new Error("Message cannot be empty");
    
    if (message.length > MAX_LENGTH)
        throw new Error(`Message exceeds ${MAX_LENGTH} characters`);
    
    return message.trim().replace(/\s+/g, " ");
}


export function processMessage(request: chatRequest): AIMessage[] {
    
    const { sessionId, message } = request;
    const preProcessedMessage = PreProcessMessages(message);

    let history: AIMessage[] = [];
    if (sessionId) {
        
        history = repo.getMessages(sessionId, 10);
        repo.addMessage(sessionId, AIMessageRole.User, preProcessedMessage);

    } else {

        const newSessionId = repo.createConversation(sessionId || "");
        repo.addMessage(newSessionId, AIMessageRole.User, preProcessedMessage);
    }

    const GeminiResponse = callGemini(preProcessedMessage, history); 

    return history;
}
