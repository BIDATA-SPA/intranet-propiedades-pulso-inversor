import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import TokenForm from './TokenForm'

const ConfirmAccount = () => {
  return (
    <div className="text-center">
      <DoubleSidedImage
        className="mx-auto mb-8"
        src="/img/others/welcome.png"
        darkModeSrc="/img/others/welcome-dark.png"
        alt="Welcome"
      />
      <h3 className="mb-2">Bienvenido, vamos a validar tu e-mail</h3>
      <p className="text-base">
        Validando tu email de acceso, podrás contar con todos los beneficios de
        la comunidad.
      </p>
      <div className="mt-8 max-w-[350px] mx-auto">
        <TokenForm disableSubmit={false} />
      </div>
    </div>
  )
}

export default ConfirmAccount
