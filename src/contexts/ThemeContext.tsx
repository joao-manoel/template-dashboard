/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type ThemeProvideProps = {
  children: ReactNode
  initialTheme: string
}

type ThemeContextData = {
  theme: string
  setTheme: (theme: string) => void
}

const getInitialTheme = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('rscore.theme')
    if (typeof storedPrefs === 'string') {
      return storedPrefs
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
    if (userMedia.matches) {
      return 'dark'
    }
  }
  return 'light'
}

export const ThemeContext = createContext({} as ThemeContextData)

export const ThemeProvider = ({
  initialTheme,
  children,
}: ThemeProvideProps) => {
  const [theme, setTheme] = useState<string>(getInitialTheme())

  const rawSetTheme = (rawTheme: string) => {
    const root = window.document.documentElement
    const isDark = rawTheme === 'dark'

    root.classList.remove(isDark ? 'light' : 'dark')
    root.classList.add(rawTheme)

    localStorage.setItem('rscore.theme', rawTheme)
  }

  useEffect(() => {
    if (initialTheme) {
      rawSetTheme(initialTheme)
    }
  }, [])

  useEffect(() => {
    rawSetTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)
