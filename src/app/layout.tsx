import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
 
import '@/assets/globals.css';
import { Toast } from '@/components/Toast';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Template dashboard with nextjs 13',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  
  return (
    <html lang="pt-Br">
      <AuthProvider>
        <ThemeProvider initialTheme='dark'>
          <body
            className={`
              ${inter.className}
              dark:bg-zinc-950 dark:text-zinc-200
              bg-white text-zinc-800 
              w-screen h-screen
            `}
            suppressHydrationWarning={true}
          >
            <Toast />
            {children}
          </body>
        </ThemeProvider>      
      </AuthProvider>
    </html>
  )
}
