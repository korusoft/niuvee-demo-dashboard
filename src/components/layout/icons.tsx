type IconProps = { size?: number }

const base = {
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function HomeIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function ShieldIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  )
}

export function BoltIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M13 3 4 14h6l-1 7 9-11h-6z" />
    </svg>
  )
}

export function LeafIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 20c8 0 14-6 15-15-9 0-15 6-15 15Z" />
      <path d="M5 19c3-3 6-7 9-11" />
    </svg>
  )
}

export function MenuIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function ArrowRightIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function RobotIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3v3" />
      <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
      <rect x="5" y="7" width="14" height="12" rx="3" />
      <path d="M9 12.5v1.5M15 12.5v1.5" />
      <path d="M9.5 16.5h5" />
      <path d="M2 12h3M19 12h3" />
    </svg>
  )
}

export function SendIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 12 20 4l-6 16-3-7-7-3Z" />
    </svg>
  )
}

export function TrashIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M5 7h14M9 7V4h6v3M6 7l1 13h10l1-13" />
    </svg>
  )
}
