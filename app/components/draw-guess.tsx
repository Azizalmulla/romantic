"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DRAWING_WORDS = [
  "heart",
  "flower",
  "star",
  "sun",
  "moon",
  "tree",
  "house",
  "cat",
  "dog",
  "bird",
  "car",
  "boat",
  "fish",
  "butterfly",
  "rainbow",
  "cloud",
  "mountain",
  "beach",
  "cake",
  "gift",
]

interface DrawGuessProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, score: { player1: number; player2: number }) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function DrawGuess({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: DrawGuessProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentWord, setCurrentWord] = useState("")
  const [guess, setGuess] = useState("")
  const [gamePhase, setGamePhase] = useState<"setup" | "drawing" | "guessing" | "result">("setup")
  const [score, setScore] = useState({ Aziz: 0, Rawan: 0 })
  const [timeLeft, setTimeLeft] = useState(60)
  const [round, setRound] = useState(0)
  const [drawer, setDrawer] = useState("Aziz")
  const [guesser, setGuesser] = useState("Rawan")

  const startGame = () => {
    const word = DRAWING_WORDS[Math.floor(Math.random() * DRAWING_WORDS.length)]
    setCurrentWord(word)
    setGamePhase("drawing")
    setTimeLeft(60)
    clearCanvas()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = isDarkMode ? "#1f2937" : "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gamePhase !== "drawing") return
    setIsDrawing(true)
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || gamePhase !== "drawing") return

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ctx.lineWidth = 3
        ctx.lineCap = "round"
        ctx.strokeStyle = isDarkMode ? "#ffffff" : "#000000"

        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.beginPath()
        }
      }
    }
  }

  const finishDrawing = () => {
    setGamePhase("guessing")
    setTimeLeft(30)
  }

  const submitGuess = () => {
    const isCorrect = guess.toLowerCase().trim() === currentWord.toLowerCase()

    if (isCorrect) {
      setScore((prev) => ({
        ...prev,
        [guesser]: prev[guesser as keyof typeof prev] + 1,
        [drawer]: prev[drawer as keyof typeof prev] + 1,
      }))
    }

    setGamePhase("result")

    setTimeout(() => {
      const newRound = round + 1
      setRound(newRound)

      // Switch roles
      setDrawer(drawer === "Aziz" ? "Rawan" : "Aziz")
      setGuesser(guesser === "Aziz" ? "Rawan" : "Aziz")

      if (newRound >= 4) {
        // 2 rounds per player
        const winner = score.Aziz > score.Rawan ? "Aziz" : score.Rawan > score.Aziz ? "Rawan" : "Tie"
        onGameEnd(winner, { player1: score.Aziz, player2: score.Rawan })
      } else {
        setGamePhase("setup")
        setGuess("")
      }
    }, 3000)
  }

  // Timer effect
  useEffect(() => {
    if ((gamePhase === "drawing" || gamePhase === "guessing") && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      if (gamePhase === "drawing") {
        setGamePhase("guessing")
        setTimeLeft(30)
      } else if (gamePhase === "guessing") {
        setGamePhase("result")
        setTimeout(() => {
          const newRound = round + 1
          setRound(newRound)
          setDrawer(drawer === "Aziz" ? "Rawan" : "Aziz")
          setGuesser(guesser === "Aziz" ? "Rawan" : "Aziz")

          if (newRound >= 4) {
            const winner = score.Aziz > score.Rawan ? "Aziz" : score.Rawan > score.Aziz ? "Rawan" : "Tie"
            onGameEnd(winner, { player1: score.Aziz, player2: score.Rawan })
          } else {
            setGamePhase("setup")
            setGuess("")
          }
        }, 2000)
      }
    }
  }, [gamePhase, timeLeft, round, drawer, guesser, score, onGameEnd])

  // Initialize canvas
  useEffect(() => {
    clearCanvas()
  }, [isDarkMode])

  const resetGame = () => {
    setGamePhase("setup")
    setScore({ Aziz: 0, Rawan: 0 })
    setRound(0)
    setDrawer("Aziz")
    setGuesser("Rawan")
    setGuess("")
    setCurrentWord("")
    clearCanvas()
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          🎨 Draw & Guess
        </CardTitle>
        {gamePhase !== "setup" && (
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            <p>
              Round {round + 1}/4 • {drawer} draws, {guesser} guesses
            </p>
            <p className="font-bold text-lg">{timeLeft}s</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6">
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

        {gamePhase === "setup" && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Ready to draw and guess?</p>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {drawer} will draw "{currentWord || "a word"}" and {guesser} will guess!
            </p>
            <Button
              onClick={startGame}
              className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
            >
              Start Round
            </Button>
          </div>
        )}

        {gamePhase === "drawing" && (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {drawer}, draw: "{currentWord}"
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Draw the word above. {guesser} can't see the word!
              </p>
            </div>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className={`border-2 rounded-lg cursor-crosshair ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            <div className="flex justify-center gap-2">
              <Button
                onClick={clearCanvas}
                variant="outline"
                className={`rounded-lg ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                Clear
              </Button>
              <Button
                onClick={finishDrawing}
                className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
              >
                Done Drawing
              </Button>
            </div>
          </div>
        )}

        {gamePhase === "guessing" && (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {guesser}, what is this drawing?
              </p>
            </div>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className={`border-2 rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
              />
            </div>

            <div className="flex gap-2 justify-center">
              <Input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && guess.trim() && submitGuess()}
                placeholder="Your guess..."
                className={`w-48 text-center ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
              />
              <Button
                onClick={submitGuess}
                disabled={!guess.trim()}
                className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
              >
                Guess
              </Button>
            </div>
          </div>
        )}

        {gamePhase === "result" && (
          <div className="text-center">
            <div className="text-6xl mb-4">
              {guess.toLowerCase().trim() === currentWord.toLowerCase() ? "🎉" : "😅"}
            </div>
            <p className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              The word was: "{currentWord}"
            </p>
            <p
              className={`text-lg mb-4 ${
                guess.toLowerCase().trim() === currentWord.toLowerCase()
                  ? isDarkMode
                    ? "text-green-400"
                    : "text-green-600"
                  : isDarkMode
                    ? "text-red-400"
                    : "text-red-600"
              }`}
            >
              {guess.toLowerCase().trim() === currentWord.toLowerCase()
                ? "Correct! Both players get a point!"
                : `Wrong! You guessed: "${guess}"`}
            </p>
          </div>
        )}

        {/* Reset Game Button */}
        {round > 0 && gamePhase === "setup" && (
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
