"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickMathProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, score: { player1: number; player2: number }) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function QuickMath({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: QuickMathProps) {
  const [problem, setProblem] = useState({ question: "", answer: 0 })
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState({ Aziz: 0, Rawan: 0 })
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [feedback, setFeedback] = useState("")

  const generateProblem = () => {
    const operations = ["+", "-", "×"]
    const operation = operations[Math.floor(Math.random() * operations.length)]

    let num1, num2, answer, question

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        answer = num1 + num2
        question = `${num1} + ${num2}`
        break
      case "-":
        num1 = Math.floor(Math.random() * 50) + 25
        num2 = Math.floor(Math.random() * 25) + 1
        answer = num1 - num2
        question = `${num1} - ${num2}`
        break
      case "×":
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        question = `${num1} × ${num2}`
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
        question = "1 + 1"
    }

    setProblem({ question, answer })
  }

  const startGame = () => {
    setGameActive(true)
    setTimeLeft(30)
    setScore({ Aziz: 0, Rawan: 0 })
    setFeedback("")
    generateProblem()
  }

  const submitAnswer = () => {
    const answer = Number.parseInt(userAnswer)
    if (answer === problem.answer) {
      setScore((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer as keyof typeof prev] + 1,
      }))
      setFeedback("✅ Correct!")
    } else {
      setFeedback(`❌ Wrong! Answer was ${problem.answer}`)

      // Switch turns in multiplayer on wrong answer
      if (isMultiplayer && onTurnChange) {
        onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
      }
    }

    setUserAnswer("")
    setTimeout(() => {
      setFeedback("")
      generateProblem()
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userAnswer && gameActive) {
      submitAnswer()
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameActive(false)
      const winner = score.Aziz > score.Rawan ? "Aziz" : score.Rawan > score.Aziz ? "Rawan" : "Tie"
      onGameEnd(winner, { player1: score.Aziz, player2: score.Rawan })
    }
  }, [gameActive, timeLeft, score, onGameEnd])

  // Generate initial problem
  useEffect(() => {
    generateProblem()
  }, [])

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          🧮 Quick Math
        </CardTitle>
        {isMultiplayer && gameActive && (
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Current turn: <span className="font-semibold">{currentPlayer}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{timeLeft}s</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </div>

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

        {gameActive ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {problem.question} = ?
              </div>

              {feedback && (
                <div
                  className={`text-lg font-semibold mb-4 ${
                    feedback.includes("✅")
                      ? isDarkMode
                        ? "text-green-400"
                        : "text-green-600"
                      : isDarkMode
                        ? "text-red-400"
                        : "text-red-600"
                  }`}
                >
                  {feedback}
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Your answer"
                  className={`w-32 text-center text-xl ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  disabled={!gameActive || feedback !== ""}
                />
                <Button
                  onClick={submitAnswer}
                  disabled={!userAnswer || !gameActive || feedback !== ""}
                  className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button
              onClick={startGame}
              className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
            >
              Start Game
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
