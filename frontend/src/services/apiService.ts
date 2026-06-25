import { chatRequest, chatResponse } from 'models/api/createChat'
import { conversation } from 'models/conversation'
import { AIMessage, AIMessageRole } from 'models/message'
import axios from 'axios'
import { getConversationsResponse } from 'models/api/getConversation'
import { getAllConversationsResponse } from 'models/api/getAllConversations'


const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000/api'

export const sendChatMessage = async (
  request: chatRequest,
): Promise<chatResponse> => {

  const response = await axios.post(`${API_BASE_URL}/message`, { ...request })
  const data = response.data as chatResponse;
  
  return {
    conversationId: data.conversationId,
    message: data.message
  }
}

export const getConversationMessages = async (
  conversationId: string,
): Promise<AIMessage[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/conversation/${encodeURIComponent(conversationId)}`,
  )
  const data = response.data as getConversationsResponse;

  return data.messages.map((message) => ({
    conversationId: message.conversationId ?? conversationId,
    sender: message.sender as AIMessageRole,
    text: message.text,
    createdAt: new Date(message.createdAt)
  }))
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
}

export const getConversations = async (): Promise<conversation[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/conversations`,
  )

  const data = response.data as getAllConversationsResponse;

  return data.conversations
    .map((item) => ({
      id: item.id,
      createdAt: new Date(item.createdAt),
      firstMessage: item.firstMessage
    }))
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
}
