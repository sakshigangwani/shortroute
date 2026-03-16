import { useEffect, useMemo, useState } from "react"
import Tabs from "./components/Tabs"
import ShortenerForm from "./components/ShortenerForm"
import CopyCard from "./components/CopyCard"
import UrlList from "./components/UrlList"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import "./styles/app.css"

function App() {

  const [activeTab, setActiveTab] = useState("short")
  const [shortUrl, setShortUrl] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [burstId, setBurstId] = useState(0)

  useEffect(() => {
    if (!shortUrl) return

    setShowConfetti(true)
    setBurstId((prev) => prev + 1)

    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [shortUrl])

  const confettiPieces = useMemo(() => {
    const colors = ["#4f7dff", "#00a6ff", "#7c4dff", "#22c55e", "#f59e0b", "#ef4444"]

    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 280,
      duration: 900 + Math.random() * 900,
      rotate: Math.random() * 360,
      size: 6 + Math.random() * 8,
      drift: -80 + Math.random() * 160,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
  }, [burstId])

  return (
    <div className="container">

      {showConfetti && (
        <div className="confetti-layer" aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="confetti"
              style={{
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${piece.size * 0.55}px`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}ms`,
                animationDuration: `${piece.duration}ms`,
                transform: `rotate(${piece.rotate}deg)`,
                ["--drift" as any]: `${piece.drift}px`
              }}
            />
          ))}
        </div>
      )}

      <header className="hero">
        <p className="eyebrow">ShortRoute</p>
        <h1>Make long links look smart</h1>
        <p className="subtitle">Shorten, share and track your URLs in seconds.</p>
        <div className="hero-badges">
          <span>⚡ Fast redirects</span>
          <span>🔒 Secure links</span>
          <span>📈 Click tracking</span>
        </div>
      </header>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "short" && (
        <>
          <ShortenerForm setShortUrl={setShortUrl} />
          {shortUrl && <CopyCard shortUrl={shortUrl} />}
        </>
      )}

      {activeTab === "list" && (
        <UrlList />
      )}

      {activeTab === "analytics" && (
        <AnalyticsDashboard />
      )}

    </div>
  )
}

export default App