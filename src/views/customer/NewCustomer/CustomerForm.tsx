import { Notification, Tabs, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import {
  useCreateCustomerMutation,
  useGetAllCustomersQuery,
} from '@/services/RtkQueryService'
import {
  CreateCustomerBody,
  CreateCustomerFormModel,
} from '@/services/customers/types/customer.type'
import { tabsCustomersList } from '@/utils/types/new-property/constants'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import AddressInfo from './steps/AddressInfo'
import MainInfo from './steps/MainInfo'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es requerido.'),
  lastName: Yup.string().required('Este campo es requerido.'),
  rut: Yup.string().optional(),
  phone: Yup.string()
    .required('Este campo es requerido.')
    .matches(
      /^[0-9]{1,9}$/,
      'El número de teléfono debe contener solo números y no exceder 9 dígitos.'
    ),
  dialCodeId: Yup.string().required('Este campo es requerido.'),
  email: Yup.string()
    .email('Formato del correo incorrecto.')
    .required('Este campo es requerido.')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'El correo electrónico no es válido.'
    ),
  address: Yup.object().shape({
    countryId: Yup.number().required('Este campo es requerido.'),
    stateId: Yup.number().required('Este campo es requerido.'),
    cityId: Yup.number().required('Este campo es requerido.'),
    street: Yup.string().optional(),
  }),
})

type FormModel = CreateCustomerFormModel

const renderedTabs = () => {
  return tabsCustomersList.map(({ value, children, icon }) => (
    <TabNav key={value} value={value} icon={icon}>
      {children}
    </TabNav>
  ))
}

const CustomerForm = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [
    createCustomer,
    { data, isError, isLoading, isSuccess, isUninitialized, error },
  ] = useCreateCustomerMutation()
  const [searchParams] = useSearchParams()
  const [currentPage] = useState(+searchParams.get('page') || 1)

  const { data: allCustomers } = useGetAllCustomersQuery({
    page: currentPage || 1,
    limit: 999999,
    search: '',
    paginated: false,
  })
  const [customerExists, setCustomerExists] = useState(false)

  const onChange = (nextStep: number) => {
    if (nextStep < 0) {
      setStep(0)
    } else if (nextStep > 3) {
      setStep(3)
    } else {
      setStep(nextStep)
    }
  }

  const onNext = () => onChange(step + 1)
  const onPrevious = () => onChange(step - 1)

  const onSubmit = async (values: FormModel) => {
    const {
      address: { countryId, stateId, cityId, street },
      phone,
      dialCodeId,
      ...customerData
    } = values

    const body: CreateCustomerBody = {
      ...customerData,
      address: { street, cityId, stateId, countryId },
      phone,
      dialCodeId,
    }

    // Verifica si el cliente ya existe
    const customerAlreadyExists = allCustomers?.some(
      (customer) => customer.email === body.email
    )
    if (customerAlreadyExists) {
      setCustomerExists(true) // si existe, actualiza el state
      openNotification(
        'warning',
        'Cliente ya existe',
        'El cliente ya fue creado previamente.',
        3
      )
    } else {
      setCustomerExists(false)
      createCustomer(body)
    }
  }

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Cliente Creado',
        'Cliente creado correctamente',
        3
      )

      setTimeout(() => {
        navigate(`/clientes/${data?.id}`)
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al crear el cliente, por favor intenta más tarde',
        3
      )
    }
  }, [isError, isSuccess])

  const isNextButtonDisabled = (values: FormModel, errors: any) => {
    const { name, lastName, email, phone } = values
    return (
      !name ||
      !lastName ||
      !email ||
      errors.email ||
      !phone ||
      phone?.length > 9
    )
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: '',
        lastName: '',
        rut: '',
        alias: '',
        phone: '',
        dialCodeId: '', //Default Code Chile
        email: '',
        address: {
          countryId: null,
          stateId: null,
          cityId: null,
          street: '',
        },
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setFieldValue }) => {
        return (
          <Tabs value={step}>
            <TabList className="flex flex-row">{renderedTabs()}</TabList>
            <div className="p-4 flex flex-col">
              <Form>
                <FormContainer>
                  <TabContent value={0}>
                    <MainInfo
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </TabContent>

                  <TabContent value={1}>
                    <AddressInfo
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  </TabContent>
                </FormContainer>

                <div className="flex justify-center md:justify-end mt-4 text-right">
                  <FormItem>
                    <Button
                      className="mx-2"
                      disabled={step === 0}
                      onClick={onPrevious}
                    >
                      Atras
                    </Button>

                    {step === 1 ? (
                      <Button
                        type="submit"
                        className="mx-2"
                        variant="solid"
                        loading={isLoading}
                        disabled={customerExists}
                      >
                        {/* Guardar */}
                        {customerExists ? 'Cliente ya existe' : 'Guardar'}
                      </Button>
                    ) : (
                      <Button
                        className="mx-2"
                        variant="solid"
                        type="button"
                        disabled={isNextButtonDisabled(values, errors)}
                        onClick={(e) => {
                          e.preventDefault()
                          onNext()
                        }}
                      >
                        Siguiente
                      </Button>
                    )}
                  </FormItem>
                </div>
              </Form>
            </div>
          </Tabs>
        )
      }}
    </Formik>
  )
}

export default CustomerForm
