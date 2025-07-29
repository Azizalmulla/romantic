"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CARD_PAIRS = [
  { id: 1, emoji: "❤️", matched: false },
  { id: 2, emoji: "💕", matched: false },
  { id: 3, emoji: "💖", matched: false },
  { id: 4, emoji: "💗", matched: false },
  { id: 5, emoji: "💘", matched: false },
  { id: 6, emoji: "💝", matched: false },
]

interface MemoryMatchCard {
  id: number
  emoji: string
  matched: boolean
  flipped: boolean
  position: number
}

interface MemoryMatchProps {
  isDarkMode: boolean
  onGameEnd: (winner: string, score: { player1: number; player2: number }) => void
  isMultiplayer?: boolean
  currentPlayer?: string
  onTurnChange?: (nextPlayer: string) => void
}

export default function MemoryMatch({
  isDarkMode,
  onGameEnd,
  isMultiplayer = false,
  currentPlayer = "Aziz",
  onTurnChange,
}: MemoryMatchProps) {
  const [cards, setCards] = useState<MemoryMatchCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState({ Aziz: 0, Rawan: 0 })
  const [gameComplete, setGameComplete] = useState(false)
  const [canFlip, setCanFlip] = useState(true)

  // Initialize cards
  useEffect(() => {
    const shuffledCards = [...CARD_PAIRS, ...CARD_PAIRS]
      .map((card, index) => ({
        ...card,
        flipped: false,
        position: index,
        id: index,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
  }, [])

  const flipCard = (cardIndex: number) => {
    if (!canFlip || flippedCards.length >= 2 || cards[cardIndex].flipped || cards[cardIndex].matched) {
      return
    }

    const newFlippedCards = [...flippedCards, cardIndex]
    setFlippedCards(newFlippedCards)

    setCards((prev) => prev.map((card, index) => (index === cardIndex ? { ...card, flipped: true } : card)))

    if (newFlippedCards.length === 2) {
      setCanFlip(false)
      setTimeout(() => checkMatch(newFlippedCards), 1000)
    }
  }

  const checkMatch = (flippedIndices: number[]) => {
    const [first, second] = flippedIndices
    const firstCard = cards[first]
    const secondCard = cards[second]

    if (firstCard.emoji === secondCard.emoji) {
      // Match found
      setCards((prev) =>
        prev.map((card, index) => (flippedIndices.includes(index) ? { ...card, matched: true } : card)),
      )
      setMatches((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer as keyof typeof prev] + 1,
      }))

      // Check if game is complete
      const totalMatches = matches[currentPlayer as keyof typeof matches] + 1
      if (matches.Aziz + matches.Rawan + 1 >= CARD_PAIRS.length) {
        setGameComplete(true)
        const winner = matches.Aziz > matches.Rawan ? "Aziz" : matches.Rawan > matches.Aziz ? "Rawan" : "Tie"
        onGameEnd(winner, { player1: matches.Aziz, player2: matches.Rawan })
      }
    } else {
      // No match, flip cards back
      setCards((prev) =>
        prev.map((card, index) => (flippedIndices.includes(index) ? { ...card, flipped: false } : card)),
      )

      // Switch turns in multiplayer
      if (isMultiplayer && onTurnChange) {
        onTurnChange(currentPlayer === "Aziz" ? "Rawan" : "Aziz")
      }
    }

    setFlippedCards([])
    setCanFlip(true)
  }

  const resetGame = () => {
    const shuffledCards = [...CARD_PAIRS, ...CARD_PAIRS]
      .map((card, index) => ({
        ...card,
        flipped: false,
        position: index,
        id: index,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatches({ Aziz: 0, Rawan: 0 })
    setGameComplete(false)
    setCanFlip(true)
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          💝 Memory Match
        </CardTitle>
        {isMultiplayer && (
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Current turn: <span className="font-semibold">{currentPlayer}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl">👨</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Aziz</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{matches.Aziz}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">👩</div>
            <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rawan</div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>
              {matches.Rawan}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => flipCard(index)}
              disabled={!canFlip || card.matched || card.flipped}
              className={`
                aspect-square rounded-lg text-3xl font-bold transition-all duration-300 transform
                ${
                  card.flipped || card.matched
                    ? isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                    : isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-200 hover:bg-gray-300"
                }
                ${card.matched ? "opacity-50" : ""}
                ${!canFlip && !card.flipped && !card.matched ? "cursor-not-allowed" : "cursor-pointer"}
                hover:scale-105
              `}
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </button>
          ))}
        </div>

        {gameComplete && (
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎉</div>
            <div className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {matches.Aziz === matches.Rawan
                ? "It's a tie!"
                : `${matches.Aziz > matches.Rawan ? "Aziz" : "Rawan"} wins!`}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={resetGame}
            className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
          >
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
