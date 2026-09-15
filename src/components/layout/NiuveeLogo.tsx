interface Props {
  variant?: 'full' | 'icon'
  className?: string
}

export function NiuveeLogo({ variant = 'full', className }: Props) {
  if (variant === 'icon') {
    return (
      <span className={`niuvee-logo niuvee-logo--icon ${className ?? ''}`}>
        <img src="/logo-niuvee.svg" alt="Niuvee IoT" />
      </span>
    )
  }

  return (
    <span className={`niuvee-logo niuvee-logo--full ${className ?? ''}`}>
      <img src="/niuvee.svg" alt="Niuvee IoT" />
    </span>
  )
}
