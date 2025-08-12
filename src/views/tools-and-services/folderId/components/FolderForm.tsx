import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useCreateRootFolderMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCrud } from '../../hooks/useCrud'
import { validationSchema } from '../../schema'

type TInitialValues = {
  name: string
  description?: string
  parentFolderId?: number | null
  image?: File | string
}

interface IFolderFormProps {
  title?: string
  initialValues?: TInitialValues
  action: 'add' | 'edit' | 'delete'
  onClose: () => void
}

const FolderForm = ({
  title = 'Dialogo sin titulo',
  initialValues,
  action,
  onClose,
}: IFolderFormProps) => {
  const [image, setImage] = useState(null)
  const { folderId } = useParams()
  const { showNotification } = useNotification()
  const { createChildFolder } = useCrud({
    image: image,
    parentFolderId: folderId,
  })

  const [
    createRootFolder,
    {
      isLoading: rootFolderIsLoading,
      isError: rootFolderIsError,
      isSuccess: rootFolderIsSuccess,
      error: rootFolderError,
    },
  ] = useCreateRootFolderMutation()

  const onSubmit = async (values) => {
    if (action === 'add') {
      const formData = createChildFolder(values)
      const response = await createRootFolder(formData)
      if (response) {
        showNotification('success', 'Exito', 'Carpeta creada exitosamente')
        onClose()
        return
      }
      // ⚠️ handel server error
    }
  }

  useEffect(() => {
    if (rootFolderIsSuccess) {
      showNotification('success', 'Exito', 'Carpeta creada exitosamente')
    }

    if (rootFolderIsError) {
      showNotification(
        'danger',
        'Error',
        'Error al crear la carpeta, Inténtelo más tarde'
      )
    }
  }, [rootFolderIsSuccess, rootFolderIsError])

  return (
    <div>
      <div>
        <h5 className="mb-4">{title}</h5>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue }) => {
          const handleFileChange = (event, field) => {
            const file = event.target.files[0]
            if (file) {
              setFieldValue(field, file)
              if (field === 'image') {
                setImage(file)
              }
            }
          }

          return (
            <Form className="space-y-4 overflow-y-scroll h-auto mt-6">
              <div className="text-right bottom-0 sticky px-4 bg-white dark:bg-gray-800">
                <FormItem
                  asterisk
                  label="Nombre del la carpeta"
                  invalid={errors.name && (touched.name as any)}
                  errorMessage={errors.name as any}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Ingresar nombre de la carpeta"
                    component={Input}
                    className="mt-1"
                  />
                </FormItem>

                <FormItem label="Descripción">
                  <Field
                    type="text"
                    autoComplete="off"
                    name="description"
                    placeholder="Ingresar descripción del contenido"
                    component={Input}
                    className="mt-1"
                  />
                </FormItem>

                <FormItem
                  label={`${action === 'edit' ? 'Actualizar' : 'Subir'} imagen`}
                >
                  <input
                    type="file"
                    className="block w-full text-sm p-4 mt-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="image"
                    name="image"
                    placeholder="Subir archivo"
                    onChange={(event) => handleFileChange(event, 'image')}
                  />
                </FormItem>
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  variant="plain"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  variant="solid"
                  type="submit"
                  loading={
                    action === 'add'
                      ? rootFolderIsLoading
                      : action === 'edit'
                      ? rootFolderIsLoading
                      : action === 'delete'
                      ? rootFolderIsLoading
                      : false
                  }
                >
                  {action === 'add' && 'Crear'}
                  {action === 'edit' && 'Actualizar'}
                  {action === 'delete' && 'Eliminar'}
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default FolderForm
