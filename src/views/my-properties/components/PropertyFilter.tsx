import { Select } from '@/components/ui'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Drawer from '@/components/ui/Drawer'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import type { MouseEvent } from 'react'
import { forwardRef, useRef, useState } from 'react'
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi'
import { IoFilter } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../store'
import { setFilters } from '../store/propertyListSlice'

type FormModel = {
  search?: string
  inExchange?: boolean
  sold?: boolean
  deRegistered?: boolean
  disabled?: boolean
  favorites?: boolean
  orderById?: 'asc' | 'desc'
  orderByPrice?: 'CLP' | 'UF' | ''
  currencyId?: ''
}

type FilterFormProps = {
  onSubmitComplete?: () => void
}

type DrawerFooterProps = {
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
  ({ onSubmitComplete }, ref) => {
    const dispatch = useAppDispatch()
    const filterData = useAppSelector(
      (state) => state.propertiesList?.data.filters
    )

    const handleCheckboxChange = (name: keyof FormModel, value: boolean) => {
      dispatch(setFilters({ [name]: value }))
    }

    const handleInputChange = (name: string, value: string) => {
      dispatch(setFilters({ [name]: value }))
    }

    const handleSubmit = (values: FormModel) => {
      onSubmitComplete?.()
      dispatch(setFilters(values))
    }

    return (
      <Formik
        enableReinitialize
        innerRef={ref}
        initialValues={filterData}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        {({ values }) => {
          const handleResetFields = () => {
            dispatch(
              setFilters({
                search: '',
                inExchange: false,
                sold: false,
                deRegistered: false,
                disabled: false,
                favorites: false,
                orderById: 'asc',
                orderByPrice: '',
                currencyId: '',
              })
            )
          }

          return (
            <Form>
              <FormContainer>
                <div className="text-right">
                  <Button
                    size="sm"
                    variant="solid"
                    icon={<IoFilter />}
                    onClick={() => handleResetFields()}
                  >
                    Limpiar
                  </Button>
                </div>
                <FormItem>
                  <h6 className="mb-4">Buscar</h6>
                  <Field
                    type="text"
                    autoComplete="off"
                    name="filters.search"
                    value={values.search}
                    placeholder="Propiedad o Tipo de propiedad, ej: Casa, Departamento, Bodega..."
                    component={Input}
                    prefix={<HiOutlineSearch className="text-lg" />}
                    onChange={(e) =>
                      handleInputChange('search', e.target.value)
                    }
                  />
                </FormItem>

                <div className="w-full flex items-center gap-4">
                  <div className="w-[50%]">
                    <Field name="orderById">
                      {({ field }: FieldProps<FormModel>) => {
                        const options = [
                          { value: 'asc', label: 'Ascendente' },
                          { value: 'desc', label: 'Descendente' },
                        ]

                        const selectedOption = options.find(
                          (option) => option.value === field.value
                        )

                        return (
                          <FormItem label="Ordenar">
                            <Select
                              field={field}
                              options={options}
                              placeholder="Seleccionar"
                              value={selectedOption}
                              onChange={(option: any) => {
                                handleInputChange('orderById', option.value)
                              }}
                            />
                          </FormItem>
                        )
                      }}
                    </Field>
                  </div>

                  <div className="w-[50%]">
                    <Field name="currencyId">
                      {({ field }: FieldProps<FormModel>) => {
                        const options = [
                          { value: '', label: 'Sin moneda' },
                          { value: 'CLP', label: 'CLP' },
                          { value: 'UF', label: 'UF' },
                        ]

                        const selectedOption = options.find(
                          (option) => option.value === field.value
                        )

                        return (
                          <FormItem label="Moneda">
                            <Select
                              field={field}
                              options={options}
                              placeholder="Seleccionar moneda"
                              value={selectedOption}
                              onChange={(option: any) => {
                                handleInputChange('currencyId', option.value)
                              }}
                            />
                          </FormItem>
                        )
                      }}
                    </Field>
                  </div>
                </div>

                <FormItem>
                  <h6 className="mb-4">Filtrar</h6>
                  <div className="w-full flex flex-col gap-5">
                    <Field name="filters.inExchange">
                      {() => (
                        <Checkbox
                          name="inExchange"
                          checked={values.inExchange}
                          onChange={(e) => {
                            handleCheckboxChange('inExchange', e)
                          }}
                        >
                          En canje
                        </Checkbox>
                      )}
                    </Field>
                    <Field name="sold">
                      {() => (
                        <Checkbox
                          name="sold"
                          checked={values.sold}
                          onChange={(e) => {
                            handleCheckboxChange('sold', e)
                          }}
                        >
                          Vendida
                        </Checkbox>
                      )}
                    </Field>
                    <Field name="deRegistered">
                      {() => (
                        <Checkbox
                          name="deRegistered"
                          checked={values.deRegistered}
                          onChange={(e) => {
                            handleCheckboxChange('deRegistered', e)
                          }}
                        >
                          Dada de baja
                        </Checkbox>
                      )}
                    </Field>
                    <Field name="disabled">
                      {() => (
                        <Checkbox
                          name="disabled"
                          checked={values.disabled}
                          onChange={(e) => {
                            handleCheckboxChange('disabled', e)
                          }}
                        >
                          Deshabilitada
                        </Checkbox>
                      )}
                    </Field>
                    <Field name="favorites">
                      {() => (
                        <Checkbox
                          name="favorites"
                          checked={values.favorites}
                          onChange={(e) => {
                            handleCheckboxChange('favorites', e)
                          }}
                        >
                          Destacadas
                        </Checkbox>
                      )}
                    </Field>
                  </div>
                </FormItem>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    )
  }
)

const DrawerFooter = ({ onCancel }: DrawerFooterProps) => {
  return (
    <div className="text-right w-full">
      <Button size="sm" onClick={onCancel}>
        Cerrar
      </Button>
    </div>
  )
}

const PropertyFilter = () => {
  const formikRef = useRef<FormikProps<FormModel>>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => {
    setIsOpen(true)
  }

  const onDrawerClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        size="sm"
        className="block md:inline-block ltr:md:ml-2 rtl:md:mr-2 md:mb-0 mb-4"
        icon={<HiOutlineFilter />}
        onClick={openDrawer}
      >
        Filtrar
      </Button>
      <Drawer
        title="Filter"
        isOpen={isOpen}
        footer={<DrawerFooter onCancel={onDrawerClose} />}
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
      </Drawer>
    </>
  )
}

FilterForm.displayName = 'FilterForm'

export default PropertyFilter
