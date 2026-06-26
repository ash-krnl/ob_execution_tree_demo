import { ChevronDown, ChevronRight, GitBranch, Lock } from 'lucide-react'
import EventRow from './EventRow'
import MetadataPanel from './MetadataPanel'

export default function WorkflowGroup({
  events,
  isExpanded,
  expandedNodes,
  onToggleGroup,
  onToggleNode,
}) {
  const rootEvent =
    events.find(e => e.event_type === 'WorkflowStarted') ?? events[0]
  const childEvents = events.filter(e => e !== rootEvent)

  const runId = rootEvent.run_id?.slice(0, 8) ?? '—'
  const hashPreview = rootEvent.id.slice(0, 13) + '…'

  return (
    <div className="wf-node">
      <button
        type="button"
        className="wf-root-btn"
        onClick={onToggleGroup}
        aria-expanded={isExpanded}
      >
        {isExpanded
          ? <ChevronDown size={15} className="wf-chevron" aria-hidden="true" />
          : <ChevronRight size={15} className="wf-chevron" aria-hidden="true" />
        }
        <div className="wf-icon" aria-hidden="true">
          <GitBranch size={14} />
        </div>
        <div className="wf-info">
          <div className="wf-name">{rootEvent.workflow_type}</div>
          <div className="wf-meta">
            <span className="wf-run-id">run: {runId}</span>
            <span className="wf-hash" title={`ID: ${rootEvent.id}`}>
              <Lock size={9} aria-hidden="true" />
              {hashPreview}
            </span>
          </div>
        </div>
      </button>

      {isExpanded && (
        <>
          {childEvents.length > 0 && (
            <div className="wf-children">
              {childEvents.map(event => (
                <EventRow
                  key={event.id}
                  event={event}
                  isExpanded={expandedNodes.has(event.id)}
                  onToggle={() => onToggleNode(event.id)}
                />
              ))}
            </div>
          )}
          <div className="wf-metadata-wrap">
            <MetadataPanel data={rootEvent.metadata} label="Metadata" />
          </div>
        </>
      )}
    </div>
  )
}
