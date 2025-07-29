"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STORY_PROMPTS = [
  "Once upon a time, in a magical kingdom where love ruled everything...",
  "Two hearts met under the starlit sky, and suddenly...",
  "In a world where emotions had colors, their love was...",
  "The old wise tree whispered secrets of eternal love, saying...",
  "When the clock struck midnight, something magical happened to their relationship...",
  "In a library filled with love letters from the past...",
  "The shooting star granted them one wish for their love story...",
  "In a garden where flowers bloomed with every kind word...",
]

interface StoryBuilderProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, story: string) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function StoryBuilder({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: StoryBuilderProps) {
  const [story, setStory] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [userInput, setUserInput] = useState("")
  const [gameStarted, setGameStarted] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [contributions, setContributions] = useState<{ player: string; text: string }[]>([])

  const startGame = () => {
    const randomPrompt = STORY_PROMPTS[Math.floor(Math.random() * STORY_PROMPTS.length)]
    setCurrentPrompt(randomPrompt)
    setStory(randomPrompt)
    setGameStarted(true)
    setTurnCount(0)
    setContributions([{ player: "Narrator", text: randomPrompt }])
  }

  const addToStory = () => {
    if (!userInput.trim()) return

    const newStoryPart = ` ${userInput.trim()}`
    const newStory = story + newStoryPart

    setStory(newStory)
    setContributions((prev) => [...prev, { player: currentPlayer, text: userInput.trim() }])
    setUserInput("")
    setTurnCount((prev) => prev + 1)

    // Switch turns in multiplayer
    if (isMultiplayer && onTurnChange) {
      onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
    }

    // End game after 6 turns (3 per player)
    if (turnCount >= 5) {
      setTimeout(() => {
        onGameEnd("Both", newStory)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userInput.trim()) {
      addToStory()
    }
  }

  const resetGame = () => {
    setStory("")
    setCurrentPrompt("")
    setUserInput("")
    setGameStarted(false)
    setTurnCount(0)
    setContributions([])
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          📖 Story Builder
        </CardTitle>
        {isMultiplayer && gameStarted && (
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Current turn: <span className="font-semibold">{currentPlayer}</span> ({6 - turnCount} turns left)
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {!gameStarted ? (
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">📚</div>
              <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Create a beautiful love story together!
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Take turns adding to the story. Each player gets 3 turns.
              </p>
            </div>
            <Button
              onClick={startGame}
              className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
            >
              Start Story
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Story Display */}
            <div
              className={`p-4 rounded-lg border max-h-64 overflow-y-auto ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >
              <div className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {contributions.map((contribution, index) => (
                  <span key={index}>
                    <span
                      className={`${
                        contribution.player === "Aziz"
                          ? isDarkMode
                            ? "text-blue-400"
                            : "text-blue-600"
                          : contribution.player === "Rawan"
                            ? isDarkMode
                              ? "text-pink-400"
                              : "text-pink-600"
                            : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-600"
                      }`}
                    >
                      {contribution.text}
                    </span>
                    {index < contributions.length - 1 && " "}
                  </span>
                ))}
              </div>
            </div>

            {/* Input Section */}
            {turnCount < 6 && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Continue the story...
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add your part to the story..."
                    className={`flex-1 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                    maxLength={100}
                  />
                  <Button
                    onClick={addToStory}
                    disabled={!userInput.trim()}
                    className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
                  >
                    Add
                  </Button>
                </div>

                <div className="text-center">
                  <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {userInput.length}/100 characters
                  </span>
                </div>
              </div>
            )}

            {/* Game Complete */}
            {turnCount >= 6 && (
              <div className="text-center space-y-4">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Story Complete!</h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  You've created a beautiful story together!
                </p>
                <Button
                  onClick={resetGame}
                  className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
                >
                  New Story
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
