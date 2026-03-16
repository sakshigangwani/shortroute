interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Tabs({ activeTab, setActiveTab }: Props) {

  return (
    <div className="tabs">

      <button
        className={activeTab === "short" ? "active" : ""}
        onClick={() => setActiveTab("short")}
      >
        Short URL
      </button>

      <button
        className={activeTab === "list" ? "active" : ""}
        onClick={() => setActiveTab("list")}
      >
        All Generated URLs
      </button>

      <button
        className={activeTab === "analytics" ? "active" : ""}
        onClick={() => setActiveTab("analytics")}
      >
        Analytics
      </button>

    </div>
  )
}