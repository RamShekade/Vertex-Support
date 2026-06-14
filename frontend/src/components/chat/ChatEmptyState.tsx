const ChatEmptyState = () => {
  return (
    <div className="chat-empty">
      <section className="chat-empty__panel" aria-labelledby="chat-empty-title">
        <h2 id="chat-empty-title" className="chat-empty__title">
          Start a support conversation
        </h2>
        <p className="chat-empty__text">
          Describe the problem, ask about a feature, or share details about an account issue.
          The assistant will keep this session available if you refresh the page.
        </p>
      </section>
    </div>
  )
}

export default ChatEmptyState
