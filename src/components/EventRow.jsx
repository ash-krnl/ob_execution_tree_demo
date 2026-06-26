import { useState } from 'react'
import { ChevronRight, ChevronDown, MessageSquare, Wrench, CircleCheckBig, Code2 } from 'lucide-react'
import MetadataPanel from './MetadataPanel'
import { formatTime, formatDuration } from '../utils'

const EVENT_VARIANT = {
  SignalReceived: 'signal',
  WorkflowCompleted: 'complete',
  ActivityStarted: 'activity',
  ActivityCompleted: 'activity',
}

function EventIcon({ eventType }) {
  const size = 11
  if (eventType === 'SignalReceived') return <MessageSquare size={size} />
  if (eventType === 'WorkflowCompleted') return <CircleCheckBig size={size} />
  return <Wrench size={size} />
}

export default function EventRow({ event, isExpanded, onToggle }) {
  const variant = EVENT_VARIANT[event.event_type] ?? 'activity'
  const subtitle = event.activity_type ?? event.signal_name ?? ''
  const time = formatTime(event.created_at)
  const duration = formatDuration(event.duration_ms)
  const hasSpans = event.span_count > 0

  // Parse signal_args — it arrives as a JSON-encoded string e.g. "\"the prompt\""
  const parsedSignalArgs = (() => {
    if (event.event_type !== 'SignalReceived' || !event.signal_args) return null
    try { return JSON.parse(event.signal_args) } catch { return event.signal_args }
  })()

  return (
    <div className="ev-node">
      <button
        type="button"
        className={`ev-row ev-row--${variant}`}
        onClick={onToggle}
      >
        {isExpanded
          ? <ChevronDown size={13} className="ev-chevron" aria-hidden="true" />
          : <ChevronRight size={13} className="ev-chevron" aria-hidden="true" />
        }
        <div className={`ev-icon ev-icon--${variant}`} aria-hidden="true">
          <EventIcon eventType={event.event_type} />
        </div>
        <div className="ev-content">
          <div className="ev-title-row">
            <span className="ev-type">{event.event_type}</span>
            {subtitle && <span className="ev-subtitle">{subtitle}</span>}
            {hasSpans && (
              <span className="ev-badge">
                {event.span_count} span{event.span_count !== 1 ? 's' : ''}
              </span>
            )}
            {duration && (
              <span className={`ev-duration ev-duration--mobile ev-duration--${variant}`}>
                {duration}
              </span>
            )}
          </div>
        </div>
        {duration && (
          <span className={`ev-duration ev-duration--desktop ev-duration--${variant}`}>
            {duration}
          </span>
        )}
        {time && <span className="ev-time">{time}</span>}
      </button>

      {isExpanded && (
        <div className="ev-expanded-body">
          {/* SignalReceived: signal args panel + metadata panel */}
          {event.event_type === 'SignalReceived' && (
            <>
              {parsedSignalArgs != null && (
                <div className="ev-expand">
                  <MetadataPanel data={parsedSignalArgs} label="Signal Args" showUnwrap />
                </div>
              )}
              {event.metadata && (
                <div className="ev-expand">
                  <MetadataPanel data={event.metadata} label="Metadata" showUnwrap />
                </div>
              )}
            </>
          )}

          {/* Activity / other events: spans first, then metadata */}
          {event.event_type !== 'SignalReceived' && (
            <>
              {event.spans?.length > 0 && (
                <div className="ev-spans">
                  {event.spans.map(span => (
                    <SpanRow key={span.id} span={span} eventInput={event.input} />
                  ))}
                </div>
              )}
              {!event.spans?.length && (event.metadata ?? event.input ?? event.output) && (
                <div className="ev-expand">
                  <MetadataPanel
                    data={event.metadata ?? event.input ?? event.output}
                    label="Metadata"
                    showUnwrap
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function SpanRow({ span, eventInput }) {
  const [open, setOpen] = useState(false)

  const spanType = span.span_type ?? span.span_kind ?? 'span'
  const stage = span.stage ?? span.data?.stage ?? '—'
  const expandData = eventInput ?? span.data?.data ?? span.attributes ?? span.data

  return (
    <div className="span-node">
      <button
        type="button"
        className="span-row"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {open
          ? <ChevronDown size={13} className="span-chevron" aria-hidden="true" />
          : <ChevronRight size={13} className="span-chevron" aria-hidden="true" />
        }
        <div className="span-icon" aria-hidden="true">
          <Code2 size={11} />
        </div>
        <div className="span-content">
          <span className="span-type-label">{spanType}</span>
          <span className="span-name-text">{span.name}</span>
        </div>
        <span className={`span-stage span-stage--${stage}`}>{stage}</span>
      </button>

      {open && expandData && (
        <div className="span-expand">
          <MetadataPanel data={expandData} label="Input" showUnwrap />
        </div>
      )}
    </div>
  )
}
