"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReactionTimeProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, score: { player1: number; player2: number }) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function ReactionTime({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: ReactionTimeProps) {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "clicked" | "tooEarly">("waiting")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [scores, setScores] = useState({ Aziz: [] as number[], Rawan: [] as number[] })
  const [round, setRound] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)

  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = () => {
    setGameState("ready")
    setReactionTime(null)

    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000

    timeoutRef.current = setTimeout(() => {
      setGameState("go")
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      setGameState("tooEarly")
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    if (gameState === "go") {
      const endTime = Date.now()
      const reaction = endTime - startTimeRef.current
      setReactionTime(reaction)
      setGameState("clicked")

      // Update scores
      setScores((prev) => ({
        ...prev,
        [currentPlayer]: [...prev[currentPlayer as keyof typeof prev], reaction],
      }))

      // Update best time
      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction)
      }

      // Switch turns in multiplayer
      if (isMultiplayer && onTurnChange) {
        setTimeout(() => {
          onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
        }, 2000)
      }

      // Check if game should end (5 rounds per player)
      const newRound = round + 1
      setRound(newRound)

      if (newRound >= 10) {
        // 5 rounds per player
        setTimeout(() => {
          const azizAvg = scores.Aziz.reduce((a, b) => a + b, 0) / scores.Aziz.length
          const rawanAvg = scores.Rawan.reduce((a, b) => a + b, 0) / scores.Rawan.length
          const winner = azizAvg < rawanAvg ? "Aziz" : rawanAvg < azizAvg ? "Rawan" : "Tie"
          onGameEnd(winner, { player1: Math.round(azizAvg), player2: Math.round(rawanAvg) })
        }, 2000)
      }
    }
  }

  const resetRound = () => {
    setGameState("waiting")
    setReactionTime(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setReactionTime(null)
    setScores({ Aziz: [], Rawan: [] })
    setRound(0)
    setBestTime(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getAverageTime = (times: number[]) => {
    if (times.length === 0) return 0
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          ⚡ Reaction Time
        </CardTitle>
        {isMultiplayer && (
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Current turn: <span className="font-semibold">{currentPlayer}</span> (Round {round + 1}/10)
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {/* Scores */}
        <div className="mb-6 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl">👨</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Aziz</div>
            <div className={`text-lg font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              {getAverageTime(scores.Aziz)}ms
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              ({scores.Aziz.length} rounds)
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl">👩</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rawan</div>
            <div className={`text-lg font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>
              {getAverageTime(scores.Rawan)}ms
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              ({scores.Rawan.length} rounds)
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="text-center space-y-6">
          {gameState === "waiting" && (
            <div>
              <div className="text-6xl mb-4">⏱️</div>
              <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Test your reaction time!
              </p>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Click the button as soon as it turns green
              </p>
              <Button
                onClick={startGame}
                className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
              >
                Start Round
              </Button>
            </div>
          )}

          {gameState === "ready" && (
            <div>
              <div className="text-6xl mb-4">🔴</div>
              <p className={`text-xl font-bold mb-6 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                Wait for green...
              </p>
              <button
                onClick={handleClick}
                className={`w-32 h-32 rounded-full text-white font-bold text-xl transition-all duration-200 ${
                  isDarkMode ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400"
                }`}
              >
                WAIT
              </button>
            </div>
          )}

          {gameState === "go" && (
            <div>
              <div className="text-6xl mb-4">🟢</div>
              <p className={`text-xl font-bold mb-6 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>CLICK NOW!</p>
              <button
                onClick={handleClick}
                className={`w-32 h-32 rounded-full text-white font-bold text-xl transition-all duration-200 animate-pulse ${
                  isDarkMode ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400"
                }`}
              >
                CLICK!
              </button>
            </div>
          )}

          {gameState === "clicked" && reactionTime && (
            <div>
              <div className="text-6xl mb-4">🎉</div>
              <p className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {reactionTime}ms
              </p>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {reactionTime < 200
                  ? "Lightning fast! ⚡"
                  : reactionTime < 300
                    ? "Great reflexes! 👍"
                    : reactionTime < 400
                      ? "Good reaction! 😊"
                      : "Keep practicing! 💪"}
              </p>
              {round < 9 && (
                <Button
                  onClick={resetRound}
                  className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
                >
                  Next Round
                </Button>
              )}
            </div>
          )}

          {gameState === "tooEarly" && (
            <div>
              <div className="text-6xl mb-4">❌</div>
              <p className={`text-xl font-bold mb-6 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                Too early! Wait for green.
              </p>
              <Button
                onClick={resetRound}
                className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Best Time Display */}
          {bestTime && (
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Best time: <span className="font-bold">{bestTime}ms</span>
            </div>
          )}
        </div>

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
