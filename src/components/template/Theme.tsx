import type { CommonProps } from '@/@types/common'
import ConfigProvider from '@/components/ui/ConfigProvider'
import { themeConfig } from '@/configs/theme.config'
import store, { useAppSelector } from '@/store'
import useDarkMode from '@/utils/hooks/useDarkmode'
// import { useValidateSessionQuery } from '@/services/RtkQueryService' ⚠️ cleaned console error
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import { Loading } from '../shared'

const Theme = (props: CommonProps) => {
  const theme = useAppSelector((state) => state.theme)
  const locale = useAppSelector((state) => state.locale.currentLang)
  useDarkMode()

  const currentTheme = {
    ...themeConfig,
    ...theme,
    ...{ locale },
  }

  const { auth } = store.getState()
  const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
  const persistData = deepParseJson(rawPersistData)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let signedIn = (persistData as any)?.auth?.session?.token
  const sessionInfo: any = { isLoading: false }

  if (!signedIn) {
    signedIn = auth?.session?.signedIn
  }

  // sessionInfo = useValidateSessionQuery({}) // ⚠️ cleaned console error

  return (
    <>
      {sessionInfo.isLoading ? (
        <div className="flex flex-auto flex-col h-[100vh] text-center justify-center items-center">
          <Loading
            loading={true}
            spinnerClass={`text-${currentTheme.themeColor}-${currentTheme.primaryColorLevel}`}
            text="Verificando Sesión..."
          />
        </div>
      ) : (
        <ConfigProvider value={currentTheme}>{props.children}</ConfigProvider>
      )}
    </>
  )
}

export default Theme
