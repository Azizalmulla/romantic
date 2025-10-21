"use client"

import Script from "next/script"
import { useState } from "react"
import { Heart } from "lucide-react"

export default function Home() {
  const [scriptLoaded, setScriptLoaded] = useState(false)

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.10.84/build/spline-viewer.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={(e) => console.error("Script failed to load:", e)}
      />
      <main className="w-full h-screen bg-black relative">
        {scriptLoaded ? (
          <spline-viewer url="https://prod.spline.design/WvDjbhRfZwtOL55S/scene.splinecode"></spline-viewer>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="animate-pulse mb-4">💕</div>
              <p>Loading 3D scene...</p>
            </div>
          </div>
        )}

        {/* Bottom Right Card */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-black/80 backdrop-blur-md border border-pink-500/30 rounded-2xl px-6 py-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
              <p className="text-white font-medium text-sm">made this for you rawani</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
