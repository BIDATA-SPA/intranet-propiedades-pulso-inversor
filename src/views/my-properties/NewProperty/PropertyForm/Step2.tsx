import { FormItem } from '@/components/ui'
import Button from '@/components/ui/Button'

const Step2 = ({ values, touched, errors }) => {
  return (
    <div>
      Step2
      <FormItem>
        <div className="flex gap-2">
          <Button variant="solid" type="submit" loading={false}>
            Guardar
          </Button>
        </div>
      </FormItem>
    </div>
  )
}

export default Step2
