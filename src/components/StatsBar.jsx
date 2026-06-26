import { MessageSquare, Brain, Wrench, ShieldCheck, CircleCheckBig } from 'lucide-react'

export default function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <Stat icon={<MessageSquare size={14} />} value={stats.signals} label="Signals" cls="stat--blue" />
      <Stat icon={<Brain size={14} />} value={stats.llmCalls} label="LLM Calls" cls="stat--blue" />
      <Stat icon={<Wrench size={14} />} value={stats.toolExec} label="Tool Exec" cls="stat--accent" />
      <Stat icon={<ShieldCheck size={14} />} value={stats.valid} label="Valid" cls="stat--green" />
      {stats.complete && (
        <div className="stat stat--complete">
          <CircleCheckBig size={14} aria-hidden="true" />
          <span>Workflow Complete</span>
        </div>
      )}
    </div>
  )
}

function Stat({ icon, value, label, cls }) {
  return (
    <div className={`stat ${cls}`}>
      <span aria-hidden="true">{icon}</span>
      <span className="stat-val">{value}</span>
      <span className="stat-lbl">{label}</span>
    </div>
  )
}
