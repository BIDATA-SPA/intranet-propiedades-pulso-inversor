import { Select as SelectType } from '@/@types/select'
import {
  Button,
  Dialog,
  FormContainer,
  FormItem,
  Input,
  Notification,
  toast,
} from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

import {
  useGetAllCustomersQuery,
  useGetAllPropertiesQuery,
  usePatchVisitOrderMutation,
} from '@/services/RtkQueryService'
import { format } from 'date-fns'
import CustomSelect from './CustomSelectVisOrd'

const validationSchema = Yup.object().shape({
  title: Yup.string().required('El título es requerido.'),
  date: Yup.date().required('La Fecha es requerida.'),
})

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const EditVisitOrderDialog = ({
  openDialogVisOrd,
  closeDialogsVisOrd,
  eventData,
}) => {
  const [searchParams] = useSearchParams()
  const [pageSize] = useState(pageSizeOption[0].value)
  const [currentPage] = useState(+searchParams.get('page') || 1)
  const [search] = useState(searchParams.get('search') || '')

  const [patchVisitOrder, { isLoading: patchVisitOrderLoading }] =
    usePatchVisitOrderMutation()
  const { data: filterCustomers } = useGetAllCustomersQuery(
    {
      page: currentPage,
      limit: pageSize,
      ...(search && { search }),
      paginated: false,
      transformToSelectOptions: true,
    },
    { refetchOnMountOrArgChange: true }
  )

  const { data: filterProperties } = useGetAllPropertiesQuery({
    page: currentPage,
    limit: pageSize,
  })

  useEffect(() => {
    if (filterCustomers?.error || filterProperties?.error) {
      toast.push(
        <Notification type="danger" title="Error" duration={5000}>
          Error al cargar clientes o propiedades
        </Notification>
      )
    }
  }, [filterCustomers, filterProperties])

  const customerOptions =
    filterCustomers?.map((customer) => ({
      value: customer.value,
      label: customer.label,
    })) || []

  const propertyOptions =
    filterProperties?.data?.map((property) => ({
      value: property.id,
      label: property.propertyTitle,
    })) || []

  const defaultCustomerSelect = eventData?.customer
    ? {
        value: eventData.customer.id,
        label: `${eventData.customer.name} ${eventData.customer.lastName}`,
      }
    : null

  const defaultPropertySelect = eventData?.property
    ? {
        value: eventData.property.id,
        label: eventData.property.propertyTitle,
      }
    : null

  const formatDateForInput = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm")
  }

  const handleSubmit = async (values) => {
    const data = {
      title: values.title,
      description: values.description,
      color: values.color || '',
      date: new Date(values.date).toISOString(),
      customerId: Number(values.customerId),
      alias: values.alias || '',
      propertyId: Number(values.propertyId),
    }
    try {
      await patchVisitOrder({ id: eventData.id, ...data }).unwrap()
      toast.push(
        <Notification type="success" title="Éxito" duration={5000}>
          Orden de visita actualizada correctamente
        </Notification>
      )
      closeDialogsVisOrd()
    } catch (error) {
      toast.push(
        <Notification type="danger" title="Error" duration={5000}>
          Error al actualizar la orden de visita
        </Notification>
      )
    }
  }

  return (
    <Dialog isOpen={openDialogVisOrd} width={600} onClose={closeDialogsVisOrd}>
      <h2 className="text-2xl mb-1">Editar Orden de Visita</h2>
      <p className="text-md font-semibold mb-3">
        Fecha de orden: {format(new Date(eventData.date), 'dd-MM-yyyy HH:mm')}{' '}
        hrs
      </p>
      <Formik
        enableReinitialize
        initialValues={{
          ...eventData,
          date: formatDateForInput(eventData.date),
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <FormContainer className="overflow-y-auto h-80 px-2">
              <FormItem label="Fecha">
                <Field name="date">
                  {({ field }) => (
                    <Input
                      {...field}
                      type="datetime-local"
                      className="border p-2 px-3 w-full rounded-md"
                      onChange={(e) => setFieldValue('date', e.target.value)}
                    />
                  )}
                </Field>
                {errors.date && touched.date && <div>{errors.date}</div>}
              </FormItem>

              <FormItem
                asterisk
                label="Titulo"
                invalid={errors.title && touched.title}
                errorMessage={errors.title}
              >
                <Field name="title">
                  {({ field }) => (
                    <Input
                      {...field}
                      required
                      placeholder="Agregar título"
                      className="border p-2 w-full"
                    />
                  )}
                </Field>
              </FormItem>

              <div className="grid grid-cols-2 gap-4">
                <FormItem label="Cliente">
                  <CustomSelect
                    options={customerOptions}
                    defaultValue={defaultCustomerSelect}
                    onChange={(option) =>
                      setFieldValue('customerId', option.value)
                    }
                  />
                </FormItem>
                <FormItem label="Cliente alias">
                  <Field name="alias">
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="Actualizar alias"
                        className="border p-2 w-full"
                      />
                    )}
                  </Field>
                </FormItem>
              </div>

              <FormItem label="Inmueble">
                <CustomSelect
                  options={propertyOptions}
                  defaultValue={defaultPropertySelect}
                  onChange={(option) =>
                    setFieldValue('propertyId', option.value)
                  }
                />
              </FormItem>

              <FormItem
                asterisk
                label="Descripción / Recordatorio"
                invalid={errors.description && touched.description}
                errorMessage={errors.description}
              >
                <Field name="description">
                  {({ field }) => (
                    <Input
                      {...field}
                      textArea
                      placeholder="Agrega un recordatorio"
                      className="border p-2 w-full"
                    />
                  )}
                </Field>
              </FormItem>
            </FormContainer>
            <div className="flex justify-between gap-3 mt-4">
              <Button
                type="button"
                className="w-full"
                color="gray-300"
                onClick={closeDialogsVisOrd}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid"
                loading={patchVisitOrderLoading}
                className="bg-sky-500 text-white w-full"
              >
                Guardar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default EditVisitOrderDialog
