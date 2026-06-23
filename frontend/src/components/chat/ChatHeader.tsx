type Props = {
  sessionId: string | null
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

const ChatHeader = ({ sessionId, isSidebarOpen, onToggleSidebar }: Props) => (
  <header className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
    {/* Sidebar toggle */}
    <button
      type="button"
      onClick={onToggleSidebar}
      aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-150 hover:bg-pink-50 hover:text-pink-500 active:bg-pink-100 active:scale-95"
    >
      {isSidebarOpen ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
      )}
    </button>

    {/* Avatar */}
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-200 bg-pink-50 text-sm font-semibold text-pink-500">
      S
    </div>

    {/* Info */}
    <div className="min-w-0 flex-1">
      <p className="text-[14px] font-semibold text-gray-900">Support agent</p>
      <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
        Online
        {sessionId && (
          <>
            <span className="text-gray-300">·</span>
            <span className="truncate font-mono">{sessionId}</span>
          </>
        )}
      </p>
    </div>
  </header>
)

export default ChatHeader