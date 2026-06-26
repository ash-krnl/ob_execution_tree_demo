import { ChevronDown, ChevronRight, CircleCheck, Circle, Clock } from 'lucide-react'
import WorkflowTree from './WorkflowTree'
import { timeAgo, formatTime } from '../utils'

export default function SessionItem({ session, isOpen, isFirst, onToggle }) {
  const { id, events, agent, latestAt, complete, workflowCount } = session
  const agentName = agent?.agent_name ?? 'unknown'
  const eventCount = events.length

  return (
    <div className={`si-item${isOpen ? ' si-item--open' : ''}${isFirst ? ' si-item--first' : ''}`}>
      <button
        type="button"
        className={`si-header${complete ? ' si-header--complete' : ' si-header--active'}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="si-chevron" aria-hidden="true">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>

        <span className={`si-dot${complete ? ' si-dot--complete' : ' si-dot--active'}`} aria-hidden="true" />

        <div className="si-info">
          <div className="si-top-row">
            <code className="si-id">{id.slice(0, 8)}</code>
            <span className="si-sep" aria-hidden="true">·</span>
            <span className="si-agent">{agentName}</span>
          </div>
          <div className="si-bottom-row">
            <span className="si-count">{eventCount} event{eventCount !== 1 ? 's' : ''}</span>
            {workflowCount > 0 && (
              <>
                <span className="si-sep" aria-hidden="true">·</span>
                <span className="si-count">{workflowCount} workflow{workflowCount !== 1 ? 's' : ''}</span>
              </>
            )}
          </div>
        </div>

        <div className="si-right">
          <span className="si-time">
            <Clock size={11} aria-hidden="true" />
            {timeAgo(latestAt)}
          </span>
          <span className={`si-badge${complete ? ' si-badge--complete' : ' si-badge--active'}`}>
            {complete
              ? <><CircleCheck size={11} aria-hidden="true" /> Complete</>
              : <><Circle size={11} aria-hidden="true" /> Active</>
            }
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="si-body">
          <WorkflowTree logs={events} embedded />
        </div>
      )}
    </div>
  )
}
