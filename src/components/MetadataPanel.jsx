import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import JsonTree from './JsonTree'

function syntaxHighlight(json) {
  return JSON.stringify(json, null, 2).replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.*\d*)?(?:[eE][+-]?\d+)?)/g,
    match => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="sh-key">${match}</span>`
        return `<span class="sh-str">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="sh-bool">${match}</span>`
      if (/null/.test(match)) return `<span class="sh-null">${match}</span>`
      return `<span class="sh-num">${match}</span>`
    }
  )
}

function unwrap(data) {
  if (Array.isArray(data) && data.length === 1) return data[0]
  return data
}

export default function MetadataPanel({ data, label, showUnwrap = false }) {
  const [view, setView] = useState('tree')
  const [copiedRaw, setCopiedRaw] = useState(false)
  const [copiedUnwrap, setCopiedUnwrap] = useState(false)

  const raw = JSON.stringify(data, null, 2)
  const unwrapped = JSON.stringify(unwrap(data), null, 2)

  const copyRaw = () => {
    navigator.clipboard.writeText(raw).then(() => {
      setCopiedRaw(true)
      setTimeout(() => setCopiedRaw(false), 1800)
    })
  }

  const copyUnwrap = () => {
    navigator.clipboard.writeText(unwrapped).then(() => {
      setCopiedUnwrap(true)
      setTimeout(() => setCopiedUnwrap(false), 1800)
    })
  }

  return (
    <div className="mp-panel">
      <div className="mp-toolbar">
        <div className="mp-tabs" role="tablist">
          {['tree', 'pretty', 'raw'].map(v => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              className={`mp-tab${view === v ? ' mp-tab--active' : ''}`}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div className="mp-copy-group">
          <button type="button" className="mp-copy" onClick={copyRaw} title="Copy raw JSON">
            {copiedRaw
              ? <><Check size={11} aria-hidden="true" /> Copied</>
              : <><Copy size={11} aria-hidden="true" /> Copy raw</>
            }
          </button>
          {showUnwrap && (
            <button type="button" className="mp-copy" onClick={copyUnwrap} title="Copy unwrapped JSON">
              {copiedUnwrap
                ? <><Check size={11} aria-hidden="true" /> Copied</>
                : <><Copy size={11} aria-hidden="true" /> Copy unwrapped</>
              }
            </button>
          )}
          {label && <span className="mp-label">{label}</span>}
        </div>
      </div>

      <div className="mp-body" role="tabpanel">
        {view === 'tree' && <JsonTree data={data} />}
        {view === 'pretty' && (
          <pre
            className="mp-pre"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}
          />
        )}
        {view === 'raw' && <pre className="mp-pre mp-pre--raw">{raw}</pre>}
      </div>
    </div>
  )
}
