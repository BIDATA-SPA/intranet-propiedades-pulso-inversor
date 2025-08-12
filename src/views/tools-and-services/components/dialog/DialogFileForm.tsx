/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useCreateRootFileMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useCrud } from '../../hooks/useCrud'
import { validationUploadSchema } from '../../schema'

type TInitialValues = {
  name: string
  description?: string
  folderId?: number | null
  file?: File | string
}

interface DialogFormProps {
  title?: string
  initialValues?: TInitialValues
  action: 'create' | 'update' | 'delete' | null
  onDialogClose: () => void
}

const DialogFileForm = ({
  title = 'Dialogo sin titulo',
  initialValues,
  onDialogClose,
  action,
}: DialogFormProps) => {
  const [file, setFile] = useState(null)
  const { folderId } = useParams()
  const { showNotification } = useNotification()
  const { createFatherFile } = useCrud({ file, folderId })
  const [
    createRootFile,
    {
      isLoading: rootFolderIsLoading,
      isError: rootFolderIsError,
      isSuccess: rootFolderIsSuccess,
      error: rootFolderError,
    },
  ] = useCreateRootFileMutation()

  const onSubmit = async (values) => {
    if (action === 'create') {
      const formData = createFatherFile(values)
      const response = await createRootFile(formData)
      if (response) {
        showNotification('success', 'Exito', 'Archivo creado exitosamente')
        onDialogClose()
        return
      }
      // ⚠️ handel server error
    }
  }

  useEffect(() => {
    if (rootFolderIsSuccess) {
      showNotification('success', 'Exito', 'Archivo creado exitosamente')
    }

    if (rootFolderIsError) {
      showNotification(
        'danger',
        'Error',
        'Error al crear el archivo, Inténtelo más tarde'
      )
    }
  }, [rootFolderIsSuccess, rootFolderIsError])

  return (
    <>
      <div>
        <h5 className="mb-4">{title}</h5>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationUploadSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue }) => {
          const handleFileChange = (event, field) => {
            const file = event.target.files[0]
            if (file) {
              setFieldValue(field, file)
              if (field === 'file') {
                setFile(file)
              }
            }
          }

          return (
            <Form className="space-y-4 overflow-y-scroll h-auto mt-6">
              <div className="text-right bottom-0 sticky px-4 bg-white dark:bg-gray-800">
                <FormItem
                  asterisk
                  label="Nombre del archivo"
                  invalid={errors.name && (touched.name as any)}
                  errorMessage={errors.name as any}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Ingresar nombre del archivo"
                    component={Input}
                    className="mt-1"
                  />
                </FormItem>

                <FormItem label="Descripción">
                  <Field
                    type="text"
                    autoComplete="off"
                    name="description"
                    placeholder="Ingresar descripción del archivo"
                    component={Input}
                    className="mt-1"
                  />
                </FormItem>

                <FormItem
                  label={`${
                    action === 'update' ? 'Actualizar' : 'Subir'
                  } archivo`}
                >
                  <input
                    type="file"
                    className="block w-full text-sm p-4 mt-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file"
                    name="file"
                    placeholder="Subir archivo"
                    onChange={(event) => handleFileChange(event, 'file')}
                  />
                </FormItem>
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  variant="plain"
                  onClick={onDialogClose}
                >
                  Cancelar
                </Button>
                <Button
                  variant="solid"
                  type="submit"
                  loading={
                    action === 'create'
                      ? rootFolderIsLoading
                      : action === 'update'
                      ? rootFolderIsLoading
                      : action === 'delete'
                      ? rootFolderIsLoading
                      : false
                  }
                >
                  {action === 'create' && 'Crear'}
                  {action === 'update' && 'Actualizar'}
                  {action === 'delete' && 'Eliminar'}
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default DialogFileForm
