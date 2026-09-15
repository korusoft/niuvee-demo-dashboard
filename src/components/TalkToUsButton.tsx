interface Props {
  className?: string
}

export function TalkToUsButton({ className }: Props) {
  return (
    <a
      href="https://niuvee.com/contacto"
      target="_blank"
      rel="noreferrer"
      className={`btn-talk ${className ?? ''}`}
    >
      Hablemos
    </a>
  )
}
