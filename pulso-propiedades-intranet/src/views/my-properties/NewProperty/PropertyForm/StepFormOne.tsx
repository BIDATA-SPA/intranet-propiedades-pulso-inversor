/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import { DatePicker, FormItem, Select } from '@/components/ui'
import {
  useGetAllCustomersQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import {
  filterCurrencyType,
  filterTypeOfOperation,
  filterTypeOfProperty,
} from '@/utils/types/new-property/constants'
import { TSelect } from '@/utils/types/new-property/selects'
import 'dayjs/locale/es'
import { Field, FieldProps } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FormattedNumberInput from '../utils/formatted-number-input'
import { FormModel } from './PropertyForm'
import PlotFields from './components/fields/PlotFields'

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

  const { data: user } = useGetMyInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  const { data: filterAllCustomers } = useGetAllCustomersQuery(
    {
      page: currentPage || 1,
      limit: 999999,
      ...(search && { search: search }),
      paginated: false,
      transformToSelectOptions: true,
    },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search])

  //   const openNotification = (
  //     type: 'success' | 'warning' | 'danger' | 'info',
  //     title: string,
  //     text: string,
  //     duration = 5
  //   ) => {
  //     toast.push(
  //       <Notification title={title} type={type} duration={duration * 1000}>
  //         {text}
  //       </Notification>,
  //       { placement: 'top-center' }
  //     )
  //   }

  /** If the type of operation is "sales" and it matches with the type of "parking" property, both fields will be reset. */
  //   const showNotMatch = useCallback(() => {
  //     const { typeOfOperationId, typeOfPropertyId } = values.step1

  //     if (
  //       typeOfOperationId === filterTypeOfOperation[0].value &&
  //       typeOfPropertyId === filterTypeOfProperty[5].value
  //     ) {
  //       openNotification(
  //         'warning',
  //         'Error',
  //         'El inmueble de estacionamiento no pertenece a un tipo de operación venta.',
  //         4
  //       )
  //       setValues((prevValues) => ({
  //         ...prevValues,
  //         step1: {
  //           ...prevValues.step1,
  //           typeOfOperationId: '',
  //           typeOfPropertyId: '',
  //         },
  //       }))
  //     }
  //   }, [values?.step1?.typeOfOperationId, values?.step1?.typeOfPropertyId])
  //   useEffect(() => {
  //     showNotMatch()
  //   }, [values?.step1, setValues])

  /** Clears inputs of type date as long as they are different from "Temporary lease" */
  const resetDatePicker = useCallback(() => {
    if (values?.step1?.typeOfOperationId !== filterTypeOfOperation[2].value) {
      setValues((prevValues) => ({
        ...prevValues,
        step1: {
          ...prevValues.step1,
          timeAvailable: {
            start: null,
            end: null,
          },
        },
      }))
    }
  }, [values?.step1?.typeOfOperationId, setValues])

  useEffect(() => {
    resetDatePicker()
  }, [values?.step1?.typeOfOperationId])

  return (
    <>
      <FormItem
        asterisk
        label="Seleccionar Cliente"
        invalid={
          (errors?.step1?.customerId && errors?.step1?.customerId) as boolean
        }
        errorMessage={errors?.step1?.customerId}
      >
        <Field name="step1.customerId">
          {({ field, form }: FieldProps) => (
            <Select
              isDisabled={userAuthority === 3}
              noOptionsMessage={() => (
                <Link
                  to="/clientes/crear"
                  className="text-cyan-500 hover:underline"
                >
                  Crear clientes
                </Link>
              )}
              field={field}
              form={form}
              options={filterAllCustomers as SelectType[]}
              value={
                userAuthority === 3
                  ? {
                      value: Number(user?.id),
                      label: `${user?.name} ${user?.lastName}`,
                    }
                  : (filterAllCustomers as SelectType[])?.filter(
                      (customer) => customer.value === values?.step1?.customerId
                    )
              }
              onChange={(option) =>
                form.setFieldValue(field.name, option?.value)
              }
            />
          )}
        </Field>
      </FormItem>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5">
        <FormItem
          asterisk
          label="Tipo de operación"
          invalid={
            (errors?.step1?.typeOfOperationId &&
              errors?.step1?.typeOfOperationId) as boolean
          }
          errorMessage={errors?.step1?.typeOfOperationId}
        >
          <Field name="step1.typeOfOperationId">
            {({ field, form }: FieldProps) => (
              <Select
                field={field}
                form={form}
                options={filterTypeOfOperation as TSelect[]}
                value={filterTypeOfOperation?.filter(
                  (option: TSelect) =>
                    option.value === values?.step1?.typeOfOperationId
                )}
                onChange={(option) =>
                  form.setFieldValue(field.name, option?.value)
                }
              />
            )}
          </Field>
        </FormItem>
        <FormItem
          asterisk
          label="Tipo de inmueble"
          invalid={
            (errors?.step1?.typeOfPropertyId &&
              errors?.step1?.typeOfPropertyId) as boolean
          }
          errorMessage={errors?.step1?.typeOfPropertyId}
        >
          <Field name="step1.typeOfPropertyId">
            {({ field, form }: FieldProps) => (
              <Select
                field={field}
                form={form}
                options={filterTypeOfProperty as TSelect[]}
                value={filterTypeOfProperty?.filter(
                  (option: TSelect) =>
                    option.value === values?.step1?.typeOfPropertyId
                )}
                onChange={(option) => {
                  if (option.value !== 'Parcela') {
                    form.setFieldValue('step2.characteristics.hasHouse', false)
                  }
                  if (option.value !== 'Oficina') {
                    form.setFieldValue(
                      'step2.characteristics.numberOfPrivate',
                      ''
                    )
                    form.setFieldValue(
                      'step2.characteristics.numberOfVacantFloors',
                      ''
                    )
                    form.setFieldValue(
                      'step2.characteristics.numberOfMeetingRooms',
                      ''
                    )
                    form.setFieldValue(
                      'step2.characteristics.hasKitchenet',
                      false
                    )
                  }
                  if (option.value !== 'Local Comercial') {
                    form.setFieldValue('step2.characteristics.officeNumber', '')
                    form.setFieldValue(
                      'step2.characteristics.floorLevelLocation',
                      ''
                    )
                    form.setFieldValue(
                      'step2.characteristics.locatedInGallery',
                      false
                    )
                    form.setFieldValue(
                      'step2.characteristics.locatedFacingTheStreet',
                      false
                    )
                    form.setFieldValue(
                      'step2.characteristics.commonExpenses',
                      ''
                    )
                  }
                  form.setFieldValue(field.name, option?.value)
                }}
              />
            )}
          </Field>
        </FormItem>
      </div>

      {values?.step1?.typeOfPropertyId === 'Parcela' && (
        <PlotFields values={values} />
      )}

      {values?.step1?.typeOfOperationId?.includes(
        filterTypeOfOperation[2].value
      ) && (
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem
            label="Desde"
            invalid={
              errors?.step1?.timeAvailable?.start &&
              touched?.step1?.timeAvailable?.start
            }
            errorMessage={errors?.step1?.timeAvailable?.start}
          >
            <Field name="step1.timeAvailable.start">
              {({ field, form }: FieldProps<FormModel>) => (
                <DatePicker
                  locale="es"
                  placeholder="Selecciona una fecha de inicio"
                  field={field}
                  form={form}
                  value={values?.step1?.timeAvailable?.start}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date)
                  }}
                />
              )}
            </Field>
          </FormItem>
          <FormItem
            label="Hasta"
            invalid={
              errors?.step1?.timeAvailable?.end &&
              touched?.step1?.timeAvailable?.end
            }
            errorMessage={errors?.step1?.timeAvailable?.end}
          >
            <Field name="step1.timeAvailable.end">
              {({ field, form }: FieldProps<FormModel>) => (
                <DatePicker
                  locale="es"
                  placeholder="Selecciona una fecha de fin"
                  field={field}
                  form={form}
                  value={values?.step1?.timeAvailable?.end}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date)
                  }}
                />
              )}
            </Field>
          </FormItem>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5">
        <FormItem
          asterisk
          label="Moneda"
          invalid={
            (errors?.step1?.currencyId && errors?.step1?.currencyId) as boolean
          }
          errorMessage={errors?.step1?.currencyId}
        >
          <Field name="step1.currencyId">
            {({ field, form }: FieldProps) => (
              <Select
                field={field}
                form={form}
                options={filterCurrencyType as TSelect[]}
                value={filterCurrencyType?.filter(
                  (option: TSelect) =>
                    option.value === values?.step1?.currencyId
                )}
                onChange={(option) =>
                  form.setFieldValue(field.name, option?.value)
                }
              />
            )}
          </Field>
        </FormItem>

        <div className="flex items-center w-full gap-4">
          <div className="w-[100%]">
            <FormItem
              asterisk
              label={
                values.step1.currencyId === 'M2'
                  ? 'Precio en M2'
                  : values.step1.currencyId === 'UF'
                  ? 'Precio en UF'
                  : values.step1.currencyId === 'CLP'
                  ? 'Precio en CLP'
                  : 'Precio'
              }
              invalid={
                errors?.step1?.propertyPrice && touched.step1?.propertyPrice
              }
              errorMessage={errors.step1?.propertyPrice}
            >
              <Field name="step1.propertyPrice">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <>
                      <FormattedNumberInput
                        field={field}
                        form={form}
                        currencyId={values?.step1?.currencyId}
                      />
                    </>
                  )
                }}
              </Field>
            </FormItem>
          </div>

          {/* ⚠️ */}
          {/* <div className="w-[50%]">
            <FormItem label="Superficie">
              <Field name="step2.characteristics.surfaceUnit">
                {({ field, form }: FieldProps) => (
                  <Select
                    isClearable
                    field={field}
                    form={form}
                    options={surfaceUnit as TSelect[]}
                    value={surfaceUnit?.filter(
                      (option: TSelect) =>
                        option.value ===
                        values?.step2?.characteristics?.surfaceUnit
                    )}
                    placeholder="Seleccionar..."
                    onChange={(option) =>
                      form.setFieldValue(field.name, option?.value)
                    }
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
