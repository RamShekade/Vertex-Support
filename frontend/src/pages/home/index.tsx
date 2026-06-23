import { useState } from 'react'
import ConversationSidebar from '@/components/chat/ConversationSidebar'
import ChatComposer from '@/components/chat/ChatComposer'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessageList from '@/components/chat/ChatMessageList'
import { useChat } from '@/hooks/useChat'

const MAX_CHARACTERS = 5000

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const {
    messages, conversations, inputValue, setInputValue,
    sessionId, isLoading, isRestoring, isLoadingConversations,
    error, characterCount, canSendMessage, inputRef, messagesEndRef,
    clearError, sendMessage, openConversation, startNewConversation,
  } = useChat()

  const handleSelectPrompt = (prompt: string) => {
    clearError()
    setInputValue(prompt)
    inputRef.current?.focus()
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <section className="flex h-full w-full overflow-hidden" aria-label="Customer support chat">

        <ConversationSidebar
          conversations={conversations}
          activeConversationId={sessionId}
          isLoading={isLoadingConversations}
          isOpen={isSidebarOpen}
          onOpenConversation={openConversation}
          onStartNewConversation={startNewConversation}
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
          <ChatHeader
            sessionId={sessionId}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              onClick={clearError}
              className="shrink-0 cursor-pointer bg-red-50 px-5 py-2.5 text-[13px] text-red-500 hover:bg-red-100 transition-colors"
            >
              {error}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              isRestoring={isRestoring}
              bottomRef={messagesEndRef}
            />
          </div>

          <ChatComposer
            value={inputValue}
            characterCount={characterCount}
            maxCharacters={MAX_CHARACTERS}
            error={error}
            isLoading={isLoading || isRestoring}
            canSubmit={canSendMessage}
            showPrompts={messages.length === 0 && !isRestoring}
            onChange={(next) => { clearError(); setInputValue(next) }}
            onSubmit={sendMessage}
            onSelectPrompt={handleSelectPrompt}
            inputRef={inputRef}
          />
        </section>

      </section>
    </main>
  )
}

export default HomePage