// /* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Upload from '@/components/ui/Upload'
import toast from '@/components/ui/toast'
import {
  useCreateUserImageMutation,
  useDeleteUserImageMutation,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { HiOutlineUser } from 'react-icons/hi'
import { IoMdTrash } from 'react-icons/io'
import { useParams } from 'react-router'
import FormRow from './FormRow'

const extractImageName = (url: string): string => {
  return url?.split('/')?.pop() || ''
}

const UserAvatarForm: React.FC<{ data: any }> = ({ data }) => {
  const { userId } = useParams()
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const [imageChanged, setImageChanged] = useState(false)
  const [
    createUserImage,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
      isUninitialized: isCreateUninitialized,
    },
  ] = useCreateUserImageMutation()

  const [
    deleteUserImage,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      isSuccess: isDeleteSuccess,
      isUninitialized: isDeleteUninitialized,
    },
  ] = useDeleteUserImageMutation()

  const imageName = extractImageName(data?.image)

  const onSetFormFile = (form, field, file) => {
    form.setFieldValue(field.name, file[0])
    setImageChanged(true)
  }

  const handleDeleteImage = async () => {
    try {
      await deleteUserImage({ name: imageName }).unwrap()
      toast.push(
        <Notification title={'Foto de perfil eliminada'} type="success" />,
        { placement: 'top-center' }
      )
    } catch (error) {
      toast.push(
        <Notification
          title={'Error al eliminar la foto de perfil'}
          type="danger"
        />,
        { placement: 'top-center' }
      )
    }
  }

  const onFormSubmit = async (values, { setSubmitting }) => {
    if (!values.image) return

    const formData = new FormData()
    formData.append('image', values.image, values.image.name)

    createUserImage({
      id: userId,
      body: formData,
    }).unwrap()

    setSubmitting(false)
  }

  const handleReset = (resetForm) => {
    resetForm()
    setImageChanged(false)
  }

  // CREATE ERROR HANDLING
  useEffect(() => {
    if (!isCreateUninitialized && isCreateError) {
      toast.push(
        <Notification
          title="Error al actualizar tu foto de perfil."
          type="danger"
        />,
        { placement: 'top-center' }
      )
    }
  }, [isCreateUninitialized, isCreateError])

  // CREATE SUCCESS HANDLING
  useEffect(() => {
    if (isCreateSuccess) {
      toast.push(
        <Notification title="Foto de perfil actualizada" type="success" />,
        { placement: 'top-center' }
      )
      window.location.reload()
    }
  }, [isCreateSuccess])

  // DELETE ERROR HANDLING
  useEffect(() => {
    if (!isDeleteUninitialized && isDeleteError) {
      toast.push(
        <Notification
          title="Error al eliminar la foto de perfil."
          type="danger"
        />,
        { placement: 'top-center' }
      )
    }
  }, [isDeleteUninitialized, isDeleteError])

  // DELETE SUCCESS HANDLING
  useEffect(() => {
    if (isDeleteSuccess) {
      toast.push(
        <Notification title="Foto de perfil eliminada" type="success" />,
        { placement: 'top-center' }
      )
      window.location.reload()
    }
  }, [isDeleteSuccess])

  return (
    <Formik
      enableReinitialize
      initialValues={{ image: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        onFormSubmit(values, { setSubmitting })
      }}
    >
      {({ touched, errors, resetForm }) => {
        const validatorProps = { touched, errors }
        return (
          <Form>
            <FormContainer>
              <FormRow name="image" label="" border={false} {...validatorProps}>
                <Field name="image">
                  {({ field, form }) => {
                    const avatarProps = field.value
                      ? { src: URL.createObjectURL(field.value) }
                      : { src: data?.image }

                    return (
                      <Upload
                        className="cursor-pointer w-full flex justify-center items-center"
                        showList={false}
                        uploadLimit={1}
                        accept="*/*"
                        onChange={(files) => onSetFormFile(form, field, files)}
                        onFileRemove={() => onSetFormFile(form, field, [])}
                      >
                        <Avatar
                          className="border-2 border-white dark:border-gray-800 shadow-lg"
                          size={60}
                          shape="circle"
                          icon={<HiOutlineUser />}
                          src={data?.image}
                          {...avatarProps}
                        />
                      </Upload>
                    )
                  }}
                </Field>
              </FormRow>

              <div className="mt-4 flex justify-center items-center flex-row w-full">
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  type="button"
                  size="sm"
                  disabled={!imageChanged}
                  onClick={() => handleReset(resetForm)}
                >
                  Restablecer
                </Button>
                <Button
                  variant="solid"
                  loading={isCreateLoading}
                  type="submit"
                  size="sm"
                  disabled={!imageChanged}
                >
                  {isCreateLoading ? 'Actualizando...' : 'Actualizar'}
                </Button>
                <Button
                  variant="solid"
                  className="ml-2"
                  type="button"
                  size="sm"
                  color="red-500"
                  icon={<IoMdTrash />}
                  loading={isDeleteLoading}
                  onClick={handleDeleteImage}
                />
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default UserAvatarForm
