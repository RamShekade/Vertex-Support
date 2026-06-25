import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useConversationMessages } from './useConversationMessages'
import { useConversations } from './useConversations'
import { useSendChatMessage } from './useSendChatMessage'

const MAX_MESSAGE_LENGTH = 5000

export const useChat = () => {
  const [inputValue, setInputValue] = useState('')
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isComposingNewChat, setIsComposingNewChat] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const { conversations, isLoadingConversations } = useConversations()
  const { messages, isRestoring, messagesEndRef } = useConversationMessages(activeConversationId)

  const characterCount = inputValue.length
  const trimmedInput = useMemo(() => inputValue.trim(), [inputValue])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (activeConversationId || isComposingNewChat || conversations.length === 0) {
      return
    }
  }, [activeConversationId, conversations, isComposingNewChat])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleConversationResolved = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId)
    setIsComposingNewChat(false)
  }, [])

  const handleConversationFailed = useCallback((message: string) => {
    setError(message)
  }, [])

  const sendMutation = useSendChatMessage({
    onConversationResolved: handleConversationResolved,
    onConversationFailed: handleConversationFailed
  })

  const canSendMessage =
    trimmedInput.length > 0 &&
    trimmedInput.length <= MAX_MESSAGE_LENGTH &&
    !sendMutation.isPending &&
    !isRestoring

  const openConversation = useCallback(
    (conversationId: string) => {
      if (conversationId === activeConversationId) {
        return
      }

      setError(null)
      setInputValue('')
      setIsComposingNewChat(false)
      setActiveConversationId(conversationId)
    },
    [activeConversationId]
  )

  const startNewConversation = useCallback(() => {
    setInputValue('')
    setActiveConversationId(null)
    setIsComposingNewChat(true)
    setError(null)
    inputRef.current?.focus()
  }, [])

  const sendMessage = useCallback(() => {
    if (sendMutation.isPending) {
      return
    }

    if (!trimmedInput) {
      setError('Please type a message before sending.')
      return
    }

    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      setError(`Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.`)
      return
    }

    const optimisticConversationId = activeConversationId ?? `temp-${window.crypto.randomUUID()}`

    setActiveConversationId(optimisticConversationId)
    setInputValue('')
    setError(null)
    setIsComposingNewChat(false)

    sendMutation.mutate({
      message: trimmedInput,
      conversationId: activeConversationId,
      optimisticConversationId
    })
  }, [activeConversationId, sendMutation, trimmedInput])

  return {
    messages,
    conversations,
    inputValue,
    setInputValue,
    sessionId: activeConversationId,
    isLoading: sendMutation.isPending,
    isRestoring,
    isLoadingConversations,
    error,
    characterCount,
    canSendMessage,
    inputRef,
    messagesEndRef,
    clearError,
    sendMessage,
    openConversation,
    startNewConversation
  }
}
