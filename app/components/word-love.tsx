"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LOVE_WORDS = [
  "HEART",
  "LOVE",
  "KISS",
  "HUG",
  "SOUL",
  "DEAR",
  "CARE",
  "WARM",
  "SWEET",
  "CUTE",
  "ANGEL",
  "HONEY",
  "DREAM",
  "SMILE",
  "HAPPY",
  "MAGIC",
  "SPARK",
  "SHINE",
  "GLOW",
  "BLISS",
]

interface WordLoveProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, score: { player1: number; player2: number }) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function WordLove({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: WordLoveProps) {
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [guess, setGuess] = useState("")
  const [score, setScore] = useState({ Aziz: 0, Rawan: 0 })
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [round, setRound] = useState(0)
  const [hint, setHint] = useState("")

  const scrambleWord = (word: string) => {
    const letters = word.split("")
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    return letters.join("")
  }

  const getHint = (word: string) => {
    const hints: { [key: string]: string } = {
      HEART: "💖 The organ of love",
      LOVE: "💕 The strongest emotion",
      KISS: "💋 A romantic gesture",
      HUG: "🤗 A warm embrace",
      SOUL: "✨ Your inner essence",
      DEAR: "💝 A term of endearment",
      CARE: "🤲 To look after someone",
      WARM: "🔥 Cozy and comfortable",
      SWEET: "🍯 Like honey or sugar",
      CUTE: "🥰 Adorably attractive",
      ANGEL: "👼 A heavenly being",
      HONEY: "🍯 Sweet golden liquid",
      DREAM: "💭 What you see when sleeping",
      SMILE: "😊 Happy facial expression",
      HAPPY: "😄 Feeling joyful",
      MAGIC: "✨ Supernatural power",
      SPARK: "⚡ A small flash of light",
      SHINE: "🌟 To emit bright light",
      GLOW: "🌅 Soft steady light",
      BLISS: "😇 Perfect happiness",
    }
    return hints[word] || "A lovely word!"
  }

  const startGame = () => {
    const word = LOVE_WORDS[Math.floor(Math.random() * LOVE_WORDS.length)]
    setCurrentWord(word)
    setScrambledWord(scrambleWord(word))
    setHint(getHint(word))
    setGameActive(true)
    setTimeLeft(30)
    setFeedback("")
    setGuess("")
  }

  const submitGuess = () => {
    if (guess.toUpperCase() === currentWord) {
      setScore((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer as keyof typeof prev] + 1,
      }))
      setFeedback("🎉 Correct!")

      setTimeout(() => {
        nextRound()
      }, 2000)
    } else {
      setFeedback("❌ Try again!")

      // Switch turns in multiplayer on wrong answer
      if (isMultiplayer && onTurnChange) {
        setTimeout(() => {
          onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
          setFeedback("")
        }, 1500)
      } else {
        setTimeout(() => {
          setFeedback("")
        }, 1500)
      }
    }
    setGuess("")
  }

  const nextRound = () => {
    const newRound = round + 1
    setRound(newRound)

    if (newRound >= 10) {
      // 10 rounds total
      setGameActive(false)
      const winner = score.Aziz > score.Rawan ? "Aziz" : score.Rawan > score.Aziz ? "Rawan" : "Tie"
      onGameEnd(winner, { player1: score.Aziz, player2: score.Rawan })
    } else {
      // Switch turns in multiplayer
      if (isMultiplayer && onTurnChange) {
        onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
      }

      setTimeout(() => {
        const word = LOVE_WORDS[Math.floor(Math.random() * LOVE_WORDS.length)]
        setCurrentWord(word)
        setScrambledWord(scrambleWord(word))
        setHint(getHint(word))
        setTimeLeft(30)
        setFeedback("")
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && guess && gameActive) {
      submitGuess()
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameActive && timeLeft > 0 && !feedback.includes("🎉")) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      setFeedback(`⏰ Time's up! The word was: ${currentWord}`)

      // Switch turns in multiplayer
      if (isMultiplayer && onTurnChange) {
        setTimeout(() => {
          onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
          nextRound()
        }, 2000)
      } else {
        setTimeout(() => {
          nextRound()
        }, 2000)
      }
    }
  }, [gameActive, timeLeft, feedback, currentWord, isMultiplayer, onTurnChange, currentPlayer])

  const resetGame = () => {
    setGameActive(false)
    setCurrentWord("")
    setScrambledWord("")
    setGuess("")
    setScore({ Aziz: 0, Rawan: 0 })
    setTimeLeft(30)
    setFeedback("")
    setRound(0)
    setHint("")
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          💕 Word Love
        </CardTitle>
        {isMultiplayer && gameActive && (
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Current turn: <span className="font-semibold">{currentPlayer}</span> (Round {round + 1}/10)
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {/* Timer */}
        {gameActive && (
          <div className="text-center mb-6">
            <div className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{timeLeft}s</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scores */}
        <div className="mb-6 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl">👨</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Aziz</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{score.Aziz}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">👩</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rawan</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>{score.Rawan}</div>
          </div>
        </div>

        {!gameActive ? (
          <div className="text-center">
            <div className="text-6xl mb-4">💕</div>
            <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Unscramble the love words!
            </p>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Rearrange the letters to form romantic words
            </p>
            <Button
              onClick={startGame}
              className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
            >
              Start Game
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scrambled Word */}
            <div className="text-center">
              <div className={`text-4xl font-bold mb-4 tracking-wider ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {scrambledWord}
              </div>

              {/* Hint */}
              <div className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Hint: {hint}</div>

              {feedback && (
                <div
                  className={`text-lg font-semibold mb-4 ${
                    feedback.includes("🎉")
                      ? isDarkMode
                        ? "text-green-400"
                        : "text-green-600"
                      : feedback.includes("⏰")
                        ? isDarkMode
                          ? "text-yellow-400"
                          : "text-yellow-600"
                        : isDarkMode
                          ? "text-red-400"
                          : "text-red-600"
                  }`}
                >
                  {feedback}
                </div>
              )}

              {!feedback.includes("🎉") && !feedback.includes("⏰") && (
                <div className="flex gap-2 justify-center">
                  <Input
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Unscramble the word"
                    className={`w-48 text-center text-lg ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                    disabled={feedback !== ""}
                  />
                  <Button
                    onClick={submitGuess}
                    disabled={!guess || feedback !== ""}
                    className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reset Game Button */}
        {round > 0 && (
          <div className="text-center mt-6">
            <Button
              onClick={resetGame}
              variant="outline"
              size="sm"
              className={`rounded-lg ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Reset Game
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
