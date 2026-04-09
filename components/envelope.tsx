"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

export function Envelope({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="envelope-wrapper"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsOpen(true)
        }}
      >
        <div className={`envelope ${isOpen ? "envelope--open" : "envelope--closed"}`}>
          <div className="envelope__flap" />
          <div className="envelope__pocket" />

          <div className="envelope__letter">
            {isOpen ? (
              <div className="envelope__letter-content">{children}</div>
            ) : (
              <div className="envelope__letter-lines">
                <div className="envelope__line envelope__line--short" />
                <div className="envelope__line" />
                <div className="envelope__line" />
                <div className="envelope__line" />
              </div>
            )}
          </div>

          {isOpen && (
            <div className="envelope__hearts">
              <div className="envelope__heart envelope__heart--a1">
                <Heart className="h-5 w-5 text-rose-400" fill="currentColor" />
              </div>
              <div className="envelope__heart envelope__heart--a2">
                <Heart className="h-7 w-7 text-pink-400" fill="currentColor" />
              </div>
              <div className="envelope__heart envelope__heart--a3">
                <Heart className="h-4 w-4 text-rose-300" fill="currentColor" />
              </div>
            </div>
          )}

          {!isOpen && (
            <div className="envelope__seal">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
          )}
        </div>
      </div>

      {!isOpen && (
        <p className="text-sm text-rose-200/60 animate-pulse">
          tap the envelope to open
        </p>
      )}

      {isOpen && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(false)
          }}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.25em] text-rose-200/70 backdrop-blur-md transition hover:border-white/20 hover:text-rose-100"
        >
          close envelope
        </button>
      )}
    </div>
  )
}
