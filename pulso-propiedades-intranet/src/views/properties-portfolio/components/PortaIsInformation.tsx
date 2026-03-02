/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import { injectReducer } from '@/store'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import reducer, {
  useAppDispatch,
  useAppSelector,
  type PortalsInformation as PortalsInformationType,
} from '../store'

injectReducer('accountDetailForm', reducer)

type FormModel = PortalsInformationType

type PortalsInformationProps = {
  data: PortalsInformationType
  onNextChange?: (
    values: FormModel,
    formName: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => void
  currentStepStatus?: string
}

const validationSchema = Yup.object({
  portals: Yup.array().nullable().optional(),
})

const PortalsInformation = ({
  data = {
    portals: [],
  },
  onNextChange,
  currentStepStatus,
}: PortalsInformationProps) => {
  const dispatch = useAppDispatch()

  const formData = useAppSelector(
    (state) => state.accountDetailForm.data.formData
  )

  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onNextChange?.(values, 'portalsInformation', setSubmitting)
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Integración en Portales</h3>
      </div>
      <Formik
        initialValues={data}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          setTimeout(() => {
            onNext(values, setSubmitting)
          }, 1000)
        }}
      >
        {({ values, touched, errors, isSubmitting }) => {
          return (
            <Form>
              <FormContainer>
                <div>ACA LOGICA DE PORTALES</div>

                <div className="flex justify-start gap-2">
                  <Button loading={isSubmitting} variant="solid" type="submit">
                    {currentStepStatus === 'complete' ? 'Guardar' : 'Siguiente'}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default PortalsInformation
