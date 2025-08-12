/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {
  useCreateRootFolderMutation,
  useUpdateRootFolderMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useCrud } from '../../hooks/useCrud'
import { validationSchema } from '../../schema'

type TInitialValues = {
  name: string
  description?: string
  parentFolderId?: number | null
  image?: File | string
}

interface DialogFormProps {
  title?: string
  initialValues?: TInitialValues
  action: 'create' | 'update' | 'delete' | null
  onDialogClose: () => void
  idItem?: number
}

const DialogForm = ({
  title = 'Dialogo sin titulo',
  initialValues,
  onDialogClose,
  action,
  idItem,
}: DialogFormProps) => {
  const [image, setImage] = useState(null)
  const { showNotification } = useNotification()
  const { createFatherFolder, updateFatherFolder } = useCrud({ image })
  const [
    createRootFolder,
    {
      isLoading: rootFolderIsLoading,
      isError: rootFolderIsError,
      isSuccess: rootFolderIsSuccess,
    },
  ] = useCreateRootFolderMutation()
  const [
    updateRootFolder,
    {
      data: updateFetched,
      isError: updateIsError,
      isLoading: updateIsLoading,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdateRootFolderMutation()

  const onSubmit = async (values) => {
    if (action === 'create') {
      const formData = createFatherFolder(values)
      const response = await createRootFolder(formData)
      if (response) {
        showNotification('success', 'Exito', 'Carpeta creada exitosamente')
        onDialogClose()
        return
      }
      // ⚠️ handel server error
    }

    if (action === 'update') {
      const formData = updateFatherFolder(values)
      const response = await updateRootFolder({
        id: `${idItem}`,
        data: formData,
      })
      if (response) {
        showNotification('success', 'Exito', 'Carpeta actualizada exitosamente')
        onDialogClose()
        return
      }
      // ⚠️ handel server error
    }
  }

  // CREATE NOTIFICATIONS
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

  // UPDATE NOTIFICATIONS
  useEffect(() => {
    if (updateFetched || updateIsSuccess) {
      showNotification(
        'success',
        'Contacto actualizado',
        'Contacto actualizado exitosamente'
      )
    }
    if (updateIsError) {
      showNotification(
        'warning',
        'Error',
        'Ocurrió un error al actualizar el servicio, por favor intenta más tarde'
      )
    }
  }, [updateFetched, updateIsError, updateIsSuccess])

  return (
    <>
      <div>
        <h5 className="mb-4">{title}</h5>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => {
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

                {/* If folder is uploaded show this field */}
                {action === 'update' && values.image && !image && (
                  <FormItem label="imagen Actual">
                    <img
                      src={values.image}
                      alt="Logo actual"
                      height="20px"
                      width="50px"
                    />
                  </FormItem>
                )}

                <FormItem
                  label={`${
                    action === 'update' ? 'Actualizar' : 'Subir'
                  } imagen`}
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
                      ? updateIsLoading
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

export default DialogForm
