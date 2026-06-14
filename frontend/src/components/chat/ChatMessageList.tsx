import type { RefObject } from 'react'
import { AIMessage } from 'models/message'
import ChatEmptyState from './ChatEmptyState'
import ChatMessageBubble from './ChatMessageBubble'
import ChatTypingIndicator from './ChatTypingIndicator'

type ChatMessageListProps = {
  messages: AIMessage[]
  isLoading: boolean
  isRestoring: boolean
  bottomRef: RefObject<HTMLDivElement>
}

const ChatMessageList = ({ messages, isLoading, isRestoring, bottomRef }: ChatMessageListProps) => {
  if (isRestoring) {
    return (
      <div className="chat-empty" aria-live="polite">
        <section className="chat-empty__panel">
          <h2 className="chat-empty__title">Restoring your conversation</h2>
          <p className="chat-empty__text">
            Fetching the latest session so you can continue where you left off.
          </p>
        </section>
      </div>
    )
  }

  if (messages.length === 0) {
    return <ChatEmptyState />
  }

  return (
    <div className="message-list" role="log" aria-live="polite" aria-relevant="additions text">
      {messages.map((message, index) => (
        <ChatMessageBubble
          key={`${message.conversationId}-${message.createdAt.toISOString()}-${index}`}
          message={message}
        />
      ))}
      {isLoading ? <ChatTypingIndicator /> : null}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  )
}

export default ChatMessageList
