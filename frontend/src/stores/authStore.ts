import { create } from 'zustand'

export type Role = 'admin' | 'librarian' | 'member'

export type Me = {
  id: number
  name: string
  email: string
  role: Role
}

type AuthState = {
  me: Me | null
  setMe: (me: Me | null) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  me: null,
  setMe: (me) => set({ me }),
  darkMode: document.documentElement.classList.contains('dark'),
  setDarkMode: (v) =>
    set(() => {
      document.documentElement.classList.toggle('dark', v)
      return { darkMode: v }
    }),
}))

