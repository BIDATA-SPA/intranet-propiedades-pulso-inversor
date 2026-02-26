/* eslint-disable react-hooks/exhaustive-deps */
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import StickyFooter from '@/components/shared/StickyFooter'
import { Alert } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import Tabs from '@/components/ui/Tabs'
import { useDeleteCustomerMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Form, Formik, FormikProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { forwardRef, useEffect, useState } from 'react'
import { AiOutlineSave } from 'react-icons/ai'
import { HiOutlineTrash, HiOutlineUser } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router'
import { validationSchema } from '../schema'
import BasicInfoFields from './BasicInfoFields'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

type InitialData = {
  name: string
  lastName: string
  alias?: string
  rut?: string
  email: string
  dialCodeId: number
  phone: string
  address: {
    countryId: number
    stateId: number
    cityId: number
    street?: string
  }
}

export type FormModel = Omit<InitialData, 'tags'> & {
  tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type CustomerForm = {
  initialData?: InitialData
  type: 'update' | 'create'
  onDiscard?: () => void
  onDelete?: OnDelete
  onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
  isLoading?: boolean
}

const { TabNav, TabList, TabContent } = Tabs

const DeleteCustomerButton = ({ onDelete }: { onDelete: OnDelete }) => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteCustomer, { isLoading, isError, isSuccess, error }] =
    useDeleteCustomerMutation()
  const { showNotification } = useNotification()

  const onConfirmDialogOpen = () => {
    setDialogOpen(true)
  }

  const onConfirmDialogClose = () => {
    setDialogOpen(false)
  }

  const handleConfirm = () => {
    deleteCustomer(customerId).unwrap()
    setDialogOpen(false)
    onDelete?.(setDialogOpen)
  }

  useEffect(() => {
    if (isSuccess) {
      showNotification(
        'success',
        'Eliminado',
        '¡Cliente eliminado exitosamente!'
      )
      navigate('/clientes')
    }

    if (isError) {
      setTimeout(() => {
        showNotification(
          'danger',
          'Error',
          `¡Ha ocurrido un error al eliminar el cliente, por favor inténtalo más tarde! ${
            error?.message && `- ${error?.message}`
          }`
        )
      }, 1000)
    }
  }, [isSuccess, isError, error])

  return (
    <div className="mr-2.5">
      <Button
        className="text-red-600"
        variant="plain"
        size="sm"
        icon={<HiOutlineTrash />}
        type="button"
        loading={isLoading}
        onClick={onConfirmDialogOpen}
      >
        Eliminar
      </Button>
      <ConfirmDialog
        isOpen={dialogOpen}
        type="danger"
        title="Eliminar Cliente"
        confirmButtonColor="red-600"
        onClose={onConfirmDialogClose}
        onRequestClose={onConfirmDialogClose}
        onCancel={onConfirmDialogClose}
        onConfirm={handleConfirm}
      >
        <p>
          ¿Está seguro de que desea eliminar este cliente? Todos los registros
          relacionados con este cliente también se eliminarán. Esta acción no se
          puede deshacer
        </p>
      </ConfirmDialog>
    </div>
  )
}

const CustomerForm = forwardRef<FormikRef, CustomerForm>((props, ref) => {
  const {
    type,
    initialData = {
      name: '',
      lastName: '',
      alias: '',
      rut: '',
      email: '',
      dialCodeId: '',
      phone: '',
      address: {
        countryId: 0,
        stateId: 0,
        cityId: 0,
        street: '',
      },
    },
    onFormSubmit,
    onDiscard,
    onDelete,
    isLoading,
  } = props

  return (
    <>
      <Formik
        enableReinitialize
        innerRef={ref}
        initialValues={{
          ...initialData,
        }}
        validationSchema={validationSchema}
        onSubmit={(values: FormModel, { setSubmitting }) => {
          const formData = cloneDeep(values)

          if (type === 'create' || type === 'update') {
            onFormSubmit?.(formData, setSubmitting)
          }
        }}
      >
        {({ values, touched, errors, setFieldValue }) => {
          return (
            <Form>
              <FormContainer>
                <Tabs defaultValue="tab1">
                  <TabList>
                    <TabNav value="tab1" icon={<HiOutlineUser />}>
                      Información básica
                    </TabNav>
                  </TabList>

                  <Alert
                    showIcon
                    closable
                    type="info"
                    className="mt-2 mb-0"
                    title="¡Atención al crear un cliente!"
                  >
                    Todos los campos con el signo (*) son obligatorios.
                  </Alert>

                  <div>
                    <TabContent value="tab1">
                      <BasicInfoFields
                        touched={touched}
                        errors={errors}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </TabContent>
                  </div>
                </Tabs>

                <StickyFooter
                  className="-mx-8 px-8 flex items-center justify-between py-4"
                  stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div>
                    {type === 'update' && (
                      <DeleteCustomerButton onDelete={onDelete as OnDelete} />
                    )}
                  </div>
                  <div className="flex items-center justify-start w-full">
                    <Button
                      size="sm"
                      className="ltr:mr-3 rtl:ml-3"
                      type="button"
                      onClick={() => onDiscard?.()}
                    >
                      Descartar
                    </Button>
                    <Button
                      size="sm"
                      variant="solid"
                      loading={isLoading}
                      icon={<AiOutlineSave />}
                      type="submit"
                    >
                      Guardar
                    </Button>
                  </div>
                </StickyFooter>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
})

CustomerForm.displayName = 'CustomerForm'

export default CustomerForm
