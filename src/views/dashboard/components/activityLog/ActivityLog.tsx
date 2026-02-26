import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Checkbox from '@/components/ui/Checkbox'
import Timeline from '@/components/ui/Timeline'
import { useGetActivitiesQuery } from '@/services/RtkQueryService'
import { stripHtml } from '@/utils/stripHTML'
import { useEffect, useState } from 'react'
import { FaHandshake } from 'react-icons/fa'
import {
  HiCalendar,
  HiHome,
  HiInformationCircle,
  HiUserGroup,
} from 'react-icons/hi'
import { Link } from 'react-router-dom'

const TimelineAvatar = ({ children, ...rest }) => (
  <Avatar {...rest} size={25} shape="circle">
    {children}
  </Avatar>
)

const iconMap = {
  calendar: (
    <TimelineAvatar className="bg-blue-200">
      <HiCalendar className="text-blue-500 text-xl" title="Calendario" />
    </TimelineAvatar>
  ),
  customer: (
    <TimelineAvatar className="bg-green-200">
      <HiUserGroup className="text-green-500 text-xl" title="Cliente" />
    </TimelineAvatar>
  ),
  kanjeoRequest: (
    <TimelineAvatar className="bg-purple-200">
      <FaHandshake className="text-purple-500 text-xl" title="Canje" />
    </TimelineAvatar>
  ),
  property: (
    <TimelineAvatar className="bg-red-200">
      <HiHome className="text-red-500 text-xl" title="Propiedad" />
    </TimelineAvatar>
  ),
  default: (
    <TimelineAvatar className="bg-yellow-200">
      <HiInformationCircle
        className="text-yellow-500 text-xl"
        title="Información"
      />
    </TimelineAvatar>
  ),
}

const ActivityLog = () => {
  const { data } = useGetActivitiesQuery({})
  const [checkboxList, setCheckboxList] = useState([
    'customer',
    'property',
    'kanjeoRequest',
    'calendar',
  ])
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    if (data && data?.data) {
      const initialData = data.data
      setFilteredData(initialData)
    }
  }, [data])

  useEffect(() => {
    if (data && data?.data) {
      const filtered = data.data.filter(
        (item) =>
          (item.customer && checkboxList.includes('customer')) ||
          (item.property && checkboxList.includes('property')) ||
          (item.kanjeoRequest && checkboxList.includes('kanjeoRequest')) ||
          (item.calendar && checkboxList.includes('calendar'))
      )
      setFilteredData(filtered)
    }
  }, [checkboxList, data])

  const handleCheckboxChange = (options) => {
    setCheckboxList(options)
  }

  return (
    <div className="shadow-md group px-2 2xl:px-5 p-1 2xl:p-2 w-full h-full border rounded-md">
      <div className="flex flex-col-reverse 2xl:flex-row gap-2 sm:gap-6">
        <div className="max-h-[750px] max-w-[850px] 2xl:w-[815px] overflow-x-auto sm:overscroll-none overflow-y-auto">
          <div className="mx-2 m-2 mb-4">
            <h4 className="text-gray-600">Actividad reciente</h4>
            <small className="text-sm">
              realizada dentro de Pulso Propiedades App
            </small>
          </div>
          <Timeline>
            {filteredData && filteredData?.length > 0 ? (
              filteredData.map((item) => {
                const {
                  customer,
                  property,
                  kanjeoRequest,
                  calendar,
                  id,
                  user,
                  actionType,
                  createdAt,
                } = item

                const taskIcon = calendar
                  ? iconMap.calendar
                  : customer
                  ? iconMap.customer
                  : kanjeoRequest
                  ? iconMap.kanjeoRequest
                  : property
                  ? iconMap.property
                  : iconMap.default

                const taskDetail = calendar
                  ? `Evento: ${calendar?.title}.`
                  : customer
                  ? `Cliente: ${customer?.name} ${customer?.lastName}.`
                  : kanjeoRequest
                  ? `Petición de canje: ${kanjeoRequest?.type?.name}.`
                  : property
                  ? `Propiedad: ${property?.propertyTitle || ''}`
                  : 'Sin detalles'

                const taskDescrip = calendar
                  ? `Descripción: ${calendar?.description || 'N/A'}.`
                  : customer
                  ? `Acción: ${actionType?.name || 'N/A'}.`
                  : property
                  ? `Descripción: ${
                      stripHtml(property?.propertyDescription) || 'N/A'
                    }.`
                  : ''

                const taskStatus = calendar
                  ? calendar.status.name
                  : customer
                  ? 'Creado'
                  : kanjeoRequest
                  ? kanjeoRequest.status.name
                  : property
                  ? property.propertyStatus.name
                  : 'Sin estado'

                return (
                  <Timeline.Item key={id} media={taskIcon}>
                    <p>
                      <span className="my-1 flex flex-col sm:flex-row gap-3 sm:items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.name || 'Usuario desconocido'}
                        </span>
                        <span className="sm:mx-2">
                          Realizó una {actionType.name}
                        </span>
                        <span className="flex items-center">
                          <span className="rtl:mr-3">
                            {new Date(createdAt).toLocaleString('es-ES', {
                              timeZone: 'UTC',
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            hrs
                          </span>
                        </span>
                        <span className="flex justify-center mx-2 sm:mx-0 sm:justify-end items-center border rounded-full p-1 px-2">
                          <Badge
                            className={
                              taskStatus === 'Pendiente'
                                ? 'bg-yellow-500'
                                : taskStatus === 'Activa'
                                ? 'bg-emerald-500'
                                : taskStatus === 'Aprobada'
                                ? 'bg-emerald-500'
                                : taskStatus === 'Creado'
                                ? 'bg-lime-500'
                                : 'bg-red-500'
                            }
                          />
                          <span className="ml-1 rtl:mr-1 font-semibold text-gray-900 dark:text-gray-100">
                            {taskStatus}
                          </span>
                        </span>
                      </span>
                      <span className="flex flex-col items-start p-2 px-4 py-3 m-2 border border-gray-100 rounded-md">
                        <span>{taskDetail}</span>
                        <span>{taskDescrip}</span>
                      </span>
                    </p>
                  </Timeline.Item>
                )
              })
            ) : (
              <Timeline.Item>
                <p className="my-1 sm:mx-4 flex flex-row items-center">
                  <span className="ml-1 rtl:mr-1 text-xs font-semibold text-gray-600 dark:text-gray-100">
                    ¡No hay acciones realizadas!{' '}
                    <Link
                      to="/clientes"
                      className="font-light underline text-sky-600 italic"
                    >
                      Crea tu primer cliente
                    </Link>
                  </span>
                </p>
              </Timeline.Item>
            )}
          </Timeline>
        </div>

        <div className="p-1 overflow-hidden">
          <div className="mx-2 m-2 mt-3 mb-4">
            <h6 className="text-gray-600">Filtrar por actividad</h6>
          </div>
          <Checkbox.Group value={checkboxList} onChange={handleCheckboxChange}>
            <ul className="flex flex-row 2xl:flex-col gap-3 sm:mx-4 overflow-x-auto">
              <li>
                <Checkbox value="customer">Clientes</Checkbox>
              </li>
              <li>
                <Checkbox value="property">Propiedades</Checkbox>
              </li>
              <li>
                <Checkbox value="calendar">Calendario</Checkbox>
              </li>
            </ul>
          </Checkbox.Group>
        </div>
      </div>
    </div>
  )
}

export default ActivityLog
