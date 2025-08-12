import Card from '@/components/ui/Card'
import { MdEmail, MdMarkEmailUnread } from 'react-icons/md'

const Meta = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
      <Card className="shadow-sm">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 text-2xl bg-sky-500 rounded items-center justify-center flex">
            <MdEmail className="text-2xl text-white" />
          </span>
          <div>
            <span className="dark:text-white">Total de e-mails recibidos</span>
            <h3>{0}</h3>
          </div>
        </div>
      </Card>

      <Card className="shadow-sm">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 text-2xl bg-green-500 rounded items-center justify-center flex">
            <MdMarkEmailUnread className="text-2xl text-white" />
          </span>
          <div>
            <span className="dark:text-white">Total de e-mails activos</span>
            <h3>{0}</h3>
          </div>
        </div>
      </Card>

      <Card className="shadow-sm">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 text-2xl bg-red-500 rounded items-center justify-center flex">
            <MdEmail className="text-2xl text-white" />
          </span>
          <div>
            <span className="dark:text-white">Total de e-mails no leidos</span>
            <h3>{0}</h3>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Meta
