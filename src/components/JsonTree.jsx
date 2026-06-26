import { useState } from 'react'

function JsonNode({ name, value, depth }) {
  const [open, setOpen] = useState(depth < 2)

  const isNull = value === null
  const isArr = Array.isArray(value)
  const type = isNull ? 'null' : isArr ? 'array' : typeof value
  const isExpandable = type === 'object' || type === 'array'
  const entries = isExpandable
    ? isArr
      ? value.map((v, i) => [i, v])
      : Object.entries(value)
    : []
  const isEmpty = isExpandable && entries.length === 0
  const open_ = isExpandable && !isEmpty && open

  const bracket = type === 'array' ? ['[', ']'] : ['{', '}']

  return (
    <div className="jt-node">
      <div
        className={`jt-row${isExpandable && !isEmpty ? ' jt-row--click' : ''}`}
        onClick={isExpandable && !isEmpty ? () => setOpen(o => !o) : undefined}
        role={isExpandable && !isEmpty ? 'button' : undefined}
        tabIndex={isExpandable && !isEmpty ? 0 : undefined}
        onKeyDown={isExpandable && !isEmpty
          ? e => (e.key === 'Enter' || e.key === ' ') && setOpen(o => !o)
          : undefined}
        aria-expanded={isExpandable && !isEmpty ? open : undefined}
      >
        <span className="jt-toggle" aria-hidden="true">
          {isExpandable && !isEmpty ? (open ? '▾' : '▸') : ' '}
        </span>

        {name !== undefined && (
          <>
            <span className="jt-key">"{name}"</span>
            <span className="jt-punct">: </span>
          </>
        )}

        {isExpandable ? (
          <>
            <span className="jt-bracket">{bracket[0]}</span>
            {!open && !isEmpty && (
              <span className="jt-ellipsis"> … {entries.length} </span>
            )}
            {(isEmpty || !open) && <span className="jt-bracket">{bracket[1]}</span>}
          </>
        ) : (
          <JsonPrimitive value={value} type={type} />
        )}
      </div>

      {open_ && (
        <div className="jt-children">
          {entries.map(([k, v]) => (
            <JsonNode key={k} name={k} value={v} depth={depth + 1} />
          ))}
          <div className="jt-row">
            <span className="jt-toggle" aria-hidden="true"> </span>
            <span className="jt-bracket">{bracket[1]}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function JsonPrimitive({ value, type }) {
  if (type === 'null') return <span className="jt-null">null</span>
  if (type === 'boolean') return <span className="jt-bool">{String(value)}</span>
  if (type === 'number') return <span className="jt-num">{value}</span>
  return <span className="jt-str">"{String(value)}"</span>
}

export default function JsonTree({ data }) {
  return (
    <div className="jt-root">
      <JsonNode value={data} depth={0} />
    </div>
  )
}
