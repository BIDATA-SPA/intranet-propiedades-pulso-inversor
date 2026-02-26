import SignUpForm from './SignUpForm'

const SignUpWebinar = () => {
  return (
    <>
      <div className="mb-8">
        <img
          src="/img/webinar/webinar.jpg" // reemplaza con la ruta correcta
          alt="Webinar"
          className="mx-auto mb-4 w-32 h-auto"
        />
        <h3 className="mb-1 text-3xl">¡Inscríbete al webinar!</h3>
        <p className="leading-relaxed text-base">
          Ingrese sus datos para obtener un acceso exclusivo al evento en vivo.
          <br />
        </p>
      </div>
      <SignUpForm disableSubmit={false} />
    </>
  )
}

export default SignUpWebinar
