import { useEffect, useState } from "react"
import { getAnalyticsSummary, type AnalyticsResponse } from "../api/urlApi"

const emptyAnalytics: AnalyticsResponse = {
  summary: {
    totalUrls: 0,
    totalClicks: 0,
    averageClicks: 0
  },
  topUrls: [],
  recentUrls: []
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse>(emptyAnalytics)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await getAnalyticsSummary()
        setData(response)
      } catch {
        setError("Could not load analytics")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return <div className="card"><p>Loading analytics...</p></div>
  }

  if (error) {
    return <div className="card"><p className="error-text">{error}</p></div>
  }

  return (
    <div className="card">
      <h2>Analytics Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Total URLs</p>
          <h3>{data.summary.totalUrls}</h3>
        </div>
        <div className="stat-card">
          <p>Total Clicks</p>
          <h3>{data.summary.totalClicks}</h3>
        </div>
        <div className="stat-card">
          <p>Avg Clicks / URL</p>
          <h3>{data.summary.averageClicks}</h3>
        </div>
      </div>

      <div className="analytics-columns">
        <div>
          <h3>Top performing URLs</h3>
          {data.topUrls.length === 0 && <p>No data yet.</p>}
          {data.topUrls.map((item) => (
            <div className="mini-row" key={`top-${item._id}`}>
              <div>
                <a href={item.shortUrl} target="_blank" rel="noreferrer">{item.shortCode}</a>
                <p className="clicks">
                  Last click: {item.lastClickedAt ? new Date(item.lastClickedAt).toLocaleString() : "No clicks yet"}
                </p>
              </div>
              <span className="clicks">{item.clickCount} clicks</span>
            </div>
          ))}
        </div>

        <div>
          <h3>Recently created</h3>
          {data.recentUrls.length === 0 && <p>No data yet.</p>}
          {data.recentUrls.map((item) => (
            <div className="mini-row" key={`recent-${item._id}`}>
              <div>
                <a href={item.shortUrl} target="_blank" rel="noreferrer">{item.shortCode}</a>
                <p className="clicks">
                  Last click: {item.lastClickedAt ? new Date(item.lastClickedAt).toLocaleString() : "No clicks yet"}
                </p>
              </div>
              <span className="clicks">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
