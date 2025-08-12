import Loading from '@/components/shared/Loading'
import WhatsAppChat from '@/components/shared/WhatsAppChat'
import { useEffect, useState } from 'react'
import Loader from '../../../../public/loader-procanje.gif'
import SignInForm from './SignInForm'

const SignIn = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])
  /* console.log(import.meta.env); */ 
  return (
    <>
      {/* {loading ? ( 
        <div className="flex justify-center items-center h-screen">
          <Loading
            loading={true}
            customLoader={<img src={Loader} className="w-40 h-40" />}
          />
        </div>
      ) : ( */}
        <>
          <div className="mb-8">
            <h3 className="mb-1">¡Bienvenido de nuevo!</h3>
            <p>Introduzca sus credenciales para iniciar sesión.</p>
          </div>
          <SignInForm disableSubmit={false} />
          <WhatsAppChat />
        </>
      {/* )} */}
    </>
  )
}

export default SignIn
