import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { MotionConfig } from 'framer-motion'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
        <Toaster
          position="top-right"
          containerClassName="libro-toast-region"
          toastOptions={{
            duration: 3500,
            className: 'libro-toast',
            style: {
              borderRadius: 14,
              background: 'rgb(var(--card))',
              color: 'rgb(var(--fg))',
              border: '1px solid rgb(var(--border))',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
