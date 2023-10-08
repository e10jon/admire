import ThemeProvider from '@mui/material/styles/ThemeProvider'
import CssBaseline from '@mui/material/CssBaseline'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'admin.fyi',
  description: 'Who do you admire?',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider theme={{}}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
