import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

export type AppLocale = 'zh-CN' | 'en-US'
export type ThemeMode = 'light' | 'dark'

type AppState = {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
}

function applyDayjsLocale(locale: AppLocale) {
  dayjs.locale(locale === 'zh-CN' ? 'zh-cn' : 'en')
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: 'zh-CN',
      setLocale: (locale) => {
        applyDayjsLocale(locale)
        set({ locale })
      },
      themeMode: 'light',
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: 'yyz_admin_app',
      partialize: (s) => ({ locale: s.locale, themeMode: s.themeMode }),
      onRehydrateStorage: () => (state) => {
        if (state?.locale) applyDayjsLocale(state.locale)
      },
    }
  )
)


