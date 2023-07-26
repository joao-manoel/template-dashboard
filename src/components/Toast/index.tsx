'use client'
import { useThemeContext } from '@/contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
export function Toast() {
  const { theme } = useThemeContext()
  
  return (
    <ToastContainer
      theme={theme === 'light' ? 'light' : 'dark'}
      position='bottom-right'
    />
  )
}