import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Spinner from '@/components/ui/Spinner'
import Tabs from '@/components/ui/Tabs'
import { ReactNode, Suspense, lazy, useState } from 'react'
import { FaInbox, FaTelegramPlane } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Inbox = lazy(() => import('./components/tabs/Inbox'))
const Sent = lazy(() => import('./components/tabs/Sent'))

const { TabNav, TabList } = Tabs

const settingsMenu: Record<
  string,
  {
    label: string
    path: string
    icon: ReactNode
  }
> = {
  inbox: { label: 'Recibidos', path: 'inbox', icon: <FaInbox /> },
  sent: { label: 'Enviados', path: 'sent', icon: <FaTelegramPlane /> },
}

const KanjeRequestManagment = () => {
  const [currentTab, setCurrentTab] = useState('inbox')
  const navigate = useNavigate()

  const onTabChange = (tabId: string) => {
    setCurrentTab(tabId)
    navigate(`/gestion-de-solicitud-de-canjes/${tabId}`)
  }

  return (
    <Container className="h-full">
      <AdaptableCard>
        <h1 className="text-lg md:text-xl mb-5">Solicitudes de Canje</h1>
        <Tabs value={currentTab} onChange={(val) => onTabChange(String(val))}>
          <TabList>
            {Object.keys(settingsMenu).map((key) => (
              <TabNav key={key} value={key}>
                <span className="mr-1">{settingsMenu[key].icon}</span>
                {settingsMenu[key].label}
              </TabNav>
            ))}
          </TabList>
        </Tabs>
        <div className="px-4 py-6">
          <Suspense fallback={<Spinner />}>
            {currentTab === 'inbox' && <Inbox />}
            {currentTab === 'sent' && <Sent />}
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  )
}

export default KanjeRequestManagment
