import { conversation } from "../conversation";

export interface getConversationsRequest{
    conversationId: string;
}

export interface getConversationsResponse {
    conversationId: string;
    conversation: conversation[];
}