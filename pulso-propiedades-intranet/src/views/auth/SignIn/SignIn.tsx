import Loading from '@/components/shared/Loading'
import SupportAppChat from '@/components/shared/SupportAppChat'
import WhatsAppChat from '@/components/shared/WhatsAppChat'
import { useEffect, useState } from 'react'
import SignInForm from './SignInForm'

const SignIn = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading loading={true} />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="mb-1">¡Bienvenido Corredor/a!</h3>
            <p>Introduzca sus credenciales para iniciar sesión.</p>
          </div>
          <SignInForm disableSubmit={false} />

          <SupportAppChat />
          <WhatsAppChat />
        </>
      )}
    </>
  )
}

export default SignIn
