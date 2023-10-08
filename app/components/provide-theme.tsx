'use client'

import ThemeProvider from '@mui/material/styles/ThemeProvider'
import theme from './theme'

export const ProvideTheme = ({ children }: { children: React.ReactNode }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
