"use client"

import { useState, useEffect } from "react"
import { Heart, Moon, Sun } from "lucide-react"
import FloatingHearts from "./components/floating-hearts"
import loveMessages from "../data/love-messages.json"

export default function LoveMessagesForRawan() {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [timeUntilNext, setTimeUntilNext] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Get message index based on days since a fixed start date
  const getMessageIndex = () => {
    // Set start date to December 31, 2024 so that January 1, 2025 shows the Batman message (index 0)
    const startDate = new Date("2024-12-31")
    const today = new Date()

    // Calculate days since start date
    const daysDifference = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Return the message index (cycles through all messages)
    return daysDifference % loveMessages.messages.length
  }

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

  // Update message and countdown
  const updateMessage = () => {
    const index = getMessageIndex()
    setMessageIndex(index)
    setCurrentMessage(loveMessages.messages[index])

    const timeLeft = getTimeUntilMidnight()
    setTimeUntilNext(formatTimeRemaining(timeLeft))
  }

  useEffect(() => {
    // Set initial message
    updateMessage()
    setIsLoading(false)

    // Update countdown every minute
    const countdownInterval = setInterval(() => {
      const timeLeft = getTimeUntilMidnight()
      setTimeUntilNext(formatTimeRemaining(timeLeft))

      // Check if it's a new day and update message if needed
      const currentIndex = getMessageIndex()
      if (currentIndex !== messageIndex) {
        updateMessage()
      }
    }, 60000) // Update every minute

    // Set up timer to change message at midnight
    const now = new Date()
    const timeUntilMidnight = getTimeUntilMidnight()

    const midnightTimer = setTimeout(() => {
      updateMessage()

      // Set up daily interval for subsequent days
      const dailyInterval = setInterval(
        () => {
          updateMessage()
        },
        24 * 60 * 60 * 1000,
      ) // 24 hours

      return () => clearInterval(dailyInterval)
    }, timeUntilMidnight)

    return () => {
      clearTimeout(midnightTimer)
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
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-black"
          : "bg-gradient-to-br from-gray-900 via-black to-gray-900"
      }`}
    >
      {/* Floating Hearts Animation */}
      <FloatingHearts />

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 ${
          isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/20 hover:bg-black/30 text-white"
        } backdrop-blur-sm`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Heart className={`w-16 h-16 mx-auto mb-6 animate-pulse ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
          <h1 className={`text-4xl md:text-6xl font-light mb-4 ${isDarkMode ? "text-white" : "text-white"}`}>
            For My Beautiful Rawan
          </h1>
          <p className={`text-lg md:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-300"}`}>
            A new message of love, every single day 💕
          </p>
        </div>

        {/* Daily Love Message */}
        <div
          className={`max-w-4xl mx-auto rounded-3xl p-8 md:p-12 shadow-2xl border animate-slide-up ${
            isDarkMode
              ? "bg-gray-900/80 border-gray-700 backdrop-blur-sm"
              : "bg-black/60 border-gray-800 backdrop-blur-sm"
          }`}
        >
          <div className="text-3xl md:text-5xl mb-8 text-center">💕</div>
          <p
            className={`text-lg md:text-2xl leading-relaxed font-light mb-8 text-center ${
              isDarkMode ? "text-gray-100" : "text-gray-100"
            }`}
          >
            {currentMessage}
          </p>
          <div className="text-right">
            <p className={`text-lg md:text-xl font-medium ${isDarkMode ? "text-pink-400" : "text-pink-400"}`}>
              Forever yours,
            </p>
            <p className={`text-2xl md:text-3xl font-light ${isDarkMode ? "text-pink-300" : "text-pink-300"}`}>
              Aziz 💖
            </p>
          </div>
        </div>

        {/* Message Info */}
        <div className="text-center mt-8 animate-fade-in-delay">
          <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Message #{messageIndex + 1} of {loveMessages.messages.length}
          </p>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Next message in: {timeUntilNext} ✨
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-fade-in-delay">
          <div className="flex justify-center items-center gap-2">
            <Heart className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-400"}`} />
            <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>iloverawan.fyi</span>
            <Heart className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-400"}`} />
          </div>
        </div>
      </main>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ec4899' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  )
}
