import { useState } from "react"
import { shortenUrl } from "../api/urlApi"

interface Props {
  setShortUrl: (url: string) => void
}

export default function ShortenerForm({ setShortUrl }: Props) {

  const [url, setUrl] = useState("")
  const [alias, setAlias] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await shortenUrl(url.trim(), alias.trim())
      const nextShortUrl = data?.shortUrl || data?.shortURL || data?.url

      if (!nextShortUrl) {
        setError("Could not generate short URL")
        setShortUrl("")
        return
      }

      setShortUrl(nextShortUrl)
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Backend is not running or request failed"
      setError(msg)
      setShortUrl("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">

      <h2>Shorten your URL</h2>

      <input
        placeholder="Enter long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        placeholder="Custom alias (optional)"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Shorten"}
      </button>

      {error && <p className="error-text">{error}</p>}

    </div>
  )
}