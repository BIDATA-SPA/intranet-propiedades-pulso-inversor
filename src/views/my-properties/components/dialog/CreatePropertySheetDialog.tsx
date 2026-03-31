import { RichTextEditor } from '@/components/shared'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { generatePropertySheetPdf } from '@/views/visit/features/visit-order/pdf/generatePropertySheetPdf'
import { Field, Form, Formik, type FieldProps } from 'formik'
import * as Yup from 'yup'

type CreatePropertySheetDialogProps = {
  isOpen: boolean
  property: any | null
  onClose: () => void
}

type FormValues = {
  propertyDescription: string
}

const validationSchema = Yup.object({
  propertyDescription: Yup.string()
    .trim()
    .required('La descripción de la propiedad es obligatoria'),
})

const getInitialDescription = (property: any) => {
  return (
    property?.propertyDescription ||
    property?.description ||
    property?.publicationDescription ||
    property?.characteristics?.propertyDescription ||
    property?.summary ||
    ''
  )
}

export default function CreatePropertySheetDialog({
  isOpen,
  property,
  onClose,
}: CreatePropertySheetDialogProps) {
  const initialValues: FormValues = {
    propertyDescription: getInitialDescription(property),
  }

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    try {
      if (!property?.id) {
        throw new Error('No se encontró el identificador de la propiedad.')
      }

      await generatePropertySheetPdf(property, {
        logoUrl: '/img/logo/logo.pdf.jpeg',
        fileName: `ficha-propiedad-${property.id}.pdf`,
        descriptionOverride: values.propertyDescription,
      })

      toast.push(
        <Notification title="Ficha descargada" type="success">
          Su ficha ha sido descargada con éxito.
        </Notification>
      )

      onClose()
    } catch (error: any) {
      toast.push(
        <Notification title="Error" type="danger">
          {error?.message || 'No fue posible generar la ficha de la propiedad.'}
        </Notification>
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      width={950}
      onClose={onClose}
      onRequestClose={onClose}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="mb-4">
          <h5 className="mb-2">Crear ficha de propiedad</h5>
          <p className="text-sm text-gray-500">
            Puedes ajustar la descripción solo para esta descarga. Este cambio
            no actualizará la propiedad en el sistema; solo se utilizará en el
            PDF de la ficha.
          </p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    asterisk
                    label="Descripción de la Propiedad"
                    className="mb-6"
                    invalid={Boolean(
                      errors.propertyDescription && touched.propertyDescription
                    )}
                    errorMessage={errors.propertyDescription}
                  >
                    <Field name="propertyDescription">
                      {({ field, form }: FieldProps<FormValues>) => (
                        <RichTextEditor
                          value={field.value}
                          placeholder="Ingresar una descripción de la propiedad..."
                          onChange={(val) => {
                            form.setFieldValue(field.name, val)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <div className="mt-6 text-right">
                    <Button
                      className="ltr:mr-2 rtl:ml-2"
                      variant="plain"
                      type="button"
                      onClick={onClose}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="solid"
                      type="submit"
                      loading={isSubmitting}
                    >
                      Guardar y descargar ficha
                    </Button>
                  </div>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  )
}
