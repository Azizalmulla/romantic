"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TRUTH_QUESTIONS = [
  "What's your most embarrassing moment together?",
  "What's one thing you've never told me?",
  "What's your biggest fear about our relationship?",
  "What's the sweetest thing I've ever done for you?",
  "What's your favorite memory of us?",
  "What's one thing you'd change about me?",
  "What's your biggest dream for our future?",
  "What's the most romantic thing you've ever imagined?",
  "What's one secret you've been keeping?",
  "What's your favorite thing about me?",
  "What's the craziest thing you'd do for love?",
  "What's your ideal date night?",
  "What's one thing that always makes you think of me?",
  "What's your biggest relationship goal?",
  "What's the most adventurous thing you want to try together?",
]

const DARE_CHALLENGES = [
  "Give me a 30-second massage",
  "Write a short love poem about me",
  "Do your best impression of me",
  "Dance for 1 minute without music",
  "Tell me 5 things you love about me",
  "Sing our favorite song together",
  "Draw a picture of us in 2 minutes",
  "Give me 10 compliments in a row",
  "Act out our first date",
  "Make up a silly nickname for me",
  "Do 10 jumping jacks while saying 'I love you'",
  "Tell me a funny story about us",
  "Pretend to be a romantic movie character",
  "Give me the sweetest hug for 30 seconds",
  "Make me laugh without using words",
]

interface TruthOrDareProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, score: { player1: number; player2: number }) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function TruthOrDare({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: TruthOrDareProps) {
  const [currentChallenge, setCurrentChallenge] = useState("")
  const [challengeType, setChallengeType] = useState<"truth" | "dare" | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState({ Aziz: 0, Rawan: 0 })
  const [round, setRound] = useState(0)

  const startGame = () => {
    setGameActive(true)
    setCurrentChallenge("")
    setChallengeType(null)
    setCompletedChallenges({ Aziz: 0, Rawan: 0 })
    setRound(0)
  }

  const selectTruth = () => {
    const randomTruth = TRUTH_QUESTIONS[Math.floor(Math.random() * TRUTH_QUESTIONS.length)]
    setCurrentChallenge(randomTruth)
    setChallengeType("truth")
  }

  const selectDare = () => {
    const randomDare = DARE_CHALLENGES[Math.floor(Math.random() * DARE_CHALLENGES.length)]
    setCurrentChallenge(randomDare)
    setChallengeType("dare")
  }

  const completeChallenge = () => {
    setCompletedChallenges((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer as keyof typeof prev] + 1,
    }))

    const newRound = round + 1
    setRound(newRound)

    // Switch turns in multiplayer
    if (isMultiplayer && onTurnChange) {
      onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
    }

    // End game after 10 rounds
    if (newRound >= 10) {
      setTimeout(() => {
        onGameEnd("Both", {
          player1: completedChallenges.Aziz + (currentPlayer === "Aziz" ? 1 : 0),
          player2: completedChallenges.Rawan + (currentPlayer === "Rawan" ? 1 : 0),
        })
      }, 1000)
    } else {
      // Reset for next round
      setTimeout(() => {
        setCurrentChallenge("")
        setChallengeType(null)
      }, 2000)
    }
  }

  const skipChallenge = () => {
    const newRound = round + 1
    setRound(newRound)

    // Switch turns in multiplayer
    if (isMultiplayer && onTurnChange) {
      onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
    }

    // End game after 10 rounds
    if (newRound >= 10) {
      setTimeout(() => {
        onGameEnd("Both", {
          player1: completedChallenges.Aziz,
          player2: completedChallenges.Rawan,
        })
      }, 1000)
    } else {
      // Reset for next round
      setTimeout(() => {
        setCurrentChallenge("")
        setChallengeType(null)
      }, 1000)
    }
  }

  const resetGame = () => {
    setGameActive(false)
    setCurrentChallenge("")
    setChallengeType(null)
    setCompletedChallenges({ Aziz: 0, Rawan: 0 })
    setRound(0)
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          💋 Truth or Dare
        </CardTitle>
        {isMultiplayer && gameActive && (
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Current turn: <span className="font-semibold">{currentPlayer}</span> (Round {round + 1}/10)
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {/* Completed Challenges Counter */}
        <div className="mb-6 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl">👨</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Aziz</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              {completedChallenges.Aziz}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">👩</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rawan</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>
              {completedChallenges.Rawan}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>completed</div>
          </div>
        </div>

        {!gameActive ? (
          <div className="text-center">
            <div className="text-6xl mb-4">💋</div>
            <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Ready for some fun challenges?
            </p>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Choose truth or dare and complete romantic challenges together!
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
            {!currentChallenge ? (
              <div className="text-center space-y-6">
                <div className="text-4xl mb-4">🤔</div>
                <p className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {currentPlayer}, choose your challenge:
                </p>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={selectTruth}
                    className={`px-8 py-4 text-lg rounded-lg ${isDarkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-400 text-white"}`}
                  >
                    💭 Truth
                  </Button>
                  <Button
                    onClick={selectDare}
                    className={`px-8 py-4 text-lg rounded-lg ${isDarkMode ? "bg-pink-600 hover:bg-pink-500 text-white" : "bg-pink-500 hover:bg-pink-400 text-white"}`}
                  >
                    🎯 Dare
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-4xl mb-4">{challengeType === "truth" ? "💭" : "🎯"}</div>

                <div
                  className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      challengeType === "truth"
                        ? isDarkMode
                          ? "text-blue-400"
                          : "text-blue-600"
                        : isDarkMode
                          ? "text-pink-400"
                          : "text-pink-600"
                    }`}
                  >
                    {challengeType === "truth" ? "Truth Question:" : "Dare Challenge:"}
                  </h3>
                  <p className={`text-xl leading-relaxed ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {currentChallenge}
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={completeChallenge}
                    className={`px-6 py-3 rounded-lg ${isDarkMode ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-500 hover:bg-green-400 text-white"}`}
                  >
                    ✅ Completed
                  </Button>
                  <Button
                    onClick={skipChallenge}
                    variant="outline"
                    className={`px-6 py-3 rounded-lg ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                  >
                    ⏭️ Skip
                  </Button>
                </div>
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
