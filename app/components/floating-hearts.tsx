"use client"

import { useEffect, useState } from "react"

interface Heart {
  id: number
  left: number
  animationDuration: number
  size: number
  opacity: number
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const createHeart = () => {
      const newHeart: Heart = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 4, // 4-7 seconds
        size: Math.random() * 20 + 15, // 15-35px
        opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
      }

      setHearts((prev) => [...prev, newHeart])

      // Remove heart after animation completes
      setTimeout(() => {
        setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
      }, newHeart.animationDuration * 1000)
    }

    // Create a heart every 2-4 seconds
    const interval = setInterval(
      () => {
        createHeart()
      },
      Math.random() * 2000 + 2000,
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-pink-400 animate-float-up"
          style={{
            left: `${heart.left}%`,
            bottom: "-50px",
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animationDuration: `${heart.animationDuration}s`,
          }}
        >
          💕
        </div>
      ))}
    </div>
  )
}
