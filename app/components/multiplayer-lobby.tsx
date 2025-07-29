"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff, Copy, Check, Loader2, Users, AlertTriangle } from "lucide-react"

interface MultiplayerLobbyProps {
  playerName: "Aziz" | "Rawan"
  isDarkMode: boolean
  onConnect: (roomCode?: string) => void
  isConnected: boolean
  isConnecting?: boolean
  roomCode: string
  connectedPlayers: { [key: string]: { name: string; connected: boolean; lastSeen?: number } }
  connectionError?: string
  gameState?: any
}

export default function MultiplayerLobby({
  playerName,
  isDarkMode,
  onConnect,
  isConnected,
  isConnecting = false,
  roomCode,
  connectedPlayers,
  connectionError,
  gameState,
}: MultiplayerLobbyProps) {
  const [joinCode, setJoinCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      const textArea = document.createElement("textarea")
      textArea.value = roomCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Use gameState.players if available, fallback to connectedPlayers
  const actualPlayers = gameState?.players || connectedPlayers || {}
  const connectedCount = Object.values(actualPlayers).filter((p) => p && p.connected).length

  // Enhanced debug info
  useEffect(() => {
    console.log("=== LOBBY DEBUG ===")
    console.log("playerName:", playerName)
    console.log("roomCode:", roomCode)
    console.log("gameState:", gameState)
    console.log("connectedPlayers prop:", connectedPlayers)
    console.log("actualPlayers:", actualPlayers)
    console.log("connectedCount:", connectedCount)

    const playerNames = Object.keys(actualPlayers)
    const connectedNames = Object.entries(actualPlayers)
      .filter(([_, player]) => player && player.connected)
      .map(([name, _]) => name)

    setDebugInfo(
      `Room: ${roomCode} | Players: [${playerNames.join(", ")}] | Connected: [${connectedNames.join(", ")}] | Count: ${connectedCount}/2 | Mode: Demo (LocalStorage)`,
    )
  }, [connectedPlayers, gameState, roomCode, playerName])

  if (isConnected) {
    return (
      <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
        <CardHeader className="text-center border-b border-gray-800">
          <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            🎮 Room: {roomCode}
          </CardTitle>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Demo Mode - Same Device Only</p>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Demo Warning */}
          <div
            className={`p-4 rounded-lg border ${isDarkMode ? "bg-yellow-900/30 border-yellow-700" : "bg-yellow-50 border-yellow-200"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`} />
              <span className={`font-medium text-sm ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                Demo Mode Active
              </span>
            </div>
            <p className={`text-xs ${isDarkMode ? "text-yellow-300" : "text-yellow-500"}`}>
              This demo works on the same device only. For true cross-device multiplayer, you'd need a real backend
              service like Firebase, Supabase, or a custom server.
            </p>
          </div>

          {/* Enhanced Debug Info */}
          <div
            className={`p-3 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}
          >
            <div className="mb-1">DEBUG: {debugInfo}</div>
            <div>Demo: localStorage + polling simulation</div>
          </div>

          {/* Room Code */}
          <div className="text-center space-y-4">
            <div
              className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >
              <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Room Code (Demo)
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-3xl font-bold tracking-wider ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {roomCode}
                </span>
                <Button
                  onClick={copyRoomCode}
                  variant="ghost"
                  size="sm"
                  className={`rounded-lg ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Open a new tab to simulate second player
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2">
            <Wifi className={`w-5 h-5 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
            <span className={`font-medium ${isDarkMode ? "text-green-400" : "text-green-500"}`}>
              Connected as {playerName}
            </span>
          </div>

          {/* Players List */}
          <div
            className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
          >
            <h4 className={`font-medium mb-3 text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <Users className="w-4 h-4 inline mr-2" />
              Players in Room ({connectedCount}/2)
            </h4>
            <div className="space-y-3">
              {Object.entries(actualPlayers).map(([name, player]) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{name === "Aziz" ? "👨" : "👩"}</div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {player.name}
                      </span>
                      {name === playerName && (
                        <span className={`text-xs ml-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>(You)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        player.connected
                          ? isDarkMode
                            ? "bg-green-900/50 text-green-400"
                            : "bg-green-100 text-green-600"
                          : isDarkMode
                            ? "bg-red-900/50 text-red-400"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {player.connected ? "ONLINE" : "OFFLINE"}
                    </span>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        player.connected
                          ? isDarkMode
                            ? "bg-green-400 animate-pulse"
                            : "bg-green-500 animate-pulse"
                          : isDarkMode
                            ? "bg-red-400"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {connectedCount < 2 ? (
            <div className="text-center space-y-4">
              <div
                className={`p-4 rounded-lg border ${isDarkMode ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200"}`}
              >
                <div className="animate-pulse mb-2">
                  <p className={`text-lg font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    ⏳ Waiting for {playerName === "Aziz" ? "Rawan" : "Aziz"} to join...
                  </p>
                </div>
                <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-500"}`}>
                  Room code: <strong>{roomCode}</strong>
                </p>
                <div className={`text-xs mt-2 space-y-1 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  <p>🔄 Open a new tab and join with the same code</p>
                  <p>📱 This is a demo - real version would work across devices</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div
                className={`p-6 rounded-lg border ${isDarkMode ? "bg-green-900/30 border-green-700" : "bg-green-50 border-green-200"}`}
              >
                <div className="text-4xl mb-3">🎉</div>
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Both Players Connected!
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-500"}`}>
                  Ready to start playing games together! 🎮
                </p>
              </div>
            </div>
          )}

          {/* Instructions for Real Implementation */}
          <div
            className={`p-4 rounded-lg border ${isDarkMode ? "bg-purple-900/30 border-purple-700" : "bg-purple-50 border-purple-200"}`}
          >
            <h4 className={`font-medium mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
              💡 For Real Cross-Device Multiplayer
            </h4>
            <div className={`text-xs space-y-1 ${isDarkMode ? "text-purple-300" : "text-purple-500"}`}>
              <p>• Use Firebase Realtime Database or Firestore</p>
              <p>• Use Supabase with real-time subscriptions</p>
              <p>• Use Socket.IO with a Node.js server</p>
              <p>• Use WebRTC for peer-to-peer connections</p>
              <p>• This demo shows the UI/UX - just needs a real backend!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
      <CardHeader className="text-center border-b border-gray-800">
        <CardTitle className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          🎮 Multiplayer Demo
        </CardTitle>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Demo mode - works on same device only</p>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {connectionError && (
          <div
            className={`p-4 rounded-lg border ${isDarkMode ? "bg-red-900/30 border-red-700" : "bg-red-50 border-red-200"}`}
          >
            <p className={`text-sm ${isDarkMode ? "text-red-400" : "text-red-600"}`}>❌ {connectionError}</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          {isConnecting ? (
            <>
              <Loader2 className={`w-5 h-5 animate-spin ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
              <span className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>Connecting...</span>
            </>
          ) : (
            <>
              <WifiOff className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Not Connected</span>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
          >
            <h3 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>🎯 Create Demo Room</h3>
            <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Start a demo room (works on same device only)
            </p>
            <Button
              onClick={() => onConnect()}
              disabled={isConnecting}
              className={`w-full rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Demo Room"
              )}
            </Button>
          </div>

          <div
            className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
          >
            <h3 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>🔗 Join Demo Room</h3>
            <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Enter a room code from another tab
            </p>
            <div className="flex gap-2">
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                placeholder="ABCD12"
                className={`rounded-lg text-center font-mono text-lg ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                maxLength={6}
                disabled={isConnecting}
              />
              <Button
                onClick={() => onConnect(joinCode)}
                disabled={joinCode.length !== 6 || isConnecting}
                className={`rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-900"}`}
              >
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div
          className={`p-4 rounded-lg border ${isDarkMode ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200"}`}
        >
          <h4 className={`font-medium mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>📱 How Demo Works</h4>
          <div className={`text-xs space-y-1 ${isDarkMode ? "text-blue-300" : "text-blue-500"}`}>
            <p>• Create a room to get a 6-letter code</p>
            <p>• Open a new tab/window in the same browser</p>
            <p>• Join with the code as the other player</p>
            <p>• Both tabs will sync and you can play together!</p>
            <p>• This simulates cross-device play on the same device</p>
          </div>
        </div>

        {/* Real Implementation Note */}
        <div
          className={`p-4 rounded-lg border ${isDarkMode ? "bg-purple-900/30 border-purple-700" : "bg-purple-50 border-purple-200"}`}
        >
          <h4 className={`font-medium mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
            🚀 For Real Cross-Device Play
          </h4>
          <div className={`text-xs space-y-1 ${isDarkMode ? "text-purple-300" : "text-purple-500"}`}>
            <p>This demo shows the complete UI and game logic.</p>
            <p>To make it work across devices, you'd need:</p>
            <p>• A real backend (Firebase, Supabase, custom server)</p>
            <p>• WebSocket connections for real-time sync</p>
            <p>• The game logic is already there - just needs the backend!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
