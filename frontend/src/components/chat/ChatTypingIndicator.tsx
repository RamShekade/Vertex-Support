const ChatTypingIndicator = () => {
  return (
    <div className="typing-indicator" aria-live="polite" aria-atomic="true">
      <span>Agent is typing...</span>
      <span className="typing-indicator__dots" aria-hidden="true">
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
      </span>
    </div>
  )
}

export default ChatTypingIndicator
