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
        flex h-screen flex-col bg-[#faf8f8]
        transition-all duration-300 ease-in-out overflow-hidden
        border-r border-pink-100
        ${isOpen ? 'w-64 lg:w-72 opacity-100' : 'w-0 opacity-0'}
      `}
    >
      <div className="flex h-full w-64 lg:w-72 flex-col">

        <div className="shrink-0 px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-pink-500">Vertex Support</span>
          </div>

          <button
            type="button"
            onClick={onStartNewConversation}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 py-2.5 text-[13.5px] font-semibold text-white transition-all duration-150 hover:bg-pink-600 active:bg-pink-700 active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Conversation
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">

          <div className="mb-1.5 flex items-center gap-2 px-1">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">History</span>
          </div>

          {isLoading && (
            <p className="py-8 text-center text-xs text-gray-400">Loading conversations…</p>
          )}

          {!isLoading && conversations.length === 0 && (
            <p className="py-8 text-center text-xs text-gray-400">No conversations yet.</p>
          )}

          {!isLoading && conversations.length > 0 && (
            <ul className="flex flex-col gap-1">
              {conversations.map((c) => {
                const isActive = c.id === activeConversationId
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onOpenConversation(c.id)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                        isActive
                          ? 'bg-pink-100 text-pink-700'
                          : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      <span
                        className="flex-1 truncate text-[13px] font-medium"
                        title={c.firstMessage || 'New Conversation'}
                      >
                        {c.firstMessage || 'New Conversation'}
                      </span>

                      {isActive && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-pink-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
              <svg className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">Need Help?</p>
              <p className="text-[11px] text-gray-400">We're always here</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}

export default ConversationSidebar