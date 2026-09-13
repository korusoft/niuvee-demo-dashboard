import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('niuvee-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore storage access errors
  }
  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('niuvee-theme', theme)
    } catch {
      // ignore storage access errors
    }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, toggle }
}
