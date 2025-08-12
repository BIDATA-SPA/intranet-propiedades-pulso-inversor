import SignUpCustomerForm from './components/SignUpCustomerForm'

const SignUpCustomer = () => {
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">Regístrate como Cliente</h3>
        <p className="leading-relaxed">
          Publicar tus propiedades nunca fue tan fácil con Procanje.
        </p>
      </div>
      <SignUpCustomerForm disableSubmit={false} />
    </>
  )
}

export default SignUpCustomer
