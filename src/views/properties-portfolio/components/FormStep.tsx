import Menu from '@/components/ui/Menu'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useMemo } from 'react'
import { HiCheckCircle, HiLockClosed } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { setCurrentStep, setStepStatus, StepStatus } from '../store'

type FormStepProps = {
  currentStep: number
  currentStepStatus: string
  stepStatus: StepStatus
}

type Step = {
  value: number
  label: string
}

const BASE_STEPS = [
  { label: 'Información Principal', value: 0 },
  { label: 'Características', value: 1 },
  { label: 'Ubicación', value: 2 },
  { label: 'Configurar Canje', value: 3 },
  { label: 'Publicar Propiedad', value: 4 },
] as const

const EXTRA_STEPS = [{ label: 'Subir Imágenes', value: 5 }] as const

const FormStep = ({
  currentStep,
  currentStepStatus,
  stepStatus,
}: FormStepProps) => {
  const { textTheme } = useThemeClass()
  const dispatch = useDispatch()

  // propertyId puede venir como param de ruta o como query param
  const { propertyId: routePropertyId } = useParams()
  const [searchParams] = useSearchParams()
  const queryPropertyId = searchParams.get('propertyId')
  const hasPropertyId = Boolean(routePropertyId ?? queryPropertyId)

  // Deriva los steps SIN mutar el arreglo base
  const steps = useMemo(() => {
    if (!hasPropertyId) return BASE_STEPS
    return [...BASE_STEPS, ...EXTRA_STEPS]
  }, [hasPropertyId])

  const onStepChange = (step: number) => {
    const selectedStepStatus = stepStatus[step]?.status

    if (selectedStepStatus === 'complete' || selectedStepStatus === 'current') {
      dispatch(setCurrentStep(step))
      return
    }

    if (step !== currentStep && step < currentStep) {
      if (currentStepStatus === 'pending') {
        dispatch(setStepStatus('complete'))
      }
      dispatch(setCurrentStep(step))
    }
  }

  return (
    <Menu variant="transparent" className="px-2">
      {steps.map((step: Step) => (
        <Menu.MenuItem
          key={step.value}
          eventKey={step.value.toString()}
          className="mb-2"
          isActive={currentStep === step.value}
          onSelect={() => onStepChange(step.value)}
        >
          <span className="text-2xl ltr:mr-2 rtl:ml-2">
            {stepStatus[step.value]?.status === 'complete' && (
              <HiCheckCircle className={textTheme} />
            )}
            {stepStatus[step.value]?.status === 'current' && (
              <HiCheckCircle className="text-gray-400" />
            )}
            {stepStatus[step.value]?.status === 'pending' &&
              currentStep === step.value && (
                <HiCheckCircle className="text-gray-400" />
              )}
            {stepStatus[step.value]?.status === 'pending' &&
              currentStep !== step.value && (
                <HiLockClosed className="text-gray-400" />
              )}
            {stepStatus[step.value]?.status === 'invalid' && (
              <HiCheckCircle className="text-gray-400" />
            )}
          </span>
          <span>{step.label}</span>
        </Menu.MenuItem>
      ))}
    </Menu>
  )
}

export default FormStep
