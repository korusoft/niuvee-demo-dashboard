import { RANGE_LABELS, type RangeKey } from '../lib/api'

const RANGES = Object.keys(RANGE_LABELS) as RangeKey[]

interface Props {
  value: RangeKey
  onChange: (range: RangeKey) => void
}

export function RangeSelector({ value, onChange }: Props) {
  return (
    <div className="range-selector" role="group" aria-label="Rango de tiempo">
      {RANGES.map((range) => (
        <button
          key={range}
          className={`range-selector__btn ${value === range ? 'range-selector__btn--active' : ''}`}
          onClick={() => onChange(range)}
          aria-pressed={value === range}
        >
          {RANGE_LABELS[range]}
        </button>
      ))}
    </div>
  )
}
