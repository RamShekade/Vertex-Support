import type { RefObject } from 'react'
import { AIMessage, AIMessageRole } from 'models/message'

const renderText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

const MessageBubble = ({ message }: { message: AIMessage }) => {
  const isUser = message.sender === AIMessageRole.User
  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(message.createdAt))

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <article
        className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-pink-500 text-white'
            : 'rounded-bl-sm bg-gray-100 text-gray-900'
        }`}
        aria-label={isUser ? 'Your message' : 'Support reply'}
      >
        <p className="whitespace-pre-wrap">{renderText(message.text)}</p>
        <p className={`mt-1 text-[11px] ${isUser ? 'text-pink-200' : 'text-gray-400'}`}>
          {time}
        </p>
      </article>
    </div>
  )
}

const TypingIndicator = () => (
  <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2.5">
    <span className="text-[12px] text-gray-500">Agent is typing</span>
    <span className="flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  </div>
)

const EmptyState = () => (
  <div className="flex flex-1 items-center justify-center px-6 py-12">
    <div className="text-center">
      <div className="relative mx-auto mb-5 h-14 w-14">
        <span className="absolute inset-0 rounded-full border border-pink-100 bg-pink-50" />
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </span>
      </div>
      <h2 className="text-[15px] font-semibold text-gray-900">Where should we begin?</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-gray-400">
        Pick a question below or type your own.
      </p>
    </div>
  </div>
)

type Props = {
  messages: AIMessage[]
  isLoading: boolean
  isRestoring: boolean
  bottomRef: RefObject<HTMLDivElement>
}

const ChatMessageList = ({ messages, isLoading, isRestoring, bottomRef }: Props) => {
  if (isRestoring) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">Restoring your conversation</h2>
          <p className="mt-1.5 text-[13px] text-gray-400">
            Fetching the latest session so you can continue where you left off.
          </p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) return <EmptyState />

  return (
    <div
      className="flex flex-col gap-2.5"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {messages.map((msg, i) => (
        <MessageBubble
          key={`${msg.conversationId}-${msg.createdAt.toISOString()}-${i}`}
          message={msg}
        />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  )
}

export default ChatMessageList