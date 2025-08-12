import { Select as SelectType } from '@/@types/select'
import AdaptableCard from '@/components/shared/AdaptableCard'
import {
  Button,
  FormContainer,
  FormItem,
  Notification,
  Switcher,
  toast,
} from '@/components/ui'
import Select from '@/components/ui/Select'
import {
  useCreateCustomerSearchMutation,
  useGetAllCustomersQuery,
} from '@/services/RtkQueryService'
import { CreateCustomerSearchBody } from '@/services/customer-search/types/customer-search'
import {
  CreateOpportunityBody,
  CreateOpportunityFormModel,
} from '@/services/yokanjeo/types/yokanjeo.type'
import {
  filterBathrooms,
  filterBedrooms,
  filterCurrencyType,
  filterTypeOfOperation,
  filterTypeOfProperty,
} from '@/utils/types/new-property/constants'
import CustomerSearchLocation from './CustomerSearchLocation'

import FormattedNumberInput from '@/views/my-properties/NewProperty/utils/formatted-number-input'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { validationSchema } from './yup/schema'

export type FormModel = CreateOpportunityFormModel

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const CustomerSearchForm = () => {
  const [createCustomerSearch, { isLoading }] =
    useCreateCustomerSearchMutation()
  const [searchParams] = useSearchParams()
  const [currentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize] = useState(pageSizeOption[0].value)
  const [search] = useState(searchParams.get('search') || '')
  const navigate = useNavigate()

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

  const convertToCustomerSearchBody = (
    opportunityBody: CreateOpportunityBody
  ): CreateCustomerSearchBody => {
    const {
      // Extraer propiedades específicas de CreateOpportunityBody
      // y devolver un objeto CreateCustomerSearchBody
      customerId,
      typeOfOperationId,
      typeOfPropertyId,
      currencyId,
      propertyPrice,
      bedrooms,
      bathrooms,
      locatedInCondominium,
      hasSecurity,
      hasParking,
      hasSwimmingPool,
      address,
    } = opportunityBody

    return {
      customerId,
      typeOfOperationId,
      typeOfPropertyId,
      currencyId,
      propertyPrice,
      bedrooms,
      bathrooms,
      locatedInCondominium,
      hasSecurity,
      hasParking,
      hasSwimmingPool,
      address,
    }
  }

  const onSubmit = async (values: FormModel) => {
    const {
      customerId,
      typeOfOperationId,
      typeOfPropertyId,
      currencyId,
      propertyPrice,
      bedrooms,
      bathrooms,
      locatedInCondominium,
      hasSecurity,
      hasParking,
      hasSwimmingPool,
      address: {
        countryId,
        stateId,
        cityId,
        address,
        number,
        letter,
        references,
      },
    } = values
    const { min, max } = propertyPrice

    const opportunityBody: CreateOpportunityBody = {
      customerId,
      typeOfOperationId,
      typeOfPropertyId,
      currencyId,
      propertyPrice: {
        min,
        max,
      },
      bedrooms,
      bathrooms,
      locatedInCondominium,
      hasSecurity,
      hasParking,
      hasSwimmingPool,
      address: {
        countryId,
        stateId,
        cityId,
        address,
        number,
        letter,
        references,
      },
    }

    const customerSearchBody: CreateCustomerSearchBody =
      convertToCustomerSearchBody(opportunityBody)

    try {
      const response = await createCustomerSearch(customerSearchBody)
      if ('data' in response && response.data) {
        openNotification(
          'success',
          '¡Creada!',
          'Oportunidad creada exitosamente',
          3
        )
        setTimeout(() => {
          navigate(`/procanje/buzon-de-clientes`)
        }, 1 * 2000)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        customerId: '',
        typeOfOperationId: '',
        typeOfPropertyId: '',
        currencyId: '',
        propertyPrice: {
          min: '',
          max: '',
        },
        bedrooms: '',
        bathrooms: '',
        locatedInCondominium: false,
        hasSecurity: false,
        hasParking: false,
        hasSwimmingPool: false,
        address: {
          country: '',
          region: '',
          commune: '',
          city: '',
          address: '',
        },
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setValues, setFieldValue }) => {
        return (
          <Form className="w-full lg:w-[70%] xl:w-[60%] mx-auto border p-5 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-600">
            <FormContainer>
              <AdaptableCard divider isLastChild>
                <h5>Información Principal</h5>
                <p className="mb-5">
                  Sección para comparar la información principal de una
                  propiedad.
                </p>

                <FormItem
                  asterisk
                  label="Seleccionar Cliente"
                  invalid={errors.customerId && touched.customerId}
                  errorMessage={errors.customerId}
                >
                  <Field name="customerId">
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
                              String(values.customerId)
                          )}
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
                          placeholder="Seleccionar"
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

                  <FormItem
                    asterisk
                    label="Operación de busqueda de cliente"
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
                    invalid={
                      errors.propertyPrice?.min && touched.propertyPrice?.min
                    }
                    errorMessage={errors.propertyPrice?.min}
                  >
                    <Field name="propertyPrice.min">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <FormattedNumberInput
                            field={field}
                            form={form}
                            currencyId={values?.currencyId}
                            placeholder={
                              values.currencyId === 'UF' ? '1.5' : '1000'
                            }
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Precio hasta:"
                    invalid={
                      errors.propertyPrice?.max && touched.propertyPrice?.max
                    }
                    errorMessage={errors.propertyPrice?.max}
                  >
                    <Field name="propertyPrice.max">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <FormattedNumberInput
                            field={field}
                            form={form}
                            currencyId={values?.currencyId}
                            placeholder={
                              values.currencyId === 'UF' ? '1.5' : '1000'
                            }
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

              {/* backup section CustomSearchMap */}
              {/* <AdaptableCard divider isLastChild>
                <h5>Ubicaciones similares</h5>
                <p className="mb-5">
                  Sección para comparar las ubicaciones de cada inmueble.
                </p>

                <OpportunityMap
                  values={values}
                  setValues={setValues}
                  marker={marker}
                  setMarker={setMarker}
                  initialViewState={initialViewState}
                />
              </AdaptableCard> */}

              <FormItem className="flex items-end">
                <div className="flex gap-2">
                  <Button variant="solid" type="submit" loading={isLoading}>
                    Crear oportunidad
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

export default CustomerSearchForm
