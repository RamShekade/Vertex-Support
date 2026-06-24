import type { RefObject } from "react";
import {
  ArrowUp,
  Clock3,
  MapPin,
  Package,
  RotateCcw,
  Paperclip,
} from "lucide-react";

const QUICK_PROMPTS = [
  {
    icon: Package,
    text: "Where is my order?",
  },
  {
    icon: RotateCcw,
    text: "How do I return an item?",
  },
  {
    icon: Clock3,
    text: "Support hours",
  },
  {
    icon: MapPin,
    text: "Change delivery address",
  },
];

type Props = {
  value: string;
  characterCount: number;
  maxCharacters: number;
  error: string | null;
  isLoading: boolean;
  canSubmit: boolean;
  showPrompts: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelectPrompt: (prompt: string) => void;
  inputRef: RefObject<HTMLTextAreaElement>;
};

const ChatComposer = ({
  value,
  characterCount,
  maxCharacters,
  error,
  isLoading,
  canSubmit,
  showPrompts,
  onChange,
  onSubmit,
  onSelectPrompt,
  inputRef,
}: Props) => {
  return (
    <footer className="bg-transparent px-6 pb-4 pt-3">
      <div className="mx-auto max-w-5xl">
        {showPrompts && (
          <div className="mb-5 flex flex-wrap gap-3">
            {QUICK_PROMPTS.map(({ icon: Icon, text }) => (
              <button
                key={text}
                type="button"
                onClick={() => onSelectPrompt(text)}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition-all
                  hover:border-pink-300
                  hover:bg-pink-50
                  hover:text-pink-600
                  active:scale-95
                "
              >
                <Icon className="h-4 w-4" />
                <span>{text}</span>
              </button>
            ))}
          </div>
        )}

        <div
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            transition
            focus-within:border-pink-300
            focus-within:ring-2
            focus-within:ring-pink-100
          "
        >
          <div className="flex items-start px-4 pt-2">
            <textarea
              id="support-chat-input"
              ref={inputRef}
              rows={1}
              maxLength={maxCharacters}
              value={value}
              placeholder="Type your message to Vertex..."
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              className="
                ml-3
                w-full
                resize-none
                overflow-hidden
                bg-transparent
                py-3
                text-sm
                text-gray-900
                outline-none
                placeholder:text-gray-400
              "
            />
          </div>

          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                Enter ↵ to send
              </span>

              <span
                className={`text-xs ${
                  characterCount > maxCharacters * 0.9
                    ? "text-pink-500"
                    : "text-gray-300"
                }`}
              >
                {characterCount}/{maxCharacters}
              </span>
            </div>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-pink-600
                text-white
                shadow-[0_4px_12px_rgba(236,72,153,0.25)]
                transition-all
                hover:bg-pink-700
                hover:scale-105
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between px-2 text-xs text-gray-400">
          <span>🛡 End-to-end encrypted</span>

          <span>Vertex v2.4.1 • Confidence Score: 98%</span>
        </div>
      </div>
    </footer>
  );
};

export default ChatComposer;