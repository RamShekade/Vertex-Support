type ChatHeaderProps = {
  sessionId: string | null
}

const ChatHeader = ({ sessionId }: ChatHeaderProps) => {
  return (
    <header className="chat-header">
      <p className="chat-header__eyebrow">Support desk</p>
      <div className="chat-header__title-row">
        <div>
          <h1 className="chat-header__title">Customer support chat</h1>
          <p className="chat-header__subtitle">
            Ask a question, get a concise answer, and continue the same conversation later without
            losing context.
          </p>
        </div>
        <div className="chat-badge" aria-label="Support agent availability">
          <span className="chat-badge__dot" aria-hidden="true" />
          <span>{sessionId ? 'Session active' : 'Ready to help'}</span>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader
