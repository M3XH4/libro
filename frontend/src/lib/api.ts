import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const configuredApiHost = import.meta.env.VITE_API_URL

function resolveApiHost() {
  if (typeof window === 'undefined') return configuredApiHost ?? 'http://localhost:8000'

  const fallback = `${window.location.protocol}//${window.location.hostname}:8000`
  if (!configuredApiHost) return fallback

  const pageHost = window.location.hostname
  const localHosts = new Set(['localhost', '127.0.0.1'])

  try {
    const url = new URL(configuredApiHost)
    if (localHosts.has(pageHost) && localHosts.has(url.hostname)) {
      url.hostname = pageHost
      return url.toString().replace(/\/$/, '')
    }
  } catch {
    return fallback
  }

  return configuredApiHost
}

export const api = axios.create({
  baseURL: resolveApiHost(),
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

export function resetCsrfCookie() {
  csrfReady = false
  csrfRequest = null
}

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 419) {
      resetCsrfCookie()
    }

    return Promise.reject(error)
  },
)
