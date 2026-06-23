import { conversation } from 'models/conversation'

type Props = {
  conversations: conversation[]
  activeConversationId: string | null
  isLoading: boolean
  isOpen: boolean
  onOpenConversation: (id: string) => void
  onStartNewConversation: () => void
}

const ConversationSidebar = ({
  conversations,
  activeConversationId,
  isLoading,
  isOpen,
  onOpenConversation,
  onStartNewConversation,
}: Props) => {
  return (
    <aside
      className={`
        flex h-screen flex-col border-r border-gray-100 bg-white
        transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'w-64 lg:w-72 opacity-100' : 'w-0 opacity-0'}
      `}
    >
      {/* Inner wrapper keeps content from reflowing while collapsing */}
      <div className="flex h-full w-64 lg:w-72 flex-col">
        <div className="shrink-0 border-b border-gray-100 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            History
          </p>
          <h2 className="mt-0.5 text-[15px] font-semibold text-gray-900">
            Previous chats
          </h2>
          <button
            type="button"
            onClick={onStartNewConversation}
            className="mt-3 w-full rounded-lg bg-pink-500 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-pink-600 active:bg-pink-700 active:scale-[0.98]"
          >
            + New chat
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {isLoading && (
            <p className="py-8 text-center text-xs text-gray-400">Loading conversations…</p>
          )}

          {!isLoading && conversations.length === 0 && (
            <p className="py-8 text-center text-xs text-gray-400">No conversations yet.</p>
          )}

          {!isLoading && conversations.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {conversations.map((c) => {
                const isActive = c.id === activeConversationId
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onOpenConversation(c.id)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-150 ${
                        isActive
                          ? 'border-pink-200 bg-pink-50'
                          : 'border-transparent hover:border-pink-100 hover:bg-pink-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-gray-900">Conversation</span>
                        {isActive && <span className="h-2 w-2 rounded-full bg-pink-500" />}
                      </div>
                      <p className="mt-1 truncate font-mono text-[11px] text-gray-400">{c.id}</p>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}

export default ConversationSidebar