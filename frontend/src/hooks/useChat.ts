import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { chatRequest } from 'models/api/createChat'
import { conversation } from 'models/conversation'
import { AIMessage, AIMessageRole } from 'models/message'
import {
  getConversations,
  getConversationMessages,
  getFriendlyChatErrorMessage,
  sendChatMessage
} from '@/services/chatService'

const MAX_MESSAGE_LENGTH = 5000
const REQUEST_TIMEOUT_MS = 30000
const SESSION_STORAGE_KEY = 'support-agent-session-id'

type ConversationItem = conversation & {
  label: string
}

export const useChat = () => {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const formatConversationLabel = useCallback((value: Date) => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })

    return formatter.format(value)
  }, [])

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true)

    try {
      const items = await getConversations()
      setConversations(
        items.map((item) => ({
          ...item,
          label: formatConversationLabel(item.createdAt)
        }))
      )
    } catch {
      setConversations([])
    } finally {
      setIsLoadingConversations(false)
    }
  }, [formatConversationLabel])

  const characterCount = inputValue.length
  const trimmedInput = useMemo(() => inputValue.trim(), [inputValue])
  const canSendMessage =
    trimmedInput.length > 0 && trimmedInput.length <= MAX_MESSAGE_LENGTH && !isLoading && !isRestoring

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  useEffect(() => {
    const savedSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY)

    if (!savedSessionId) {
      return
    }

    const controller = new AbortController()
    setSessionId(savedSessionId)
    setIsRestoring(true)

    getConversationMessages(savedSessionId, controller.signal)
      .then((history) => {
        setMessages(history)
      })
      .catch(() => {
        window.localStorage.removeItem(SESSION_STORAGE_KEY)
        setSessionId(null)
      })
      .finally(() => {
        setIsRestoring(false)
      })

    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading, isRestoring])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const openConversation = useCallback(
    async (conversationId: string) => {
      if (conversationId === sessionId) {
        return
      }

      const controller = new AbortController()

      abortRef.current?.abort()
      abortRef.current = controller
      setIsRestoring(true)
      setError(null)

      try {
        const history = await getConversationMessages(conversationId, controller.signal)
        setMessages(history)
        setSessionId(conversationId)
        window.localStorage.setItem(SESSION_STORAGE_KEY, conversationId)
      } catch {
        setError('We could not open that conversation right now. Please try again.')
      } finally {
        setIsRestoring(false)
      }
    },
    [sessionId]
  )

  const startNewConversation = useCallback(() => {
    abortRef.current?.abort()
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setMessages([])
    setInputValue('')
    setSessionId(null)
    setError(null)
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    inputRef.current?.focus()
  }, [])

  const sendMessage = useCallback(async () => {
    if (isLoading) {
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

    const optimisticSessionId = sessionId ?? window.crypto.randomUUID()
    const userMessage: AIMessage = {
      conversationId: optimisticSessionId,
      sender: AIMessageRole.User,
      text: trimmedInput,
      createdAt: new Date()
    }

    const request: chatRequest = {
      conversationId: sessionId ?? undefined,
      message: trimmedInput
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInputValue('')
    setError(null)
    setIsLoading(true)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    timeoutRef.current = window.setTimeout(() => {
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const response = await sendChatMessage(request, controller.signal)
      const resolvedSessionId = response.conversationId

      if (!sessionId) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, resolvedSessionId)
        setSessionId(resolvedSessionId)
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.conversationId === optimisticSessionId
              ? { ...message, conversationId: resolvedSessionId }
              : message
          )
        )
      }

      const assistantMessage: AIMessage = {
        conversationId: resolvedSessionId,
        sender: AIMessageRole.Model,
        text: response.message,
        createdAt: new Date()
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
      void loadConversations()
    } catch (chatError) {
      setMessages((currentMessages) => currentMessages.slice(0, -1))
      setError(getFriendlyChatErrorMessage(chatError))
    } finally {
      setIsLoading(false)
      abortRef.current = null
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isLoading, loadConversations, sessionId, trimmedInput])

  return {
    messages,
    conversations,
    inputValue,
    setInputValue,
    sessionId,
    isLoading,
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
