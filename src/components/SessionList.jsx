import { useMemo, useState, useRef, useEffect } from 'react'
import { ChevronDown, CircleCheck, Circle, Clock } from 'lucide-react'
import WorkflowTree from './WorkflowTree'
import { timeAgo } from '../utils'

function buildSessions(logs) {
  const map = new Map()
  for (const e of logs) {
    const sid = e.session_id
    if (!map.has(sid)) {
      map.set(sid, { id: sid, events: [], agent: e.agent, latestAt: e.created_at })
    }
    const s = map.get(sid)
    s.events.push(e)
    if (new Date(e.created_at) > new Date(s.latestAt)) s.latestAt = e.created_at
  }
  return Array.from(map.values())
    .map(s => ({
      ...s,
      complete: s.events.some(e => e.event_type === 'WorkflowCompleted'),
      workflowCount: new Set(s.events.map(e => e.workflow_id)).size,
    }))
    .sort((a, b) => new Date(b.latestAt) - new Date(a.latestAt))
}

export default function SessionList({ logs, total, hasMore, onLoadMore, loading }) {
  const sessions = useMemo(() => buildSessions(logs), [logs])
  const [selectedId, setSelectedId] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Always default to the newest session
  const activeId = selectedId ?? sessions[0]?.id
  const activeSession = sessions.find(s => s.id === activeId) ?? sessions[0]

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const select = (id) => {
    setSelectedId(id)
    setDropdownOpen(false)
  }

  if (sessions.length === 0) {
    return (
      <div className="sl-card">
        <p className="sl-empty">No sessions found.</p>
      </div>
    )
  }

  return (
    <div className="sl-card">
      {/* ── Session selector bar ── */}
      <div className="sl-selector-bar">
        <div className="sl-selector-label">Session</div>

        <div className="sl-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="sl-trigger"
            onClick={() => setDropdownOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            {activeSession && <SessionSummary session={activeSession} />}
            <ChevronDown
              size={14}
              className={`sl-trigger-chevron${dropdownOpen ? ' sl-trigger-chevron--open' : ''}`}
              aria-hidden="true"
            />
          </button>

          {dropdownOpen && (
            <div className="sl-menu" role="listbox">
              {sessions.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={s.id === activeId}
                  className={`sl-option${s.id === activeId ? ' sl-option--active' : ''}`}
                  onClick={() => select(s.id)}
                >
                  <span className={`sl-dot${s.complete ? ' sl-dot--complete' : ' sl-dot--active'}`} aria-hidden="true" />
                  <div className="sl-option-info">
                    <div className="sl-option-top">
                      <code className="sl-opt-id">{s.id.slice(0, 8)}</code>
                      <span className="sl-opt-sep">·</span>
                      <span className="sl-opt-agent">{s.agent?.agent_name ?? 'unknown'}</span>
                      {i === 0 && <span className="sl-latest-pill">latest</span>}
                    </div>
                    <div className="sl-option-bottom">
                      <span>{s.events.length} events</span>
                      <span className="sl-opt-sep">·</span>
                      <span>{s.workflowCount} workflow{s.workflowCount !== 1 ? 's' : ''}</span>
                      <span className="sl-opt-sep">·</span>
                      <span className={s.complete ? 'sl-opt-complete' : 'sl-opt-active'}>
                        {s.complete ? 'complete' : 'active'}
                      </span>
                    </div>
                  </div>
                  <span className="sl-opt-time">
                    <Clock size={10} aria-hidden="true" />
                    {timeAgo(s.latestAt)}
                  </span>
                </button>
              ))}

              {hasMore && (
                <button
                  type="button"
                  className="sl-load-more-opt"
                  onClick={() => { onLoadMore(); setDropdownOpen(false) }}
                  disabled={loading}
                >
                  {loading ? 'Loading…' : `Load more (${total - logs.length} remaining)`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Execution tree for selected session ── */}
      {activeSession && (
        <WorkflowTree logs={activeSession.events} embedded />
      )}
    </div>
  )
}

function SessionSummary({ session }) {
  return (
    <div className="sl-trigger-inner">
      <span className={`sl-dot${session.complete ? ' sl-dot--complete' : ' sl-dot--active'}`} aria-hidden="true" />
      <code className="sl-trigger-id">{session.id.slice(0, 8)}</code>
      <span className="sl-trigger-sep">·</span>
      <span className="sl-trigger-agent">{session.agent?.agent_name ?? 'unknown'}</span>
      <span className="sl-trigger-time">
        <Clock size={10} aria-hidden="true" />
        {timeAgo(session.latestAt)}
      </span>
    </div>
  )
}
