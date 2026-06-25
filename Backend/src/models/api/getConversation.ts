import { AIMessage } from "../message";

export interface getConversationsRequest{
    conversationId: string;
}

export interface getConversationsResponse {
    conversationId: string;
    messages: AIMessage[];
}