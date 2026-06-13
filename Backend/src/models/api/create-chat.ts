
export interface chatRequest{
    sessionId?: string,
    message: string
}
export interface chatResponse{
    sessionId: string,
    message: string
}