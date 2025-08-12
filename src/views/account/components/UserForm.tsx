'use client'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Tabs from '@/components/ui/Tabs'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { CreateRealtorFormModel } from '@/services/user/types/user.type'
import { useAppSelector } from '@/store'
import { Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { FaKey, FaShareAlt, FaStarHalfAlt } from 'react-icons/fa'
import { FaMagnifyingGlassLocation } from 'react-icons/fa6'
import { HiOutlineUserAdd } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import useUpdateUser from '../hooks/useUpdateUser'
import { validationEditSchema } from '../schema'
import AddressPreferences from './steps/AddressPreferences'
import ApiKeyPortal from './steps/ApiKeyPortal'
import MainInformation from './steps/MainInformation'
import RatingInformation from './steps/RatingInformation'
import RefCodeRealtors from './steps/RefCodeRealtors'

type FormModel = Partial<CreateRealtorFormModel>

type UserFormProps = {
  initialValues: FormModel
  data: any
}

const UserForm = ({ initialValues, data }: UserFormProps) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
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
        {userAuthority === 2 && (
          <>
            <TabNav value="tab2" icon={<FaMagnifyingGlassLocation />}>
              Ubicaciones preferentes de búsqueda
            </TabNav>
            <TabNav value="tab3" icon={<FaShareAlt />}>
              Corredores referidos
            </TabNav>
            <TabNav value="tab4" icon={<FaStarHalfAlt />}>
              Calificaciones
            </TabNav>
            <TabNav value="tab5" icon={<FaKey />}>
              API KEY (SITIO WEB)
            </TabNav>
          </>
        )}
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

        {/* TAB 2: Contenido sin formulario */}
        <TabContent value="tab2">
          <AddressPreferences />
        </TabContent>

        {/* TAB 3: Contenido sin formulario */}
        <TabContent value="tab3">
          <RefCodeRealtors data={data} />
        </TabContent>

        {/* TAB 4: Contenido sin formulario */}
        <TabContent value="tab4">
          <RatingInformation />
        </TabContent>

        <TabContent value="tab5">
          <ApiKeyPortal />
        </TabContent>
      </div>
    </Tabs>
  )
}

export default UserForm
