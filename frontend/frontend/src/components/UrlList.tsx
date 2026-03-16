import { useEffect, useState } from "react"
import { deleteUrl, getAllUrls, type UrlItem } from "../api/urlApi"

export default function UrlList() {

  const [urls, setUrls] = useState<UrlItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [activeQrId, setActiveQrId] = useState("")

  const loadUrls = async (searchValue = "") => {
    try {
      setLoading(true)
      setError("")
      const data = await getAllUrls(searchValue)
      setUrls(data)
    } catch {
      setError("Could not load generated URLs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUrls(search.trim())
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl(id)
      setUrls((prev) => prev.filter((item) => item._id !== id))
      if (activeQrId === id) {
        setActiveQrId("")
      }
    } catch {
      setError("Could not delete URL")
    }
  }

  return (
    <div className="card">
      <h2>All generated URLs</h2>

      <input
        placeholder="Search by original URL or short code"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && urls.length === 0 && <p>No URLs to show yet.</p>}

      {!loading && !error && urls.map((item) => (
        <div className="url-item" key={item._id}>
          <div className="url-info">
            <a href={item.shortUrl} target="_blank" rel="noreferrer">{item.shortUrl}</a>
            <p>{item.originalUrl}</p>
            <p className="clicks">Created: {new Date(item.createdAt).toLocaleString()}</p>

            {activeQrId === item._id && (
              <img
                className="qr-image"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(item.shortUrl)}`}
                alt="QR code"
              />
            )}
          </div>

          <div className="url-actions">
            <span className="clicks">Clicks: {item.clickCount}</span>
            <button
              className="outline-btn"
              onClick={() => setActiveQrId((prev) => prev === item._id ? "" : item._id)}
            >
              {activeQrId === item._id ? "Hide QR" : "QR Code"}
            </button>
            <button className="danger-btn" onClick={() => handleDelete(item._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}