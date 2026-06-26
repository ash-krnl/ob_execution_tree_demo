import { useState, useMemo } from 'react'
import { ChevronsDown, ChevronsUp } from 'lucide-react'
import WorkflowGroup from './WorkflowGroup'
import StatsBar from './StatsBar'

function processLogs(logs) {
  const sorted = [...logs].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  const groups = new Map()
  for (const event of sorted) {
    const key = event.workflow_id
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(event)
  }
  return groups
}

function computeStats(logs) {
  return {
    signals: logs.filter(e => e.event_type === 'SignalReceived').length,
    llmCalls: logs.filter(
      e => e.event_type === 'ActivityCompleted' && e.activity_type?.includes('chat_model')
    ).length,
    toolExec: logs.filter(
      e => e.event_type === 'ActivityCompleted' && e.activity_type && !e.activity_type.includes('chat_model')
    ).length,
    valid: logs.filter(e => e.verdict === 0).length,
    complete: logs.some(e => e.event_type === 'WorkflowCompleted'),
  }
}

export default function WorkflowTree({ logs, embedded = false }) {
  const groups = useMemo(() => processLogs(logs), [logs])
  const stats = useMemo(() => computeStats(logs), [logs])
  const workflowIds = useMemo(() => Array.from(groups.keys()), [groups])

  const [expandedGroups, setExpandedGroups] = useState(() => new Set(workflowIds))
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  const expandAll = () => {
    setExpandedGroups(new Set(workflowIds))
    setExpandedNodes(new Set(logs.map(e => e.id)))
  }
  const collapseAll = () => {
    setExpandedGroups(new Set())
    setExpandedNodes(new Set())
  }

  const toggleGroup = (id) => setExpandedGroups(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleNode = (id) => setExpandedNodes(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const inner = (
    <>
      <div className={embedded ? 'tree-header tree-header--embedded' : 'tree-header'}>
        <div className="tree-title-block">
          <h3 className="tree-title">Workflow Execution Tree</h3>
          <p className="tree-subtitle">Hierarchical view of workflow execution with expandable nodes</p>
        </div>
        <div className="tree-actions">
          <button className="action-btn" onClick={expandAll}>
            <ChevronsDown size={13} aria-hidden="true" /> Expand All
          </button>
          <button className="action-btn" onClick={collapseAll}>
            <ChevronsUp size={13} aria-hidden="true" /> Collapse All
          </button>
        </div>
      </div>

      <div className="tree-body">
        {workflowIds.map(wfId => (
          <WorkflowGroup
            key={wfId}
            events={groups.get(wfId)}
            isExpanded={expandedGroups.has(wfId)}
            expandedNodes={expandedNodes}
            onToggleGroup={() => toggleGroup(wfId)}
            onToggleNode={toggleNode}
          />
        ))}
        {workflowIds.length === 0 && (
          <p className="empty-state">No workflow events in this session.</p>
        )}
      </div>

      <StatsBar stats={stats} />
    </>
  )

  if (embedded) return <div className="tree-embedded">{inner}</div>
  return <div className="tree-card">{inner}</div>
}
