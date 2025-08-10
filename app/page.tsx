"use client"

import { useState, useEffect } from "react"
import { Heart, Moon, Sun } from "lucide-react"
import FloatingHearts from "./components/floating-hearts"

export default function LoveMessagesForRawan() {
  const [currentMessage, setCurrentMessage] = useState(
    "Day 2-3 without you is so hard, I have no energy walla, I feel alone, unmotivated, I miss you so much walla il atheem baby I really can't stop crying baby I miss you. You are the best thing that happened to me, I'm never giving up on us, you are my first and last love, my bestfriend and I'm going to marry you walla. I miss your pretty face and your laugh, I miss your voice I miss your jokes, I miss bdlyatch I miss when you make fun of me, I miss when I make fun of you, I miss sleeping with you, I miss everything about you. I truly love you baby, I'll always be here waiting for you and only you, I promise 💕",
  )
  const [messageIndex, setMessageIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const [timeUntilNext, setTimeUntilNext] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Get time until next message (midnight)
  const getTimeUntilMidnight = () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0) // Next midnight
    return midnight.getTime() - now.getTime()
  }

  // Format time remaining until next message
  const formatTimeRemaining = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    setIsLoading(false)

    // Update countdown every minute
    const countdownInterval = setInterval(() => {
      const timeLeft = getTimeUntilMidnight()
      setTimeUntilNext(formatTimeRemaining(timeLeft))
    }, 60000) // Update every minute

    // Initial countdown
    const timeLeft = getTimeUntilMidnight()
    setTimeUntilNext(formatTimeRemaining(timeLeft))

    return () => {
      clearInterval(countdownInterval)
    }
  }, [])

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark")
      document.body.style.backgroundColor = "#000000"
    } else {
      document.body.classList.remove("dark")
      document.body.style.backgroundColor = "#111827"
    }
  }, [isDarkMode])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-gray-600">Loading your love message...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Childhood Memories Background - Full visibility */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/images/childhood-memories.jpg')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000000",
        }}
      />

      {/* Floating Hearts Animation */}
      <FloatingHearts />

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse text-pink-500" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">For My Beautiful Rawan</h1>
          <p className="text-lg md:text-xl text-white drop-shadow-xl font-medium">Missing you with all my heart 💔</p>
        </div>

        {/* Daily Love Message */}
        <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-12 shadow-2xl border animate-slide-up bg-black/85 border-white/20 backdrop-blur-lg">
          <div className="text-3xl md:text-5xl mb-8 text-center">💔</div>
          <p className="text-base md:text-xl leading-relaxed font-light mb-8 text-left text-white">{currentMessage}</p>
          <div className="text-right">
            <p className="text-lg md:text-xl font-medium text-pink-400">Always yours,</p>
            <p className="text-2xl md:text-3xl font-light text-pink-300">Aziz 💖</p>
          </div>
        </div>

        {/* Message Info */}
        <div className="text-center mt-8 animate-fade-in-delay">
          <p className="text-sm mb-2 text-white drop-shadow-lg font-medium">From the heart 💝</p>
          <p className="text-sm text-white drop-shadow-lg font-medium">Waiting for you always ✨</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-fade-in-delay">
          <div className="flex justify-center items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-white drop-shadow-lg font-medium">iloverawan.fyi</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
        </div>
      </main>
    </div>
  )
}
