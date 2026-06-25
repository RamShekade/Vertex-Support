import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getConversationMessages } from '@/services/apiService'
import { chatQueryKeys } from './chatQueryKeys'

export const useConversationMessages = (conversationId: string | null) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const query = useQuery({
    queryKey: conversationId ? chatQueryKeys.messages(conversationId) : ['chat', 'messages', 'idle'],
    queryFn: ({}) => getConversationMessages(conversationId!,),
    staleTime: 10_000,
    enabled:
    Boolean(conversationId) &&
    !conversationId?.startsWith("temp-")
    }) 

  const messages = query.data ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, query.isFetching])

  return {
    messages,
    isRestoring: Boolean(conversationId) && query.isLoading,
    isFetchingMessages: query.isFetching,
    messagesEndRef
  }
}
