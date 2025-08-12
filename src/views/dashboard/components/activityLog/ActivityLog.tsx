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
  const { data } = useGetActivitiesQuery()
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
            <small className="text-sm">realizada dentro de PulsoInversor App</small>
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
                                ? 'bg-sky-500'
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
              {/* <li>
                <Checkbox value="kanjeoRequest">Solicitudes de canjes</Checkbox>
              </li> */}
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

// import Avatar from '@/components/ui/Avatar'
// import Badge from '@/components/ui/Badge'
// import Checkbox from '@/components/ui/Checkbox'
// import Timeline from '@/components/ui/Timeline'
// import { FaHandshake } from 'react-icons/fa'
// import {
//   HiCalendar,
//   HiHome,
//   HiInformationCircle,
//   HiUserGroup,
// } from 'react-icons/hi'
// import { MdOutlineCompareArrows } from 'react-icons/md'

// import type { AvatarProps } from '@/components/ui/Avatar'

// import { useGetActivitiesQuery } from '@/services/RtkQueryService'
// import { useEffect, useState } from 'react'

// type TimelineAvatarProps = AvatarProps

// const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
//   return (
//     <Avatar {...rest} size={25} shape="circle">
//       {children}
//     </Avatar>
//   )
// }

// const iconMap = {
//   calendar: (
//     <TimelineAvatar className="bg-blue-200">
//       <HiCalendar className="text-blue-500 text-xl" title="calendario" />
//     </TimelineAvatar>
//   ),
//   customer: (
//     <TimelineAvatar className="bg-green-200">
//       <HiUserGroup className="text-green-500 text-xl" title="cliente" />
//     </TimelineAvatar>
//   ),
//   kanjeoRequest: (
//     <TimelineAvatar className="bg-purple-200">
//       <FaHandshake className="text-purple-500 text-xl" title="canje" />
//     </TimelineAvatar>
//   ),
//   property: (
//     <TimelineAvatar className="bg-red-200">
//       <HiHome className="text-red-500 text-xl" title="propiedad" />
//     </TimelineAvatar>
//   ),
// }

// const ActivityLog = () => {
//   const { data, error } = useGetActivitiesQuery()
//   const [activityData, setActivityData] = useState(null)
//   const [checkboxList, setCheckboxList] = useState([
//     'customer',
//     'property',
//     'kanjeoRequest',
//     'calendar',
//   ])
//   const [filteredData, setFilteredData] = useState(null)

//   const onCheckboxChange = (options) => {
//     setCheckboxList(options)
//   }

//   useEffect(() => {
//     if (data && data?.data) {
//       setActivityData(data)
//       setFilteredData(data?.data) // Inicialmente mostrar toda la data
//     }
//   }, [data])

//   useEffect(() => {
//     // Filtrar las actividades solo si algún checkbox se desmarca o marca
//     if (activityData?.data.length > 0) {
//       if (checkboxList.length > 0) {
//         const filtered = activityData?.data.filter((item) => {
//           return (
//             (item.customer && checkboxList.includes('customer')) ||
//             (item.property && checkboxList.includes('property')) ||
//             (item.kanjeoRequest && checkboxList.includes('kanjeoRequest')) ||
//             (item.calendar && checkboxList.includes('calendar'))
//           )
//         })
//         setFilteredData(filtered)
//       } else {
//         setFilteredData(activityData) // Mostrar toda la data por defecto
//       }
//     }
//   }, [checkboxList, activityData])

//   return (
//     <>
//       <article className="shadow-md group group-hover:blur-lg px-2 2xl:px-5 p-1 2xl:p-2 w-full h-full border border-1 rounded-md">
//         <div className="flex flex-col-reverse 2xl:flex-row gap-2 sm:gap-6">
//           <div className="max-h-[750px] max-w-[850px] 2xl:w-[815px] overflow-x-auto sm:overscroll-none overflow-y-auto">
//             <div className="mx-2 m-2 mb-4">
//               <h4 className="text-gray-600">Actividad reciente</h4>
//               <small className="text-sm">
//                 realizada dentro de Procanje App
//               </small>
//             </div>
//             <Timeline>
//               {filteredData && filteredData?.length > 0 ? (
//                 filteredData?.map((item) => {
//                   let taskIcon
//                   let taskDetail
//                   let taskSend
//                   let taskRecept
//                   let taskDescrip
//                   let taskStatus
//                   let taskBadge
//                   if (item?.calendar) {
//                     taskIcon = iconMap.calendar
//                     taskDetail = `Evento: ${item?.calendar.title}.`
//                     taskDescrip = `Descripción: ${item?.calendar.description}.`
//                     taskStatus = `${item?.calendar.status.name}`
//                     taskBadge = item?.calendar.status.name || ''
//                   } else if (item?.customer) {
//                     taskIcon = iconMap.customer
//                     taskDetail = `Cliente: ${item?.customer.name} ${item?.customer.lastName}.`
//                     taskDescrip = `Acción: ${item?.actionType.name || ''}.`
//                     taskStatus = 'Creado'
//                     taskBadge = 'Creado'
//                   } else if (item?.kanjeoRequest) {
//                     taskIcon = iconMap.kanjeoRequest
//                     taskDetail = `Petición de canje: ${item?.kanjeoRequest.type.name}.`
//                     // taskDescrip = `Descripción: ${item?.kanjeoRequest}.`
//                     taskSend = `${item?.kanjeoRequest.emailsSent[0].requestingRealtorEmail}`
//                     taskRecept = `${item?.kanjeoRequest.emailsSent[0].to}`
//                     // taskRecept = `Para: ${item?.kanjeoRequest.realtorOwner.session.email}`

//                     taskStatus = `${item?.kanjeoRequest.status.name}`
//                     taskBadge = item?.kanjeoRequest.status.name || ''
//                   } else if (item?.property) {
//                     taskIcon = iconMap.property
//                     taskDetail = `Propiedad: ${
//                       item?.property.propertyTitle || ''
//                     }`
//                     taskDescrip = `Descripción: ${
//                       item?.property.propertyDescription || ''
//                     }.`
//                     taskStatus = `${item?.property.propertyStatus.name || ''}`
//                     taskBadge = item?.property.propertyStatus.name || ''
//                   } else {
//                     taskIcon = (
//                       <TimelineAvatar className="bg-yellow-200">
//                         <HiInformationCircle className="text-yellow-500" />
//                       </TimelineAvatar>
//                     ) // Icono por defecto
//                   }

//                   return (
//                     <Timeline.Item key={item.id} media={{ ...taskIcon }}>
//                       <p className="my-1 flex flex-col sm:flex-row gap-3 sm:items-center">
//                         <span className="font-semibold text-gray-900 dark:text-gray-100">
//                           {item?.user.name || ''}
//                         </span>
//                         <span className="sm:mx-2">
//                           Realizó una {item?.actionType.name}
//                         </span>
//                         <div className="flex items-center">
//                           <span className=" rtl:mr-3">
//                             {new Date(item?.createdAt || '').toLocaleString(
//                               'es-ES',
//                               {
//                                 timeZone: 'UTC',
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: '2-digit',
//                                 hour: '2-digit',
//                                 minute: '2-digit',
//                               }
//                             )}
//                             hrs
//                           </span>
//                         </div>
//                         <div className="flex justify-center mx-2 sm:mx-0 sm:justify-end items-center border rounded-full p-1 px-2">
//                           {taskBadge === 'Pendiente' ? (
//                             <Badge className=" bg-yellow-500" />
//                           ) : taskBadge === 'Activa' ? (
//                             <Badge className=" bg-emerald-500" />
//                           ) : taskBadge === 'Aprobada' ? (
//                             <Badge className=" bg-emerald-500" />
//                           ) : taskBadge === 'Creado' ? (
//                             <Badge className=" bg-sky-500" />
//                           ) : (
//                             <Badge className=" bg-red-500" />
//                           )}

//                           <span className="ml-1 rtl:mr-1 font-semibold text-gray-900 dark:text-gray-100">
//                             {taskStatus ? taskStatus : 'Sin estado'}
//                           </span>
//                         </div>
//                       </p>
//                       <div className="flex flex-col items-start p-2 px-4 py-3 m-2 border border-gray-100 rounded-md">
//                         <p className="">{taskDetail || 'No hay detalles'}</p>
//                         <p>{taskDescrip || ''}</p>
//                         {taskSend && taskRecept ? (
//                           <div className="flex flex-col sm:flex-row gap-3 items-center">
//                             <p className="font-bold italic">
//                               De:{' '}
//                               <span className="not-italic font-medium underline underline-offset-2">
//                                 {taskSend || 'No hay detalles'}
//                               </span>
//                             </p>
//                             <MdOutlineCompareArrows className="text-2xl sm:text-xl" />
//                             <p className="font-bold italic">
//                               Para:{' '}
//                               <span className="not-italic font-medium underline underline-offset-2">
//                                 {taskRecept || ''}
//                               </span>
//                             </p>
//                           </div>
//                         ) : (
//                           ''
//                         )}
//                         {/* <div className='flex items-center '>
//                                                     <Badge className="bg-emerald-500" />
//                                                     <span className="ml-1 rtl:mr-1 font-semibold text-gray-900 dark:text-gray-100">
//                                                         {taskStatus}
//                                                     </span>
//                                                 </div> */}
//                       </div>
//                     </Timeline.Item>
//                   )
//                 })
//               ) : (
//                 <p className="my-1 sm:mx-4 flex flex-row items-center">
//                   <span className="ml-1 rtl:mr-1 text-xs font-semibold text-gray-600 dark:text-gray-100">
//                     ¡No hay acciones realizadas!{' '}
//                     <a
//                       href="/clientes"
//                       className="font-light underline underline-offset-1 text-sky-600 italic"
//                     >
//                       Crea tu primer cliente
//                     </a>
//                   </span>
//                 </p>
//               )}
//             </Timeline>
//           </div>
//           <div className="p-1 overflow-hidden">
//             <div className="mx-2 m-2 mt-3 mb-4">
//               <h6 className="text-gray-600">Filtrar por actividad</h6>
//             </div>
//             <Checkbox.Group value={checkboxList} onChange={onCheckboxChange}>
//               <ul className="flex flex-row 2xl:flex-col gap-3 sm:mx-4 overflow-x-auto">
//                 <li>
//                   <Checkbox value="customer">Clientes</Checkbox>
//                 </li>
//                 <li>
//                   <Checkbox value="property">Propiedades</Checkbox>
//                 </li>
//                 <li>
//                   <Checkbox value="kanjeoRequest">
//                     Solicitudes de canjes
//                   </Checkbox>
//                 </li>
//                 <li>
//                   <Checkbox value="calendar">Calendario</Checkbox>
//                 </li>
//               </ul>
//             </Checkbox.Group>
//           </div>
//         </div>
//       </article>
//     </>
//   )
// }

// export default ActivityLog
