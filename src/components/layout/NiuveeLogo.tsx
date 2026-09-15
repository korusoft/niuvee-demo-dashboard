interface Props {
  variant?: 'full' | 'icon'
  className?: string
}

export function NiuveeLogo({ variant = 'full', className }: Props) {
  if (variant === 'icon') {
    return (
      <a
        href="https://niuvee.com"
        target="_blank"
        rel="noreferrer"
        className={`niuvee-logo niuvee-logo--icon ${className ?? ''}`}
      >
        <img src="/logo-niuvee.svg" alt="Niuvee IoT" />
      </a>
    )
  }

  return (
    <a
      href="https://niuvee.com"
      target="_blank"
      rel="noreferrer"
      className={`niuvee-logo niuvee-logo--full ${className ?? ''}`}
    >
      <img src="/logo-niuvee.svg" alt="" className="niuvee-logo__mark" />
      <img src="/niuvee.svg" alt="Niuvee IoT" className="niuvee-logo__word" />
    </a>
  )
}
