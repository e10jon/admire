import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProvideTheme } from './components/provide-theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'admin.fyi',
  description: 'Who do you admire?',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ProvideTheme>{children}</ProvideTheme>
      </body>
    </html>
  )
}
