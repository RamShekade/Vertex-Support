import { conversation } from 'models/conversation'

type ConversationSidebarProps = {
  conversations: Array<conversation & { label: string }>
  activeConversationId: string | null
  isLoading: boolean
  onOpenConversation: (conversationId: string) => void
  onStartNewConversation: () => void
}

const ConversationSidebar = ({
  conversations,
  activeConversationId,
  isLoading,
  onOpenConversation,
  onStartNewConversation
}: ConversationSidebarProps) => {
  return (
    <aside className="chat-sidebar" aria-label="Conversation history">
      <div className="chat-sidebar__header">
        <div>
          <p className="chat-sidebar__eyebrow">History</p>
          <h2 className="chat-sidebar__title">Previous conversations</h2>
        </div>

        <button className="chat-sidebar__new-button" type="button" onClick={onStartNewConversation}>
          New chat
        </button>
      </div>

      <nav className="chat-sidebar__nav" aria-label="Recent conversations">
        {isLoading ? <div className="chat-sidebar__loading">Loading conversations...</div> : null}

        {!isLoading && conversations.length === 0 ? (
          <div className="chat-sidebar__empty">No previous conversations yet.</div>
        ) : null}

        <ul className="chat-sidebar__list">
          {conversations.map((conversationItem) => {
            const isActive = conversationItem.id === activeConversationId

            return (
              <li key={conversationItem.id}>
                <button
                  type="button"
                  className={`chat-sidebar__item ${isActive ? 'chat-sidebar__item--active' : ''}`}
                  onClick={() => onOpenConversation(conversationItem.id)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="chat-sidebar__item-title">Conversation</span>
                  <span className="chat-sidebar__item-meta">{conversationItem.label}</span>
                  <span className="chat-sidebar__item-id">{conversationItem.id.slice(0, 8)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default ConversationSidebar
