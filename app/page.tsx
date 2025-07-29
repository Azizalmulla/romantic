"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Heart, Users, User, ArrowLeft } from "lucide-react"

// Game Components
import MemoryMatch from "./components/memory-match"
import QuickMath from "./components/quick-math"
import StoryBuilder from "./components/story-builder"
import ReactionTime from "./components/reaction-time"
import DrawGuess from "./components/draw-guess"
import GuessTheNumber from "./components/guess-the-number"
import WordLove from "./components/word-love"
import TruthOrDare from "./components/truth-or-dare"
import MultiplayerLobby from "./components/multiplayer-lobby"

// Hooks
import { useMultiplayer } from "./hooks/useMultiplayer"

const GAMES = [
  { id: "memory-match", name: "Memory Match", emoji: "💝", component: MemoryMatch },
  { id: "quick-math", name: "Quick Math", emoji: "🧮", component: QuickMath },
  { id: "story-builder", name: "Story Builder", emoji: "📖", component: StoryBuilder },
  { id: "reaction-time", name: "Reaction Time", emoji: "⚡", component: ReactionTime },
  { id: "draw-guess", name: "Draw & Guess", emoji: "🎨", component: DrawGuess },
  { id: "guess-number", name: "Guess the Number", emoji: "🎯", component: GuessTheNumber },
  { id: "word-love", name: "Word Love", emoji: "💕", component: WordLove },
  { id: "truth-dare", name: "Truth or Dare", emoji: "💋", component: TruthOrDare },
]

export default function RomanticGameHub() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<"Aziz" | "Rawan" | null>(null)
  const [gameMode, setGameMode] = useState<"single" | "multiplayer" | null>(null)
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [gameResult, setGameResult] = useState<{
    winner: string
    score: { player1: number; player2: number }
    game: string
  } | null>(null)

  // Multiplayer hook
  const {
    isConnected,
    gameState,
    roomCode,
    connectionError,
    isConnecting,
    connect,
    sendGameUpdate,
    setCurrentGame: setMultiplayerGame,
    setTurn,
    disconnect,
  } = useMultiplayer({
    playerName: selectedPlayer || "Aziz",
    onGameStateUpdate: (state) => {
      console.log("=== BEFORE LOBBY RENDER ===")
      console.log("gameState from hook:", state)
      console.log("gameState?.players:", state?.players)
      console.log("isConnected:", isConnected)
    },
  })

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Handle game end
  const handleGameEnd = (winner: string, score: { player1: number; player2: number }) => {
    setGameResult({
      winner,
      score,
      game: currentGame || "Unknown Game",
    })

    // Send game result to multiplayer if connected
    if (isConnected && gameMode === "multiplayer") {
      sendGameUpdate({
        type: "game_end",
        winner,
        score,
        game: currentGame,
      })
    }
  }

  // Start a game
  const startGame = (gameId: string) => {
    setCurrentGame(gameId)
    setGameResult(null)

    // Set current game in multiplayer
    if (isConnected && gameMode === "multiplayer") {
      setMultiplayerGame(gameId)
    }
  }

  // Go back to game selection
  const goBack = () => {
    if (currentGame) {
      setCurrentGame(null)
      setGameResult(null)

      // Clear current game in multiplayer
      if (isConnected && gameMode === "multiplayer") {
        setMultiplayerGame(null)
      }
    } else if (gameMode) {
      setGameMode(null)
      if (isConnected) {
        disconnect()
      }
    } else if (selectedPlayer) {
      setSelectedPlayer(null)
    }
  }

  // Handle multiplayer connection
  const handleMultiplayerConnect = (roomCode?: string) => {
    connect(roomCode)
  }

  // Handle turn change in multiplayer
  const handleTurnChange = (nextPlayer: string) => {
    if (isConnected) {
      setTurn(nextPlayer)
    }
  }

  // Get current player for multiplayer
  const getCurrentPlayer = () => {
    if (gameMode === "multiplayer" && gameState?.turn) {
      return gameState.turn as "Aziz" | "Rawan"
    }
    return selectedPlayer || "Aziz"
  }

  // Get connected players for multiplayer lobby
  const getConnectedPlayers = () => {
    return gameState?.players || {}
  }

  // Render current game
  const renderCurrentGame = () => {
    const game = GAMES.find((g) => g.id === currentGame)
    if (!game) return null

    const GameComponent = game.component
    return (
      <GameComponent
        isDarkMode={isDarkMode}
        onGameEnd={handleGameEnd}
        isMultiplayer={gameMode === "multiplayer"}
        currentPlayer={getCurrentPlayer()}
        onTurnChange={handleTurnChange}
      />
    )
  }

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark")
      document.body.style.backgroundColor = "#0f172a"
    } else {
      document.body.classList.remove("dark")
      document.body.style.backgroundColor = "#ffffff"
    }
  }, [isDarkMode])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-br from-pink-50 to-purple-50"}`}
    >
      {/* Header */}
      <header
        className={`border-b ${isDarkMode ? "border-gray-800 bg-slate-900/50" : "border-pink-200 bg-white/50"} backdrop-blur-sm sticky top-0 z-10`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(selectedPlayer || gameMode || currentGame) && (
              <Button
                onClick={goBack}
                variant="ghost"
                size="sm"
                className={`rounded-lg ${isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-pink-100 text-gray-700"}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Heart className={`w-8 h-8 ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
              <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Romantic Game Hub</h1>
            </div>
          </div>

          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="sm"
            className={`rounded-lg ${isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-pink-100 text-gray-700"}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Game Result Modal */}
        {gameResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card
              className={`w-full max-w-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
            >
              <CardHeader className="text-center">
                <CardTitle className={`text-2xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  🎉 Game Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-6xl mb-4">{gameResult.winner === "Tie" ? "🤝" : "🏆"}</div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {gameResult.winner === "Tie" ? "It's a tie!" : `${gameResult.winner} wins!`}
                </h3>
                <div className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <p>Aziz: {gameResult.score.player1}</p>
                  <p>Rawan: {gameResult.score.player2}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setGameResult(null)}
                    className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={() => {
                      setGameResult(null)
                      setCurrentGame(null)
                    }}
                    variant="outline"
                    className={`rounded-lg ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                  >
                    Choose New Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Game View */}
        {currentGame ? (
          <div className="max-w-4xl mx-auto">{renderCurrentGame()}</div>
        ) : gameMode === "multiplayer" ? (
          /* Multiplayer Lobby */
          <div className="max-w-2xl mx-auto">
            <MultiplayerLobby
              playerName={selectedPlayer || "Aziz"}
              isDarkMode={isDarkMode}
              onConnect={handleMultiplayerConnect}
              isConnected={isConnected}
              isConnecting={isConnecting}
              roomCode={roomCode}
              connectedPlayers={getConnectedPlayers()}
              connectionError={connectionError}
              gameState={gameState}
            />

            {/* Game Selection (when both players connected) */}
            {isConnected && Object.values(getConnectedPlayers()).filter((p) => p.connected).length >= 2 && (
              <div className="mt-8">
                <Card
                  className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}
                >
                  <CardHeader className="text-center">
                    <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      🎮 Choose a Game
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {GAMES.map((game) => (
                        <Button
                          key={game.id}
                          onClick={() => startGame(game.id)}
                          variant="outline"
                          className={`h-24 flex flex-col items-center justify-center gap-2 rounded-lg transition-all hover:scale-105 ${
                            isDarkMode
                              ? "border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                              : "border-gray-200 hover:bg-pink-50 hover:border-pink-300"
                          }`}
                        >
                          <span className="text-2xl">{game.emoji}</span>
                          <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {game.name}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : gameMode ? (
          /* Single Player Game Selection */
          <div className="max-w-4xl mx-auto">
            <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-3xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  🎮 Choose Your Game
                </CardTitle>
                <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Playing as: <span className="font-semibold">{selectedPlayer}</span>
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {GAMES.map((game) => (
                    <Button
                      key={game.id}
                      onClick={() => startGame(game.id)}
                      variant="outline"
                      className={`h-32 flex flex-col items-center justify-center gap-3 rounded-xl transition-all hover:scale-105 ${
                        isDarkMode
                          ? "border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                          : "border-gray-200 hover:bg-pink-50 hover:border-pink-300"
                      }`}
                    >
                      <span className="text-4xl">{game.emoji}</span>
                      <span
                        className={`text-sm font-medium text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {game.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedPlayer ? (
          /* Game Mode Selection */
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-3xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Welcome, {selectedPlayer}! 👋
                </CardTitle>
                <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>How would you like to play?</p>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <Button
                  onClick={() => setGameMode("single")}
                  variant="outline"
                  className={`w-full h-20 flex items-center justify-center gap-4 rounded-xl text-lg transition-all hover:scale-105 ${
                    isDarkMode
                      ? "border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                      : "border-gray-200 hover:bg-pink-50 hover:border-pink-300"
                  }`}
                >
                  <User className="w-8 h-8" />
                  <div className="text-left">
                    <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Single Player</div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Play games by yourself
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => setGameMode("multiplayer")}
                  variant="outline"
                  className={`w-full h-20 flex items-center justify-center gap-4 rounded-xl text-lg transition-all hover:scale-105 ${
                    isDarkMode
                      ? "border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                      : "border-gray-200 hover:bg-pink-50 hover:border-pink-300"
                  }`}
                >
                  <Users className="w-8 h-8" />
                  <div className="text-left">
                    <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Multiplayer</div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Play together with your partner
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Player Selection */
          <div className="max-w-2xl mx-auto">
            <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-4xl font-light mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  💕 Welcome to Your Love Games! 💕
                </CardTitle>
                <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Choose your player to start the romantic fun!
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    onClick={() => setSelectedPlayer("Aziz")}
                    variant="outline"
                    className={`h-32 flex flex-col items-center justify-center gap-4 rounded-xl text-xl transition-all hover:scale-105 ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-800 hover:border-blue-500"
                        : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-6xl">👨</span>
                    <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Aziz</span>
                  </Button>

                  <Button
                    onClick={() => setSelectedPlayer("Rawan")}
                    variant="outline"
                    className={`h-32 flex flex-col items-center justify-center gap-4 rounded-xl text-xl transition-all hover:scale-105 ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-800 hover:border-pink-500"
                        : "border-gray-200 hover:bg-pink-50 hover:border-pink-300"
                    }`}
                  >
                    <span className="text-6xl">👩</span>
                    <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rawan</span>
                  </Button>
                </div>

                <div className="text-center">
                  <div className="inline-block">
                    <img
                      src="/images/purple-heart.png"
                      alt="Purple Heart"
                      className="w-16 h-16 mx-auto animate-pulse"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
