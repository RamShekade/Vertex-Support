type Props = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

const ChatHeader = ({ isSidebarOpen, onToggleSidebar }: Props) => (
  <header className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
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

    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-200 bg-pink-50 text-sm font-semibold text-pink-500">
      S
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[14px] font-semibold text-gray-900">Spur's Vertex</p>
    </div>
  </header>
)

export default ChatHeader