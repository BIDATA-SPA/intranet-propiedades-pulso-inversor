/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { filterFloorLevel } from '@/utils/types/new-property/constants'
import { TSelect } from '@/utils/types/new-property/selects'
import { Field, FieldProps } from 'formik'
import FormattedNumberInput from '../utils/formatted-number-input'

const CommercialPremisesFields = ({ values, errors, touched }) => {
  return (
    <div className="border bg-gray-50/50 p-4 rounded-lg mb-6">
      <div className="mb-3">
        <h6>Información de Local Comercial</h6>
        <p>Completa la información correspondiente al inmueble.</p>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 3xl:grid-cols-4 gap-3">
        <FormItem
          label="Número de oficina"
          invalid={
            errors.characteristics?.officeNumber &&
            touched.characteristics?.officeNumber
          }
          errorMessage={errors.characteristics?.officeNumber}
        >
          <Field name="characteristics.officeNumber">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: #10"
                  value={values.characteristics.officeNumber}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Nivel de ubicación">
          <Field name="characteristics.floorLevelLocation">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterFloorLevel}
                  placeholder="Seleccionar"
                  value={filterFloorLevel?.filter(
                    (option: TSelect) =>
                      option.value === values.characteristics.floorLevelLocation
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
          label="¿Ubicado/a en Galería?"
          className="flex justify-items-center items-center"
        >
          <Field name="characteristics.locatedInGallery">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics.locatedInGallery}
                  className="mt-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.locatedInGallery
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="¿Está Situado frente a la calle?"
          className="flex justify-items-center items-center"
        >
          <Field name="characteristics.locatedFacingTheStreet">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics.locatedFacingTheStreet}
                  className="mt-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.locatedFacingTheStreet
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <FormItem label="Gastos comunes">
        <Field name="characteristics.commonExpenses">
          {({ field, form }: FieldProps) => {
            return (
              <>
                <FormattedNumberInput
                  field={field}
                  form={form}
                  currencyId="CLP"
                  placeholder="Ej: $1.000.000"
                />
              </>
            )
          }}
        </Field>
      </FormItem>

      <Alert showIcon closable type="info" title="Información!">
        Esta opción se habilitará siempre y cuando el tipo de inmueble
        seleccionado sea <strong>{`"Local Comercial"`}</strong>.
      </Alert>
    </div>
  )
}

export default CommercialPremisesFields
