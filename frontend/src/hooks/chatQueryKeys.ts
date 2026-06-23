export const chatQueryKeys = {
  conversations: ['chat', 'conversations'] as const,
  messages: (conversationId: string) => ['chat', 'messages', conversationId] as const
}
