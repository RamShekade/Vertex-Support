import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AIMessage, AIMessageRole } from 'models/message'
import { sendChatMessage } from '@/services/apiService'
import { chatQueryKeys } from './chatQueryKeys'
import { getErrorMessage } from '@/utils/errorCatcher'

type SendChatMessageVariables = {
  message: string
  conversationId: string | null
  optimisticConversationId: string
}

type SendChatMessageContext = {
  previousMessages: AIMessage[] | undefined
}

type UseSendChatMessageParams = {
  onConversationResolved: (conversationId: string) => void
  onConversationFailed: (message: string, variables: SendChatMessageVariables) => void
}

export const useSendChatMessage = ({
  onConversationResolved,
  onConversationFailed
}: UseSendChatMessageParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ message, conversationId }: SendChatMessageVariables) => {

      try {
        return await sendChatMessage(
          {
            conversationId: conversationId ?? undefined,
            message: message
          }
        )
      } catch (error) {
        throw getErrorMessage(error);
      }
    },
    onMutate: async (variables): Promise<SendChatMessageContext> => {
      const queryKey = chatQueryKeys.messages(variables.optimisticConversationId)

      await queryClient.cancelQueries({ queryKey })

      const previousMessages = queryClient.getQueryData<AIMessage[]>(queryKey)
      const userMessage: AIMessage = {
        conversationId: variables.optimisticConversationId,
        sender: AIMessageRole.User,
        text: variables.message,
        createdAt: new Date()
      }

      queryClient.setQueryData<AIMessage[]>(queryKey, (currentMessages = []) => [
        ...currentMessages,
        userMessage
      ])

      return { previousMessages }
    },
    onSuccess: (response, variables) => {
      const resolvedConversationId = response.conversationId || variables.optimisticConversationId
      const optimisticQueryKey = chatQueryKeys.messages(variables.optimisticConversationId)
      const resolvedQueryKey = chatQueryKeys.messages(resolvedConversationId)
      const currentMessages = queryClient.getQueryData<AIMessage[]>(optimisticQueryKey) ?? []
      const normalizedMessages = currentMessages.map((message) => ({
        ...message,
        conversationId: resolvedConversationId
      }))

      const assistantMessage: AIMessage = {
        conversationId: resolvedConversationId,
        sender: AIMessageRole.Model,
        text: response.message,
        createdAt: new Date()
      }

      queryClient.setQueryData<AIMessage[]>(resolvedQueryKey, [
        ...normalizedMessages,
        assistantMessage
      ])

      if (resolvedConversationId !== variables.optimisticConversationId) {
        queryClient.removeQueries({ queryKey: optimisticQueryKey })
      }

      onConversationResolved(resolvedConversationId)
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations })
    },
    onError: (error, variables, context) => {
      const queryKey = chatQueryKeys.messages(variables.optimisticConversationId)

      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages)
      } else {
        queryClient.removeQueries({ queryKey })
      }

      onConversationFailed(getErrorMessage(error), variables)
    }
  })
}
