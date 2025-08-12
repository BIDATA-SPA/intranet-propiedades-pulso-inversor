/* eslint-disable react-hooks/exhaustive-deps */
import { FormContainer, FormItem, Input, Tooltip } from '@/components/ui'
import Button from '@/components/ui/Button'
import {
  useGetMyInfoQuery,
  usePatchApiKeyDeactivateMutation,
  usePatchApiKeyGenerateMutation,
} from '@/services/RtkQueryService'
import { useCopyToClipboard } from '@/utils/hooks/useCopyToClipboard'
import useNotification from '@/utils/hooks/useNotification'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import { MdBlock } from 'react-icons/md'

const tip = (
  <Tooltip title="Este recurso puedes utilizarlo para próximas integraciones de Procanje y tu web.">
    <HiOutlineQuestionMarkCircle className="text-lg cursor-pointer ml-1" />
  </Tooltip>
)

const ApiKeyPortal = () => {
  const [
    patchApiKeyGenerate,
    {
      isLoading: isApiKeyLoading,
      isError: isApiKeyError,
      isSuccess: isApiKeySuccess,
      isUninitialized,
    },
  ] = usePatchApiKeyGenerateMutation()
  const [
    patchApiKeyDeactivate,
    {
      isLoading: isApiKeyDesLoading,
      isError: isApiKeyDesError,
      isSuccess: isApiKeyDesSuccess,
    },
  ] = usePatchApiKeyDeactivateMutation()

  const { showNotification } = useNotification()
  const { data: user } = useGetMyInfoQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  //   Activate API KEY
  const handleSubmit = async (values, { setSubmitting }) => {
    const id = Number(values.userId) // Asegura que sea numérico
    if (!id) return

    try {
      await patchApiKeyGenerate({ id }).unwrap()
    } catch (error) {
      showNotification(
        'warning',
        'Error',
        'Ocurrio un error al actualizar tu API KEY, intentalo más tarde',
        3
      )
    } finally {
      setSubmitting(false)
    }
  }

  //   Desactivate API KEY
  const handleDeactivate = async () => {
    await patchApiKeyDeactivate({ id: Number(user?.id) }).unwrap()
  }

  useEffect(() => {
    if (isApiKeySuccess) {
      showNotification(
        'success',
        'Actualizada',
        'API KEY Actualizada correctamente',
        3
      )
    }

    if (!isUninitialized && isApiKeyError) {
      showNotification(
        'warning',
        'Error',
        'Ocurrio un error al actualizar tu API KEY, intentalo más tarde',
        3
      )
    }
  }, [isApiKeySuccess, isApiKeyError, isUninitialized])

  //   Desactivate API KEY
  useEffect(() => {
    if (isApiKeyDesSuccess) {
      showNotification(
        'warning',
        'Desactivada',
        'API KEY desactivada correctamente',
        3
      )
    }
    if (isApiKeyDesError) {
      showNotification(
        'warning',
        'Error',
        'Ocurrio un error al desactivar tu API KEY, intentalo más tarde',
        3
      )
    }
  }, [isApiKeyDesSuccess, isApiKeyDesError])

  return (
    <Formik
      initialValues={{ userId: user?.id || null }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <FormContainer>
            <div className="flex flex-row items-center">
              <div className="w-[93%]">
                <FormItem label="API KEY" extra={tip}>
                  <Input
                    disabled
                    type="text"
                    name="referralCode"
                    placeholder="Sin API KEY registrada"
                    value={user?.apiKey || ''}
                    className={classNames(
                      isCopied &&
                        'border-2 border-green-600 bg-gray-50 text-gray-800 font-bold'
                    )}
                  />
                </FormItem>
              </div>
              <div className="w-[7%] flex justify-center items-center">
                <Tooltip title={isCopied ? 'Copiado' : 'Copiar'}>
                  <button
                    type="button"
                    className={`p-2 rounded-md transition-colors ${
                      isCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => copyToClipboard(`${user?.apiKey}` || '')}
                  >
                    {isCopied ? (
                      <FaClipboardCheck className="text-2xl" />
                    ) : (
                      <FaClipboard className="text-2xl" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>
          </FormContainer>

          <div className="w-full flex justify-end items-center gap-3">
            <Button
              type="button"
              variant="solid"
              color="red-600"
              loading={isApiKeyDesLoading}
              icon={<MdBlock />}
              onClick={handleDeactivate}
            >
              {isApiKeyDesLoading ? 'Desactivando...' : 'Desactivar API KEY'}
            </Button>

            <Button
              type="submit"
              loading={isApiKeyLoading || isSubmitting}
              variant="solid"
            >
              {isApiKeyLoading || isSubmitting
                ? 'Actualizando...'
                : 'Actualizar mi API KEY'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default ApiKeyPortal
