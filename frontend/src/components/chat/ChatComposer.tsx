import type { RefObject } from 'react'

const QUICK_PROMPTS = [
  'Where is my order?',
  'How do I return an item?',
  'What are your support hours?',
  'Can I change my delivery address?',
  'How long does a refund take?',
  'My item arrived damaged — what do I do?',
]

type Props = {
  value: string
  characterCount: number
  maxCharacters: number
  error: string | null
  isLoading: boolean
  canSubmit: boolean
  showPrompts: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onSelectPrompt: (prompt: string) => void
  inputRef: RefObject<HTMLTextAreaElement>
}

const ChatComposer = ({
  value, characterCount, maxCharacters, error,
  isLoading, canSubmit, showPrompts,
  onChange, onSubmit, onSelectPrompt, inputRef,
}: Props) => (
  <footer className="shrink-0 bg-white border-t border-gray-100">

    {/* Quick prompts — only when chat is empty */}
    {showPrompts && (
      <div className="px-4 pt-3 pb-1 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="whitespace-nowrap rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-[12px] font-medium text-pink-600 transition-all duration-150 hover:border-pink-400 hover:bg-pink-100 hover:text-pink-700 active:scale-95 shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Composer */}
    <div className="px-4 py-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] text-gray-300">Enter sends · Shift+Enter for new line</span>
        <span className={`text-[11px] ${characterCount > maxCharacters * 0.9 ? 'text-pink-400' : 'text-gray-300'}`}>
          {characterCount} / {maxCharacters}
        </span>
      </div>

      {/* Textarea with arrow inside */}
      <div className="relative">
        <label className="sr-only" htmlFor="support-chat-input">Type your message</label>
        <textarea
          id="support-chat-input"
          ref={inputRef}
          value={value}
          placeholder="Tell us what you need help with…"
          maxLength={maxCharacters}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit() }
          }}
          aria-invalid={Boolean(error)}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 pb-2.5 pl-4 pr-12 pt-2.5 text-[13.5px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all duration-150"
        />

        {/* Up-arrow button inside textarea, bottom-right */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Send message"
          className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500 text-white transition-all duration-150 hover:bg-pink-600 active:bg-pink-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex gap-0.5">
              {[0,1,2].map(i => (
                <span key={i} className="h-1 w-1 animate-bounce rounded-full bg-white"
                  style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </span>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-[12px] text-red-400">{error}</p>
      )}
    </div>
  </footer>
)

export default ChatComposer