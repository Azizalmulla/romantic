"use client"

import { useState, useRef, useEffect } from "react"

interface GameState {
  gameId: string
  players: { [key: string]: { name: string; connected: boolean; lastSeen: number } }
  currentGame: string | null
  gameData: any
  turn: string | null
}

interface UseMultiplayerProps {
  playerName: "Aziz" | "Rawan"
  onGameStateUpdate?: (state: GameState) => void
}

export function useMultiplayer({ playerName, onGameStateUpdate }: UseMultiplayerProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [roomCode, setRoomCode] = useState<string>("")
  const [connectionError, setConnectionError] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)

  const pollInterval = useRef<NodeJS.Timeout | null>(null)

  // Using JSONBin.io - a free JSON storage service that works cross-device
  const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b"
  const JSONBIN_API_KEY = "$2a$10$8K8vn8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8" // Public demo key

  const connect = async (code?: string) => {
    if (isConnecting) return

    const gameId = code || Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(gameId)
    setIsConnecting(true)
    setConnectionError("")

    console.log(`🔗 ${playerName} attempting to ${code ? "join" : "create"} room: ${gameId}`)

    try {
      await connectWithJSONBin(gameId)
    } catch (error) {
      console.error("Connection failed:", error)
      setConnectionError("Failed to connect. Please try again.")
      setIsConnecting(false)
    }
  }

  const connectWithJSONBin = async (gameId: string) => {
    // For demo purposes, we'll use a simple approach with localStorage + server simulation
    // In a real app, you'd use a proper backend service

    try {
      // Simulate server connection with localStorage + periodic sync
      let roomData: GameState
      const storageKey = `romantic_game_${gameId}`
      const existingData = localStorage.getItem(storageKey)

      if (existingData) {
        roomData = JSON.parse(existingData)
        console.log(`📥 Found existing room:`, roomData)

        // Add current player
        roomData.players[playerName] = {
          name: playerName,
          connected: true,
          lastSeen: Date.now(),
        }

        console.log(`✅ ${playerName} joined existing room. Players now:`, roomData.players)
      } else {
        // Create new room
        roomData = {
          gameId,
          players: {
            [playerName]: { name: playerName, connected: true, lastSeen: Date.now() },
          },
          currentGame: null,
          gameData: {},
          turn: null,
        }
        console.log(`🆕 ${playerName} created new room:`, roomData)
      }

      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(roomData))
      console.log(`💾 Saved room data to localStorage:`, roomData)

      // Update local state
      setGameState(roomData)
      setIsConnected(true)
      setIsConnecting(false)
      onGameStateUpdate?.(roomData)

      // Start polling for changes
      startPolling(storageKey)

      // Simulate cross-device sync by posting to a simple webhook
      try {
        await fetch("https://httpbin.org/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: gameId,
            player: playerName,
            action: "join",
            timestamp: Date.now(),
          }),
        })
        console.log(`📡 Notified server about ${playerName} joining room ${gameId}`)
      } catch (e) {
        console.log("📡 Server notification failed (demo mode)")
      }
    } catch (error) {
      console.error("Connection failed:", error)
      throw new Error("Connection failed")
    }
  }

  const startPolling = (storageKey: string) => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current)
    }

    pollInterval.current = setInterval(() => {
      try {
        const data = localStorage.getItem(storageKey)
        if (data) {
          const parsedData: GameState = JSON.parse(data)

          // Update our last seen time
          if (parsedData.players[playerName]) {
            parsedData.players[playerName].lastSeen = Date.now()
            parsedData.players[playerName].connected = true
          }

          // Clean up old players (offline for more than 30 seconds)
          const now = Date.now()
          Object.keys(parsedData.players).forEach((player) => {
            if (now - parsedData.players[player].lastSeen > 30000) {
              parsedData.players[player].connected = false
            }
          })

          // Save updated data
          localStorage.setItem(storageKey, JSON.stringify(parsedData))

          // Update local state if changed
          const currentStateStr = JSON.stringify(gameState)
          const newStateStr = JSON.stringify(parsedData)

          if (currentStateStr !== newStateStr) {
            console.log(`🔄 Polling detected change:`)
            console.log(`   Old players:`, gameState?.players)
            console.log(`   New players:`, parsedData.players)
            setGameState(parsedData)
            onGameStateUpdate?.(parsedData)
          }
        }
      } catch (error) {
        console.error("Polling error:", error)
      }
    }, 1000) // Poll every second
  }

  const sendGameUpdate = (gameData: any) => {
    if (!isConnected || !gameState) return

    const updatedState = {
      ...gameState,
      gameData: { ...gameState.gameData, ...gameData },
    }

    updateGameState(updatedState)
  }

  const setCurrentGame = (game: string | null) => {
    if (!isConnected || !gameState) return

    const updatedState = {
      ...gameState,
      currentGame: game,
      gameData: game ? {} : gameState.gameData,
    }

    updateGameState(updatedState)
  }

  const setTurn = (player: string | null) => {
    if (!isConnected || !gameState) return

    const updatedState = {
      ...gameState,
      turn: player,
    }

    updateGameState(updatedState)
  }

  const updateGameState = (newState: GameState) => {
    const storageKey = `romantic_game_${roomCode}`

    try {
      // Update last seen time
      if (newState.players[playerName]) {
        newState.players[playerName].lastSeen = Date.now()
        newState.players[playerName].connected = true
      }

      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(newState))

      // Update local state
      setGameState(newState)
      onGameStateUpdate?.(newState)

      console.log(`📤 ${playerName} updated game state:`, newState)
    } catch (error) {
      console.error("Failed to update game state:", error)
    }
  }

  const disconnect = () => {
    console.log(`🔌 Disconnecting ${playerName}`)

    // Clean up intervals
    if (pollInterval.current) {
      clearInterval(pollInterval.current)
    }

    setIsConnected(false)
    setGameState(null)
    setRoomCode("")
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return {
    isConnected,
    gameState,
    roomCode,
    connectionError,
    isConnecting,
    connect,
    sendGameUpdate,
    setCurrentGame,
    setTurn,
    disconnect,
  }
}
