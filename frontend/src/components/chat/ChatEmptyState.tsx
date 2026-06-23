const EmptyState = () => (
  <div className="flex flex-1 items-center justify-center px-6 py-12">
    <div className="text-center">

      {/* Animated ring + icon */}
      <div className="relative mx-auto mb-6 h-16 w-16">
        {/* Pulsing outer ring */}
        <span className="absolute inset-0 rounded-full border-2 border-pink-200 animate-ping opacity-50" />
        {/* Static inner circle */}
        <span className="absolute inset-0 rounded-full border border-pink-100 bg-pink-50" />
        {/* Icon */}
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-6 w-6 text-pink-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </span>
      </div>

      {/* Floating suggestion chips */}
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {['Shipping & delivery', 'Returns & refunds', 'Order status', 'Support hours'].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-[12px] font-medium text-pink-400"
          >
            {chip}
          </span>
        ))}
      </div>

      <h2 className="text-[15px] font-semibold text-gray-900">Where should we begin?</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-gray-400">
        Ask us anything — we usually reply in seconds.
      </p>

      {/* Subtle animated dots to suggest activity */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-pink-300 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

    </div>
  </div>
)