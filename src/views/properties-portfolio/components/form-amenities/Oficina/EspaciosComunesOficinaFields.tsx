/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import Switcher from '@/components/ui/Switcher'

import { injectReducer } from '@/store'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const EspaciosComunesFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Recepción">
          <Field name="characteristics.hasReceptionArea">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasReceptionArea}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasReceptionArea
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Áreas verdes">
          <Field name="characteristics.hasGreenAreas">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasGreenAreas}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasGreenAreas
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Sala de Juntas">
          <Field name="characteristics.hasMeetingRooms">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasMeetingRooms}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasMeetingRooms
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Lobby">
          <Field name="characteristics.hasLobby">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasLobby}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasLobby
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Área de comedor">
          <Field name="characteristics.hasDiningRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasDiningRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasDiningRoom
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
    </>
  )
}

export default EspaciosComunesFields
