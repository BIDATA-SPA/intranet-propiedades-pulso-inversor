/* eslint-disable @typescript-eslint/no-unused-vars */
import WhatsAppChat from '@/components/shared/WhatsAppChat'
import { useEffect, useState } from 'react'
import SignInForm from './SignInForm'

const SignIn = () => {
  const [_, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">¡Bienvenido Corredor/a!</h3>
        <p>Introduzca sus credenciales para iniciar sesión.</p>
      </div>
      <SignInForm disableSubmit={false} />
      <WhatsAppChat />
    </>
  )
}

export default SignIn
