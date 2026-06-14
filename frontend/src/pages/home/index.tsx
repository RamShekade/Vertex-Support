import ConversationSidebar from '@/components/chat/ConversationSidebar'
import ChatComposer from '@/components/chat/ChatComposer'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessageList from '@/components/chat/ChatMessageList'
import { useChat } from '@/hooks/useChat'

const MAX_CHARACTERS = 5000

const HomePage = () => {
  const {
    messages,
    conversations,
    inputValue,
    setInputValue,
    sessionId,
    isLoading,
    isRestoring,
    isLoadingConversations,
    error,
    characterCount,
    inputRef,
    messagesEndRef,
    clearError,
    sendMessage,
    openConversation,
    startNewConversation
  } = useChat()

  return (
    <main className="app-shell">
      <section className="chat-shell" aria-label="Customer support chat">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={sessionId}
          isLoading={isLoadingConversations}
          onOpenConversation={openConversation}
          onStartNewConversation={startNewConversation}
        />

        <section className="chat-card">
          <ChatHeader sessionId={sessionId} />

          <div className="chat-body">
            {error ? (
              <div className="chat-error" role="alert" aria-live="assertive" onClick={clearError}>
                {error}
              </div>
            ) : null}

            <div className="chat-messages">
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
              onChange={(nextValue) => {
                clearError()
                setInputValue(nextValue)
              }}
              onSubmit={sendMessage}
              inputRef={inputRef}
            />
          </div>
        </section>
      </section>
    </main>
  )
}

export default HomePage
