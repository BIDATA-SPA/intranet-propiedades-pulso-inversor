/* eslint-disable @typescript-eslint/no-unused-vars */
import { Select as SelectType } from '@/@types/select'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { Notification, Switcher, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import {
  useGetAllCustomersQuery,
  useUpdateCustomerSearchMutation,
  useUpdateCustomerSearchRefreshMutation,
} from '@/services/RtkQueryService'
import { CreateCustomerSearchFormModel } from '@/services/customer-search/types/customer-search'
import {
  filterBathrooms,
  filterBedrooms,
  filterCurrencyType,
  filterTypeOfOperation,
  filterTypeOfProperty,
} from '@/utils/types/new-property/constants'
import FormattedNumberInput from '@/views/my-properties/NewProperty/utils/formatted-number-input'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CustomerSearchLocation from '../NewCustomerSearch/CustomerSearchLocation'

type FormModel = Partial<CreateCustomerSearchFormModel>

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const FormCustomerSearch = ({
  setIsEditingFields,
  initialValues,
}: {
  isEditingFields: boolean
  setIsEditingFields: any
  initialValues: FormModel
}) => {
  const { customerSearchId } = useParams()
  const [searchParams] = useSearchParams()
  const [currentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize] = useState(pageSizeOption[0].value)
  const [search] = useState(searchParams.get('search') || '')
  const navigate = useNavigate()

  const [
    updateCustomerSearch,
    { isLoading, isSuccess, isError, isUninitialized },
  ] = useUpdateCustomerSearchMutation()

  const [
    updateCustomerSearchRefresh,
    {
      isLoading: isRefreshLoading,
      isSuccess: isRefreshSuccess,
      isError: isRefreshError,
      isUninitialized: isRefreshUninitialized,
    },
  ] = useUpdateCustomerSearchRefreshMutation()

  const { data: filterAllCustomers } = useGetAllCustomersQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search: search }),
      paginated: false,
      transformToSelectOptions: true,
    },
    { refetchOnMountOrArgChange: true }
  )

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
        'Cliente Actualizado',
        'Cliente actualizado correctamente',
        3
      )

      setIsEditingFields(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (
      (!isUninitialized && isError) ||
      (!isRefreshUninitialized && isRefreshError)
    ) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando el cliente, intentalo más tarde',
        3
      )
    }
  }, [isSuccess, isError])

  const onSubmit = async (values: FormModel) => {
    const {
      bathrooms,
      bedrooms,
      currencyId,
      hasParking,
      hasSecurity,
      hasSwimmingPool,
      locatedInCondominium,
      maxPrice,
      minPrice,
      typeOfOperationId,
      typeOfPropertyId,
      customer,
      address: { address, number, letter, countryId, stateId, cityId },
      ...customerSearchData
    } = values

    const newBody = {
      customerId: customer?.id,
      typeOfOperationId,
      typeOfPropertyId,
      currencyId,
      propertyPrice: {
        min: minPrice,
        max: maxPrice,
      },
      bedrooms,
      bathrooms,
      locatedInCondominium: locatedInCondominium,
      hasSecurity,
      hasParking,
      hasSwimmingPool,
      address: { address, countryId, stateId, cityId },
    }

    try {
      await updateCustomerSearch({
        id: customerSearchId,
        ...newBody,
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setFieldValue }) => {
        return (
          <Form className="w-full lg:w-[70%] xl:w-[60%] mx-auto border p-5 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-600">
            <FormContainer>
              <AdaptableCard divider isLastChild>
                <h5>Información Principal</h5>
                <p className="mb-5">
                  Sección para actulizar la información de una oportunidad.
                </p>

                <FormItem
                  asterisk
                  label="Seleccionar Cliente"
                  invalid={errors.customer?.id && touched.customer?.id}
                  errorMessage={errors.customer?.id}
                >
                  <Field name="customer.id">
                    {({ field, form }: FieldProps<FormModel>) => {
                      return (
                        <Select
                          isClearable
                          isSearchable
                          field={field}
                          form={form}
                          options={filterAllCustomers as SelectType[]}
                          value={(filterAllCustomers as SelectType[])?.filter(
                            (category) =>
                              String(category.value) ===
                              String(values.customer?.id)
                          )}
                          placeholder="Seleccionar"
                          noOptionsMessage={() => (
                            <div>
                              No hay clientes creados.{' '}
                              <Link
                                to="/clientes/crear"
                                className="text-sky-500 hover:underline"
                              >
                                Crear cliente
                              </Link>
                            </div>
                          )}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )
                    }}
                  </Field>
                </FormItem>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormItem
                    asterisk
                    label="Tipo de operación"
                    invalid={
                      (errors.typeOfOperationId &&
                        touched.typeOfOperationId) as boolean
                    }
                    errorMessage={errors.typeOfOperationId}
                  >
                    <Field name="typeOfOperationId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          isClearable
                          isSearchable
                          field={field}
                          form={form}
                          options={filterTypeOfOperation}
                          value={filterTypeOfOperation.filter(
                            (category) =>
                              category.value === values.typeOfOperationId
                          )}
                          placeholder="Seleccionar"
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Tipo de propiedad"
                    invalid={
                      (errors.typeOfPropertyId &&
                        touched.typeOfPropertyId) as boolean
                    }
                    errorMessage={errors.typeOfPropertyId}
                  >
                    <Field name="typeOfPropertyId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          isClearable
                          isSearchable
                          field={field}
                          form={form}
                          options={filterTypeOfProperty}
                          value={filterTypeOfProperty.filter(
                            (category) =>
                              category.value === values.typeOfPropertyId
                          )}
                          placeholder="Seleccionar"
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormItem
                    asterisk
                    label="Baño(s)"
                    invalid={(errors.bathrooms && touched.bathrooms) as boolean}
                    errorMessage={errors.bathrooms}
                  >
                    <Field name="bathrooms">
                      {({ field, form }: FieldProps) => (
                        <Select
                          isClearable
                          isSearchable
                          field={field}
                          form={form}
                          options={filterBathrooms}
                          value={filterBathrooms.filter(
                            (category) => category.value === values.bathrooms
                          )}
                          placeholder="Seleccionar"
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Dormitorio(s)"
                    invalid={(errors.bedrooms && touched.bedrooms) as boolean}
                    errorMessage={errors.bedrooms}
                  >
                    <Field name="bedrooms">
                      {({ field, form }: FieldProps) => (
                        <Select
                          isClearable
                          isSearchable
                          field={field}
                          form={form}
                          options={filterBedrooms}
                          value={filterBedrooms.filter(
                            (category) => category.value === values.bedrooms
                          )}
                          placeholder="Seleccionar"
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>
                </div>

                <FormItem
                  asterisk
                  label="Tipo de moneda"
                  invalid={(errors.currencyId && touched.currencyId) as boolean}
                  errorMessage={errors.currencyId}
                >
                  <Field name="currencyId">
                    {({ field, form }: FieldProps) => (
                      <Select
                        isClearable
                        isSearchable
                        field={field}
                        form={form}
                        options={filterCurrencyType}
                        value={filterCurrencyType.filter(
                          (category) => category.value === values.currencyId
                        )}
                        placeholder="Seleccionar"
                        onChange={(option) =>
                          form.setFieldValue(field.name, option?.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormItem
                    asterisk
                    label="Precio desde:"
                    invalid={errors?.minPrice && touched?.minPrice}
                    errorMessage={errors?.minPrice}
                  >
                    <Field name="minPrice">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <FormattedNumberInput
                            field={field}
                            form={form}
                            currencyId={values?.currencyId}
                            placeholder="0"
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Precio hasta:"
                    invalid={errors?.maxPrice && touched?.maxPrice}
                    errorMessage={errors?.maxPrice}
                  >
                    <Field name="maxPrice">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <FormattedNumberInput
                            field={field}
                            form={form}
                            currencyId={values?.currencyId}
                            placeholder="0"
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div>
              </AdaptableCard>

              <AdaptableCard divider isLastChild>
                <h5>Características rápidas de la Propiedad</h5>
                <p className="mb-5">
                  Sección para comparar las características principales de la
                  propiedad.
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-0 md:gap-3 place-content-start md:place-content-center justify-items-start md:justify-items-center text-start md:text-center">
                  <FormItem label="En condominio">
                    <Field name="locatedInCondominium">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.locatedInCondominium}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.locatedInCondominium
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Seguridad">
                    <Field name="hasSecurity">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.hasSecurity}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.hasSecurity
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Estacionamiento">
                    <Field name="hasParking">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.hasParking}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(field.name, !values.hasParking)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Piscina">
                    <Field name="hasSwimmingPool">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.hasSwimmingPool}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.hasSwimmingPool
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div>
              </AdaptableCard>

              <CustomerSearchLocation
                values={values}
                setFieldValue={setFieldValue}
              />

              <FormItem>
                <div className="flex gap-2 justify-end">
                  <Button variant="solid" type="submit" loading={isLoading}>
                    Actualizar
                  </Button>
                </div>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default FormCustomerSearch
