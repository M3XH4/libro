import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

let csrfReady = false
let csrfRequest: Promise<void> | null = null

export async function ensureCsrfCookie() {
  if (csrfReady) return
  csrfRequest ??= api.get('/sanctum/csrf-cookie').then(() => {
    csrfReady = true
  }).finally(() => {
    csrfRequest = null
  })

  await csrfRequest
}

function needsCsrf(config: InternalAxiosRequestConfig) {
  const method = config.method?.toLowerCase() ?? 'get'
  return !['get', 'head', 'options'].includes(method)
}

api.interceptors.request.use(async (config) => {
  if (needsCsrf(config)) {
    await ensureCsrfCookie()
  }

  return config
})
