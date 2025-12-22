import { ConfigProvider, App as AntdApp, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { AppRouter } from '@/router/routes'
import { useAppStore } from '@/stores/app'

export default function App() {
  const locale = useAppStore((s) => s.locale)
  const themeMode = useAppStore((s) => s.themeMode)

  const antdLocaleMap = {
    'zh-CN': zhCN,
    'en-US': enUS,
  } as const

  return (
    <ConfigProvider
      locale={antdLocaleMap[locale as keyof typeof antdLocaleMap]}
      theme={{
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: '#1677ff' },
      }}
    >
      <AntdApp>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  )
}
