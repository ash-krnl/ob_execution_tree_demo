import { useState, useEffect, useCallback } from 'react'
import SessionList from './components/SessionList'
import logo from './assets/logo.svg'

const AGENT_ID = import.meta.env.VITE_AGENT_ID
const TOKEN = import.meta.env.VITE_API_TOKEN
const PER_PAGE = 50

export default function App() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ limit: PER_PAGE, total: 0 })

  const fetchLogs = useCallback(async (page = 0) => {
    setLoading(true)
    setError(null)
    try {
      const url = `/api/agent/${AGENT_ID}/logs?page=${page}&perPage=${PER_PAGE}`
      const res = await fetch(url, {
        headers: TOKEN ? { 'X-API-Key': TOKEN } : {},
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`)
      const json = await res.json()
      const { data, limit, total } = json.data
      setLogs(prev => (page === 0 ? data : [...prev, ...data]))
      setPagination({ limit, total })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLogs(0) }, [fetchLogs])

  const loadMore = () => {
    const nextPage = Math.floor(logs.length / pagination.limit)
    fetchLogs(nextPage)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <img src={logo} alt="openbox" className="brand-logo" />
            <span className="brand-sep" aria-hidden="true">/</span>
            <span className="brand-ctx">agent logs</span>
          </div>
          <div className="header-session">
            <span className="session-label">agent</span>
            <code className="session-id" title={AGENT_ID}>{AGENT_ID.slice(0, 8)}…</code>
          </div>
        </div>
      </header>

      <main className="app-main">
        {(!TOKEN || !AGENT_ID) && (
          <div className="env-warning" role="alert">
            {!AGENT_ID && <><strong>VITE_AGENT_ID</strong> is not set. </>}
            {!TOKEN && <><strong>VITE_API_TOKEN</strong> is not set. </>}
            Copy <code>.env.example</code> to <code>.env</code> and fill in both values.
          </div>
        )}
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={() => fetchLogs(0)} className="retry-btn">Retry</button>
          </div>
        )}
        {loading && logs.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner" aria-hidden="true" />
            <span>Fetching execution logs…</span>
          </div>
        ) : (
          <SessionList
            logs={logs}
            total={pagination.total}
            hasMore={logs.length < pagination.total}
            onLoadMore={loadMore}
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}
