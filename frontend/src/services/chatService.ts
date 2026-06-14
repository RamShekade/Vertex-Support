import { chatRequest, chatResponse } from 'models/api/createChat'
import { conversation } from 'models/conversation'
import { AIMessage, AIMessageRole } from 'models/message'

const API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL ?? '/chat'

type WireChatResponse = {
  reply?: string
  sessionId?: string
  response?: string
  conversationId?: string
}

type WireChatMessage = {
  conversationId?: string
  sender: AIMessageRole | string
  text: string
  createdAt: string | Date
}

class ChatServiceError extends Error {
  constructor(
    public readonly code: 'network' | 'timeout' | 'server' | 'unknown',
    message: string
  ) {
    super(message)
    this.name = 'ChatServiceError'
  }
}

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = await response.json()
    if (typeof payload?.error === 'string' && payload.error.trim()) {
      return payload.error
    }
  } catch {
    // Use a safe fallback below.
  }

  return 'The support chat service is unavailable right now.'
}

const requestJson = async <T,>(url: string, init: RequestInit): Promise<T> => {
  let response: Response

  try {
    response = await fetch(url, init)
  } catch {
    if (init.signal?.aborted) {
      throw new ChatServiceError('timeout', 'The request timed out.')
    }

    throw new ChatServiceError('network', 'A network error occurred.')
  }

  if (!response.ok) {
    throw new ChatServiceError('server', await parseErrorMessage(response))
  }

  return (await response.json()) as T
}

export const sendChatMessage = async (
  request: chatRequest,
  signal?: AbortSignal
): Promise<chatResponse> => {
  const response = await requestJson<WireChatResponse>(`${API_BASE_URL}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: request.message,
      conversationId: request.conversationId
    }),
    signal
  })

  return {
    conversationId: response.sessionId ?? response.conversationId ?? request.conversationId ?? '',
    message: response.reply ?? response.response ?? ''
  }
}

export const getConversationMessages = async (
  conversationId: string,
  signal?: AbortSignal
): Promise<AIMessage[]> => {
  const response = await requestJson<WireChatMessage[]>(
    `${API_BASE_URL}/conversation/${encodeURIComponent(conversationId)}`,
    { signal }
  )

  return response.map((message) => ({
    conversationId: message.conversationId ?? conversationId,
    sender: message.sender as AIMessageRole,
    text: message.text,
    createdAt: new Date(message.createdAt)
  }))
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
}

export const getConversations = async (signal?: AbortSignal): Promise<conversation[]> => {
  const response = await requestJson<Array<{ id: string; createdAt: string | Date }>>(
    `${API_BASE_URL}/conversations`,
    { signal }
  )

  return response
    .map((item) => ({
      id: item.id,
      createdAt: new Date(item.createdAt)
    }))
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
}

export const getFriendlyChatErrorMessage = (error: unknown): string => {
  if (error instanceof ChatServiceError) {
    switch (error.code) {
      case 'timeout':
        return 'The request took too long. Please try again.'
      case 'network':
        return 'We could not reach the support chat service. Check your connection and try again.'
      case 'server':
        return error.message || 'Something went wrong on the server.'
      default:
        return 'Something went wrong. Please try again.'
    }
  }

  return 'Something went wrong. Please try again.'
}
