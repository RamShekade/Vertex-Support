export enum AIMessageRole{
    User = "user",
    Model = "model"
}

export interface AIMessage {
    conversationId: string,
    sender: AIMessageRole, 
    text: string,
    createdAt: Date
}
