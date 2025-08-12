import Button from '@/components/ui/Button'
import { ServiceRequestRow } from '@/services/marketing/brand/types'

interface UpdateExchangeFormProps {
  onClose: () => void
  brand: ServiceRequestRow
}

const BenefitsForm = ({ onClose }: UpdateExchangeFormProps) => {
  const onSubmit = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <div>
      <div className="text-right mt-6 p-2">
        <div className="flex flex-col items-start justify-start text-start w-full overflow-y-scroll">
          <form className="px-4" onSubmit={onSubmit}>
            <div className="mb-8">
              <div className="card card-border" role="presentation">
                <div className="card-body flex flex-col lg:flex-row items-center w-full gap-4">
                  <div className="flex flex-col items-start justify-start text-start w-full">
                    <div className="flex flex-col md:flex-row">
                      <h6>Lista de beneficios</h6>
                    </div>
                    <div className="w-full">
                      <p className="text-gray-400">
                        Lista de beneficios al Disenar tu propia marca
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end items-center">
              <Button variant="solid" type="submit" className="m-2">
                Entendido
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BenefitsForm
