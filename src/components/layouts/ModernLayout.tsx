import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import { useGetMyInfoQuery } from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import View from '@/views'
import { useEffect, useState } from 'react'
import ConverseDivise from '../Divisas/ConverseDivise'
import SupportAppChat from '../shared/SupportAppChat'
import UserAlert from '../shared/UserAlert'
import WhatsAppChat from '../shared/WhatsAppChat'

// Mock de notificaciones
const notifications = []

// Componente para acciones del header (inicio)
const HeaderActionsStart = () => (
  <>
    <MobileNav />
    <SideNavToggle />
  </>
)

// Componente para acciones del header (final)
const HeaderActionsEnd = () => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  return (
    <>
      {userAuthority === 2 ? <ConverseDivise /> : null}

      {userAuthority === 2 ? null : null}

      {userAuthority === 2 ? (
        <div className="sm:block hidden">
          <SidePanel />
        </div>
      ) : null}

      <UserDropdown hoverable={false} />
    </>
  )
}

const ModernLayout = () => {
  const { data: userInfo } = useGetMyInfoQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const [incompleteFields, setIncompleteFields] = useState([])

  // Campos que deben ser completados
  const requiredFields = [
    { key: 'name', label: 'Nombre' },
    { key: 'lastName', label: 'Apellido' },
    { key: 'phone', label: 'Teléfono celular' },
    { key: 'rut', label: 'RUT' },
    { key: 'webPage', label: 'Página Web' },
    { key: 'address.country.name', label: 'País' },
    { key: 'address.internalDbState.name', label: 'Estado/Región' },
    { key: 'address.internalDbCity.name', label: 'Ciudad o Comuna' },
    { key: 'address.street', label: 'Dirección' },
    {
      key: 'about',
      label: 'Sobre mí',
      validate: (value: string) => value && value !== '<p><br></p>',
    },
  ]

  // Función para verificar los campos incompletos
  const checkIncompleteFields = (userInfo) => {
    const missingFields = requiredFields
      .filter((field) => {
        const keys = field.key.split('.')
        const value = keys.reduce((obj, key) => obj?.[key], userInfo)
        return field.validate ? !field.validate(value) : !value
      })
      .map((field) => field.label)

    setIncompleteFields(missingFields)
  }

  useEffect(() => {
    if (userInfo) checkIncompleteFields(userInfo)
  }, [userInfo])

  return (
    <div className="app-layout-modern flex flex-auto flex-col">
      <div className="flex flex-auto min-w-0">
        <SideNav />
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <Header
            className="border-b border-gray-200 dark:border-gray-700 mb-12 md:mb-0"
            headerEnd={<HeaderActionsEnd />}
            headerStart={<HeaderActionsStart />}
          />
          {/* Mostrar la alerta si los datos del usuario están incompletos */}
          {userAuthority === 2
            ? incompleteFields.length > 0 && (
                <UserAlert incompleteFields={incompleteFields} />
              )
            : null}

          <View />
        </div>
      </div>

      <SupportAppChat />
      <WhatsAppChat />
    </div>
  )
}

export default ModernLayout
