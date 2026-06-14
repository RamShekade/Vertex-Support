import type { RefObject } from 'react'

type ChatComposerProps = {
  value: string
  characterCount: number
  maxCharacters: number
  error: string | null
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  inputRef: RefObject<HTMLTextAreaElement>
}

const ChatComposer = ({
  value,
  characterCount,
  maxCharacters,
  error,
  isLoading,
  onChange,
  onSubmit,
  inputRef
}: ChatComposerProps) => {
  return (
    <footer className="chat-composer">
      <div className="chat-composer__topline">
        <div className="chat-composer__hint">Enter sends a message. Shift+Enter adds a new line.</div>
        <div className="chat-composer__count" aria-live="polite">
          {characterCount}/{maxCharacters}
        </div>
      </div>

      <div className="chat-composer__field">
        <label className="sr-only" htmlFor="support-chat-input">
          Type your message
        </label>
        <textarea
          id="support-chat-input"
          ref={inputRef}
          className="chat-textarea"
          value={value}
          placeholder="Tell us what you need help with..."
          maxLength={maxCharacters}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              onSubmit()
            }
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'chat-composer-error' : undefined}
        />

        <div className="chat-composer__actions">
          <div
            id="chat-composer-error"
            className="chat-composer__status"
            role={error ? 'alert' : 'status'}
            aria-live="polite"
          >
            {error ?? ' '}
          </div>

          <button className="chat-send-button" type="button" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </div>
    </footer>
  )
}

export default ChatComposer
