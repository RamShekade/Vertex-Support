import { conversation } from "../conversation";

export interface getAllConversationsRequest { } // kept empty no parameters required

export interface getAllConversationsResponse {
    conversations: conversation[];
}