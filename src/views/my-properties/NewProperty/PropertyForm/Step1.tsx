/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import {
  Button,
  FormItem,
  Input,
  Notification,
  Select,
  Switcher,
  toast,
} from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import {
  useGetAllCustomersQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import {
  filterCurrencyType,
  filterTypeOfOperation,
  filterTypeOfProperty,
} from '@/utils/types/new-property/constants'
import { TSelect } from '@/utils/types/new-property/selects'
import { Field, FieldProps } from 'formik'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormModel } from './PropertyForm'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

export default function Step1({ values, setValues, errors, touched }) {
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
    const { typeOfOperationId, typeOfPropertyId } = values.step1

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
        step1: {
          ...prevValues.step1,
          typeOfOperationId: '',
          typeOfPropertyId: '',
        },
      }))
    }
  }, [values.step1.typeOfOperationId, values.step1.typeOfPropertyId])

  /** Clears inputs of type date as long as they are different from "Temporary lease" */
  const resetDatePicker = useCallback(() => {
    const { typeOfOperationId } = values.step1

    if (typeOfOperationId !== filterTypeOfOperation[2].value) {
      setValues((prevValues) => ({
        ...prevValues,
        step1: {
          ...prevValues.step1,
          timeAvailable: {
            ...prevValues.step1?.timeAvailable,
            start: null,
            end: null,
          },
        },
      }))
    }
  }, [values.step1.typeOfOperationId, setValues])

  /** If the property does not remain in exchange status, reset with exchange date fields. */
  const resetDatePickerInExchange = useCallback(() => {
    const { timeInExchange } = values.step1

    if (!timeInExchange.start && !timeInExchange.end) {
      setValues((prevValues) => ({
        ...prevValues,
        step1: {
          ...values.step1,
          isExchanged: false,
        },
      }))
    }
  }, [values.step1.timeInExchange.start, values.step1.timeInExchange.end])

  /** Hide date picker if isnt in exchange */
  const hiddeExchangeDatePicker = useCallback(() => {
    const { isExchanged } = values.step1

    if (isExchanged === false) {
      setValues({
        ...values,
        step1: {
          ...values.step1,
          timeInExchange: {
            ...values.step1?.timeInExchange,
            start: null,
            end: null,
          },
        },
      })
    }
  }, [values.step1?.isExchanged])

  useEffect(() => {
    showNotMatch()
  }, [values, setValues])

  useEffect(() => {
    resetDatePicker()
  }, [values.step1?.typeOfOperationId])

  useEffect(() => {
    resetDatePickerInExchange()
  }, [values.step1?.timeInExchange.start, values.step1?.timeInExchange.end])

  useEffect(() => {
    hiddeExchangeDatePicker()
  }, [values.step1?.isExchanged])

  return (
    <>
      <FormItem>
        <div className="flex justify-end gap-2">
          <Button variant="solid" type="submit" loading={false}>
            Guardar
          </Button>
        </div>
      </FormItem>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5">
        <FormItem
          asterisk
          label="Corredor/a"
          invalid={errors.step1?.userId && touched.step1?.userId}
          errorMessage={errors.step1?.userId}
        >
          <Field
            disabled
            autoComplete="on"
            name="step1.userId"
            placeholder="Nombre del Corredor/a"
            component={Input}
            type="text"
            value={values.step1.username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValues({
                ...values,
                step1: {
                  ...values.step1,
                  userId: e,
                },
              })
            }
          />
        </FormItem>

        <FormItem
          asterisk
          label="Cliente"
          invalid={errors.step1?.customerId && touched.step1?.customerId}
          errorMessage={errors.step1?.customerId}
        >
          <Field name="step1.customerId">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterCustomers}
                  placeholder="Seleccionar"
                  value={filterCustomers?.filter(
                    (option: TSelect) =>
                      option.value === values.step1?.customerId
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
      <FormItem
        asterisk
        label="Tipo de operación"
        invalid={
          errors.step1?.typeOfOperationId && touched.step1?.typeOfOperationId
        }
        errorMessage={errors.step1?.typeOfOperationId}
      >
        <Field name="step1.typeOfOperationId">
          {({ field, form }: FieldProps<FormModel>) => {
            return (
              <Select
                isClearable
                field={field}
                options={filterTypeOfOperation}
                placeholder="Seleccionar"
                value={filterTypeOfOperation?.filter(
                  (option: TSelect) =>
                    option.value === values.step1?.typeOfOperationId
                )}
                onChange={(option: TSelect) => {
                  form.setFieldValue(field.name, option?.value)
                }}
              />
            )
          }}
        </Field>
      </FormItem>
      {values.step1?.typeOfOperationId?.includes(
        filterTypeOfOperation[2].value
      ) && (
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem
            label="Desde"
            invalid={
              errors.step1?.timeAvailable?.start &&
              touched.step1?.timeAvailable?.start
            }
            errorMessage={errors.step1?.timeAvailable?.start}
          >
            <Field name="step1.timeAvailable.start">
              {({ field, form }: FieldProps<FormModel>) => (
                <DatePicker
                  placeholder="Selecciona una fecha de inicio"
                  field={field}
                  form={form}
                  value={values.step1?.timeAvailable?.start}
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
              errors.step1?.timeAvailable?.end &&
              touched.step1?.timeAvailable?.end
            }
            errorMessage={errors.step1?.timeAvailable?.end}
          >
            <Field name="step1.timeAvailable.end">
              {({ field, form }: FieldProps<FormModel>) => (
                <DatePicker
                  placeholder="Selecciona una fecha de inicio"
                  field={field}
                  form={form}
                  value={values.step1?.timeAvailable?.end}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date)
                  }}
                />
              )}
            </Field>
          </FormItem>
        </div>
      )}
      <FormItem
        asterisk
        label="Tipo de inmueble"
        invalid={
          errors.step1?.typeOfPropertyId && touched.step1?.typeOfPropertyId
        }
        errorMessage={errors.step1?.typeOfPropertyId}
      >
        <Field name="step1.typeOfPropertyId">
          {({ field, form }: FieldProps<FormModel>) => {
            return (
              <Select
                isClearable
                field={field}
                options={filterTypeOfProperty}
                placeholder="Seleccionar"
                value={filterTypeOfProperty?.filter(
                  (option: TSelect) =>
                    option.value === values.step1?.typeOfPropertyId
                )}
                onChange={(option: TSelect) => {
                  form.setFieldValue(field.name, option?.value)
                }}
              />
            )
          }}
        </Field>
      </FormItem>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5">
        <FormItem
          asterisk
          label="Tipo de moneda"
          invalid={errors.step1?.currencyId && touched.step1?.currencyId}
          errorMessage={errors.step1?.currencyId}
        >
          <Field name="step1.currencyId">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterCurrencyType}
                  placeholder="Seleccionar"
                  value={filterCurrencyType?.filter(
                    (option: TSelect) =>
                      option.value === values.step1?.currencyId
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          asterisk
          label="Precio"
          invalid={errors.step1?.propertyPrice && touched.step1?.propertyPrice}
          errorMessage={errors.step1?.propertyPrice}
        >
          <Field name="step1.propertyPrice">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  size="md"
                  className="mb-2"
                  placeholder={
                    values.step1.currencyId === 'UF' ? '1.5' : '1.000'
                  }
                  value={values.step1.propertyPrice}
                  type="number"
                  onChange={(e) => {
                    form.setFieldValue(e.target.name, Number(e.target.value))
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <FormItem label="Propiedad en Canje">
        <Field name="step1.isExchanged">
          {({ field, form }: FieldProps<FormModel>) => {
            return (
              <Switcher
                checked={values.step1.isExchanged}
                onChange={() => {
                  form.setFieldValue(field.name, !values.step1.isExchanged)
                }}
              />
            )
          }}
        </Field>
      </FormItem>

      {values.step1?.isExchanged && (
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem
            asterisk
            label="Desde"
            invalid={
              errors.step1?.timeInExchange?.start &&
              touched.step1?.timeInExchange?.start
            }
            errorMessage={errors.step1?.timeInExchange?.start}
          >
            <Field name="step1.timeInExchange.start">
              {({ field, form }: FieldProps<FormModel>) => (
                <DatePicker
                  placeholder="Selecciona una fecha de inicio"
                  field={field}
                  form={form}
                  value={values.step1?.timeInExchange?.start}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date)
                  }}
                />
              )}
            </Field>
          </FormItem>

          <FormItem
            asterisk
            label="Hasta"
            invalid={
              errors.step1?.timeInExchange?.end &&
              touched.step1?.timeInExchange?.end
            }
            errorMessage={errors.step1?.timeInExchange?.end}
          >
            <Field name="step1.timeInExchange.end">
              {({ field, form }: FieldProps<FormModel>) => (
                <DatePicker
                  placeholder="Selecciona una fecha de inicio"
                  field={field}
                  form={form}
                  value={values.step1?.timeInExchange?.end}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date)
                  }}
                />
              )}
            </Field>
          </FormItem>
        </div>
      )}
    </>
  )
}
