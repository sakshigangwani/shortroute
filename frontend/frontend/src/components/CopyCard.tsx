import { useState } from "react"

interface Props {
  shortUrl: string
}

export default function CopyCard({ shortUrl }: Props) {

  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="card">

      <h3>Copy Shortened URL</h3>

      <div className="copy-row">
        <a className="short-link" href={shortUrl} target="_blank" rel="noreferrer">
          {shortUrl}
        </a>

        <button onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

    </div>
  )
}