/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import { FormItem, Input, Notification, Select, toast } from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import {
  useGetAllCustomersQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import { CreatePropertyFormModel } from '@/services/properties/types/property.type'
import {
  filterCurrencyType,
  filterTypeOfOperation,
  filterTypeOfProperty,
} from '@/utils/types/new-property/constants'
import { TSelect } from '@/utils/types/new-property/selects'
import 'dayjs/locale/es'
import { Field, FieldProps } from 'formik'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FormattedNumberInput from '../NewProperty/utils/formatted-number-input'
import PlotFields from './components/fields/PlotFields'

export type FormModel = CreatePropertyFormModel

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const StepFormOne = ({ values, errors, touched, setValues }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [pageSize] = useState(pageSizeOption[0].value)
  const [currentPage] = useState(+searchParams.get('page') || 1)
  const [search] = useState(searchParams.get('search') || '')
  const { data } = useGetMyInfoQuery({}, { refetchOnMountOrArgChange: true })
  const { data: customers } = useGetAllCustomersQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search: search }),
    },
    { refetchOnMountOrArgChange: true }
  )

  const customersList =
    customers?.data?.map((customer) => ({
      value: customer?.id,
      label: `${customer?.name} ${customer?.lastName}`,
    })) || []

  // Creating a copy and reversing the order
  const reversedCustomersList = [...customersList]

  // Normalized customers select
  const filterCustomers = [
    ...reversedCustomersList,
    { value: data?.id, label: `${data?.name} ${data?.lastName}` },
  ]

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search])

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

  /** If the type of operation is "sales" and it matches with the type of "parking" property, both fields will be reset. */
  const showNotMatch = useCallback(() => {
    const { typeOfOperationId, typeOfPropertyId } = values

    if (
      typeOfOperationId === filterTypeOfOperation[0].value &&
      typeOfPropertyId === filterTypeOfProperty[5].value
    ) {
      openNotification(
        'warning',
        'Error',
        'El inmueble de estacionamiento no pertenece a un tipo de operación venta.',
        4
      )
      setValues((prevValues) => ({
        ...prevValues,
        typeOfOperationId: '',
        typeOfPropertyId: '',
      }))
    }
  }, [values.typeOfOperationId, values.typeOfPropertyId])

  // ⚠️
  /** Clears inputs of type date as long as they are different from "Temporary lease" */
  const resetDatePicker = useCallback(() => {
    if (values.typeOfOperationId !== filterTypeOfOperation[2].value) {
      // ✅
      setValues((prevValues) => ({
        ...prevValues,
        timeAvailable: {
          ...prevValues.timeAvailable,
          start: null,
          end: null,
        },
      }))
    }
  }, [values.typeOfOperationId, setValues])

  useEffect(() => {
    showNotMatch()
  }, [values, setValues])

  useEffect(() => {
    resetDatePicker()
  }, [values.typeOfOperationId])

  return (
    <>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5 mt-4">
        <FormItem
          asterisk
          label="Corredor/a"
          invalid={errors.userId && touched.userId}
          errorMessage={errors.userId}
        >
          <Field
            disabled
            autoComplete="on"
            name="userId"
            placeholder="Nombre del Corredor/a"
            component={Input}
            type="text"
            value={`${!values?.user?.name ? '' : values?.user?.name} ${
              !values?.user?.lastName ? '' : values?.user?.lastName
            }`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValues({
                ...values,
                user: {
                  ...values.user,
                  name: e.target.value,
                },
              })
            }
          />
        </FormItem>

        <FormItem
          asterisk
          label="Cliente"
          invalid={errors.customerId && touched.customerId}
          errorMessage={errors.customerId}
        >
          <Field name="customerId">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  isDisabled={true}
                  field={field}
                  options={filterCustomers}
                  placeholder="Seleccionar"
                  value={filterCustomers?.filter(
                    (option: TSelect) => option.value === values?.customer?.id
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <FormItem
            asterisk
            label="Tipo de operación"
            invalid={errors.typeOfOperationId && touched.typeOfOperationId}
            errorMessage={errors.typeOfOperationId}
          >
            <Field name="typeOfOperationId">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Select
                    isDisabled
                    isClearable
                    field={field}
                    options={filterTypeOfOperation}
                    placeholder="Seleccionar"
                    value={filterTypeOfOperation?.filter(
                      (option: TSelect) =>
                        option.value === values?.typeOfOperationId
                    )}
                    onChange={(option: TSelect) => {
                      form.setFieldValue(field.name, option?.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>
          {values.typeOfOperationId?.includes(
            filterTypeOfOperation[2].value
          ) && (
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
              <FormItem
                asterisk
                label="Desde"
                invalid={
                  errors.timeAvailable?.start && touched.timeAvailable?.start
                }
                errorMessage={errors.timeAvailable?.start}
              >
                <Field name="timeAvailable.start">
                  {({ field, form }: FieldProps<FormModel>) => {
                    const convertUTCDateToLocalDate = (date) => {
                      const newDate = new Date(
                        date.getTime() + date.getTimezoneOffset() * 60 * 1000
                      )
                      return newDate
                    }

                    // Convert the start date to a Date object, adjusting the time zone
                    const timeAvailableStartDate = values.timeAvailable?.start
                      ? convertUTCDateToLocalDate(
                          new Date(values.timeAvailable?.start)
                        )
                      : null

                    return (
                      <DatePicker
                        locale="es"
                        placeholder="Selecciona una fecha de inicio"
                        defaultValue={timeAvailableStartDate}
                        onChange={(date) => {
                          form.setFieldValue(
                            field.name,
                            date ? date.toISOString() : null
                          )
                        }}
                      />
                    )
                  }}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Hasta"
                invalid={
                  errors.timeAvailable?.end && touched.timeAvailable?.end
                }
                errorMessage={errors.timeAvailable?.end}
              >
                <Field name="timeAvailable.end">
                  {({ field, form }: FieldProps<FormModel>) => {
                    const convertUTCDateToLocalDate = (date) => {
                      const newDate = new Date(
                        date.getTime() + date.getTimezoneOffset() * 60 * 1000
                      )
                      return newDate
                    }

                    // Convert the start date to a Date object, adjusting the time zone
                    const timeAvailableEndDate = values.timeAvailable?.end
                      ? convertUTCDateToLocalDate(
                          new Date(values.timeAvailable?.end)
                        )
                      : null

                    return (
                      <DatePicker
                        locale="es"
                        placeholder="Selecciona una fecha de inicio"
                        defaultValue={timeAvailableEndDate}
                        onChange={(date) => {
                          form.setFieldValue(
                            field.name,
                            date ? date.toISOString() : null
                          )
                        }}
                      />
                    )
                  }}
                </Field>
              </FormItem>
            </div>
          )}
        </div>

        <div>
          <FormItem
            asterisk
            label="Tipo de inmueble"
            invalid={errors.typeOfPropertyId && touched.typeOfPropertyId}
            errorMessage={errors.typeOfPropertyId}
          >
            <Field name="typeOfPropertyId">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Select
                    isDisabled
                    isClearable
                    field={field}
                    options={filterTypeOfProperty}
                    placeholder="Seleccionar"
                    value={filterTypeOfProperty?.filter(
                      (option: TSelect) =>
                        option.value === values.typeOfPropertyId
                    )}
                    onChange={(option: TSelect) => {
                      if (option.value !== 'Parcela') {
                        form.setFieldValue('characteristics.hasHouse', false)
                      }
                      if (option.value !== 'Oficina') {
                        form.setFieldValue(
                          'characteristics.numberOfPrivate',
                          ''
                        )
                        form.setFieldValue(
                          'characteristics.numberOfVacantFloors',
                          ''
                        )
                        form.setFieldValue(
                          'characteristics.numberOfMeetingRooms',
                          ''
                        )
                        form.setFieldValue(
                          'characteristics.hasKitchenet',
                          false
                        )
                      }
                      if (option.value !== 'Local Comercial') {
                        form.setFieldValue('characteristics.officeNumber', '')
                        form.setFieldValue(
                          'characteristics.floorLevelLocation',
                          ''
                        )
                        form.setFieldValue(
                          'characteristics.locatedInGallery',
                          false
                        )
                        form.setFieldValue(
                          'characteristics.locatedFacingTheStreet',
                          false
                        )
                        form.setFieldValue('characteristics.commonExpenses', '')
                      }

                      form.setFieldValue(field.name, option?.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>
        </div>
      </div>

      {values?.typeOfPropertyId === 'Parcela' && <PlotFields values={values} />}

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5">
        <FormItem
          asterisk
          label="Tipo de moneda"
          invalid={errors.currencyId && touched.currencyId}
          errorMessage={errors.currencyId}
        >
          <Field name="currencyId">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterCurrencyType}
                  placeholder="Seleccionar"
                  value={filterCurrencyType?.filter(
                    (option: TSelect) => option.value === values.currencyId
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <div className="flex items-center w-full gap-4">
          <div className="w-[90%]">
            <FormItem
              asterisk
              label="Precio"
              invalid={errors.propertyPrice && touched.propertyPrice}
              errorMessage={errors.propertyPrice}
            >
              <Field name="propertyPrice">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <FormattedNumberInput
                      field={field}
                      form={form}
                      currencyId={values.currencyId}
                      placeholder={values.currencyId === 'UF' ? '1.5' : '1000'}
                    />
                  )
                }}
              </Field>
            </FormItem>
          </div>

          {/* <div className="w-[50%]">
            <FormItem label="Superficie">
              <Field name="characteristics.surfaceUnit">
                {({ field, form }: FieldProps) => (
                  <Select
                    isClearable
                    field={field}
                    options={surfaceUnit}
                    placeholder="Seleccionar"
                    value={surfaceUnit?.filter(
                      (option: TSelect) =>
                        option.value === values?.characteristics.surfaceUnit
                    )}
                    onChange={(option: TSelect) => {
                      form.setFieldValue(field.name, option?.value)
                    }}
                  />
                )}
              </Field>
            </FormItem>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default StepFormOne
