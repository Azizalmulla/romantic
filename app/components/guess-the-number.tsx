"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GuessTheNumberProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, score: { player1: number; player2: number }) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function GuessTheNumber({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: GuessTheNumberProps) {
  const [targetNumber, setTargetNumber] = useState(0)
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState({ Aziz: 0, Rawan: 0 })
  const [gameActive, setGameActive] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [guessHistory, setGuessHistory] = useState<{ player: string; guess: number; feedback: string }[]>([])
  const [round, setRound] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)

  const startGame = () => {
    const number = Math.floor(Math.random() * 100) + 1
    setTargetNumber(number)
    setGameActive(true)
    setAttempts({ Aziz: 0, Rawan: 0 })
    setFeedback("")
    setGuessHistory([])
    setRound((prev) => prev + 1)
    setWinner(null)
    console.log("Target number:", number) // For debugging
  }

  const makeGuess = () => {
    const guessNum = Number.parseInt(guess)
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setFeedback("Please enter a number between 1 and 100")
      return
    }

    const newAttempts = {
      ...attempts,
      [currentPlayer]: attempts[currentPlayer as keyof typeof attempts] + 1,
    }
    setAttempts(newAttempts)

    let feedbackText = ""
    if (guessNum === targetNumber) {
      feedbackText = "🎉 Correct!"
      setWinner(currentPlayer)
      setGameActive(false)

      setTimeout(() => {
        onGameEnd(currentPlayer, {
          player1: newAttempts.Aziz,
          player2: newAttempts.Rawan,
        })
      }, 2000)
    } else if (guessNum < targetNumber) {
      feedbackText = "📈 Too low"
    } else {
      feedbackText = "📉 Too high"
    }

    setFeedback(feedbackText)
    setGuessHistory((prev) => [
      ...prev,
      {
        player: currentPlayer,
        guess: guessNum,
        feedback: feedbackText,
      },
    ])

    // Switch turns in multiplayer if guess is wrong
    if (isMultiplayer && onTurnChange && guessNum !== targetNumber) {
      setTimeout(() => {
        onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
      }, 1500)
    }

    setGuess("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && guess && gameActive) {
      makeGuess()
    }
  }

  const resetGame = () => {
    setGameActive(false)
    setTargetNumber(0)
    setGuess("")
    setAttempts({ Aziz: 0, Rawan: 0 })
    setFeedback("")
    setGuessHistory([])
    setRound(0)
    setWinner(null)
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          🎯 Guess the Number
        </CardTitle>
        {isMultiplayer && gameActive && (
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Current turn: <span className="font-semibold">{currentPlayer}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {/* Attempts Counter */}
        <div className="mb-6 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl">👨</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Aziz</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              {attempts.Aziz}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">👩</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rawan</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>
              {attempts.Rawan}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>attempts</div>
          </div>
        </div>

        {!gameActive ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              I'm thinking of a number between 1 and 100!
            </p>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {isMultiplayer
                ? "Take turns guessing. Whoever guesses correctly wins!"
                : "Try to guess it in as few attempts as possible!"}
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
            {/* Game Info */}
            <div className="text-center">
              <p className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Guess a number between 1 and 100
              </p>
              {feedback && (
                <p
                  className={`text-xl font-bold mb-4 ${
                    feedback.includes("🎉")
                      ? isDarkMode
                        ? "text-green-400"
                        : "text-green-600"
                      : feedback.includes("📈") || feedback.includes("📉")
                        ? isDarkMode
                          ? "text-yellow-400"
                          : "text-yellow-600"
                        : isDarkMode
                          ? "text-red-400"
                          : "text-red-600"
                  }`}
                >
                  {feedback}
                </p>
              )}
            </div>

            {/* Input Section */}
            {!winner && (
              <div className="flex gap-2 justify-center">
                <Input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your guess"
                  min="1"
                  max="100"
                  className={`w-48 text-center text-lg ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  disabled={!gameActive}
                />
                <Button
                  onClick={makeGuess}
                  disabled={!guess || !gameActive}
                  className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
                >
                  Guess
                </Button>
              </div>
            )}

            {/* Guess History */}
            {guessHistory.length > 0 && (
              <div
                className={`p-4 rounded-lg border max-h-48 overflow-y-auto ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
              >
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Guess History:</h4>
                <div className="space-y-1">
                  {guessHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          entry.player === "Aziz"
                            ? isDarkMode
                              ? "text-blue-400"
                              : "text-blue-600"
                            : isDarkMode
                              ? "text-pink-400"
                              : "text-pink-600"
                        }`}
                      >
                        {entry.player}: {entry.guess}
                      </span>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {entry.feedback}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Winner Display */}
            {winner && (
              <div className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{winner} wins!</p>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  The number was {targetNumber}
                </p>
              </div>
            )}
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
