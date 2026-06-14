import { AIMessage, AIMessageRole } from 'models/message'

type ChatMessageBubbleProps = {
  message: AIMessage
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUserMessage = message.sender === AIMessageRole.User
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(message.createdAt))

  return (
    <div className={`message-row ${isUserMessage ? 'message-row--user' : 'message-row--agent'}`}>
      <article
        className={`message-bubble ${isUserMessage ? 'message-bubble--user' : 'message-bubble--agent'}`}
        aria-label={isUserMessage ? 'Your message' : 'Support reply'}
      >
        <p className="message-bubble__text">{message.text}</p>
        <div className="message-bubble__meta">{formattedTime}</div>
      </article>
    </div>
  )
}

export default ChatMessageBubble
