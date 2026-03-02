'use client'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Tabs from '@/components/ui/Tabs'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { CreateRealtorFormModel } from '@/services/user/types/user.type'
import { Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineUserAdd } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import useUpdateUser from '../hooks/useUpdateUser'
import { validationEditSchema } from '../schema'
import MainInformation from './steps/MainInformation'

type FormModel = Partial<CreateRealtorFormModel>

type UserFormProps = {
  initialValues: FormModel
  data: any
}

const UserForm = ({ initialValues }: UserFormProps) => {
  const { userId } = useParams<{ userId: string }>()
  const { updateUser, isLoading } = useUpdateUser()
  const navigate = useNavigate()

  const onSubmit = async (values: FormModel, { setSubmitting }: any) => {
    const id = userId
    if (!id) return
    setSubmitting(true)
    const formData = cloneDeep(values)
    await updateUser({ id, ...formData })
    setSubmitting(false)
  }

  const onDiscard = () => {
    navigate('/dashboard')
  }

  return (
    <Tabs defaultValue="tab1">
      <TabList>
        <TabNav value="tab1" icon={<HiOutlineUserAdd />}>
          Información Principal
        </TabNav>
      </TabList>

      <div className="p-4">
        {/* TAB 1: Contenido envuelto en Formik */}
        <TabContent value="tab1">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationEditSchema}
            onSubmit={(values, actions) => onSubmit(values, actions)}
          >
            {({ values, touched, errors, setFieldValue, isSubmitting }) => (
              <Form>
                <FormContainer>
                  <MainInformation
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                  <FormItem>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        className="ltr:mr-3 rtl:ml-3"
                        type="button"
                        onClick={onDiscard}
                      >
                        Descartar
                      </Button>
                      <Button
                        size="sm"
                        variant="solid"
                        loading={isSubmitting || isLoading}
                        type="submit"
                      >
                        {isSubmitting ? 'Guardando' : 'Actualizar'}
                      </Button>
                    </div>
                  </FormItem>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </TabContent>
      </div>
    </Tabs>
  )
}

export default UserForm
