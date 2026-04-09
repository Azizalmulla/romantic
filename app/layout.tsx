import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "For Rawan | A Little World Of Us",
  description: "A soft little corner of the internet made to celebrate Rawan.",
  metadataBase: new URL("https://iloverawan.fyi"),
  openGraph: {
    title: "For Rawan | A Little World Of Us",
    description: "A soft little corner of the internet made to celebrate Rawan.",
    siteName: "For Rawan",
    type: "website",
    url: "https://iloverawan.fyi",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
