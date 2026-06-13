import { conversation } from "../conversation";

export interface getSessionRequest{
    sessionId: string;
}

export interface getSessionResponse {
    sessionId: string;
    conversations: conversation[];
}