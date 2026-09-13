import type { Status } from '../lib/thresholds'
import { STATUS_LABEL } from '../lib/thresholds'

const ICON: Record<Status, string> = {
  good: '✓',
  warning: '!',
  danger: '✕',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__icon" aria-hidden="true">
        {ICON[status]}
      </span>
      {STATUS_LABEL[status]}
    </span>
  )
}
