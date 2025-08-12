// import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
// import Loading from '@/components/shared/Loading'
// import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
// import Avatar from '@/components/ui/Avatar'
// import Card from '@/components/ui/Card'
// import { useState, type ReactNode } from 'react'
// // import {
// //     HiOutlineUserAdd,
// //     HiOutlineUserGroup,
// //     HiOutlineUsers,
// // } from 'react-icons/hi'
// import { NumericFormat } from 'react-number-format'
// import { dashboardData } from '../data/scheduleData'

// type StatisticCardProps = {
//     // icon: ReactNode
//     avatarClass: string
//     label: string
//     nameDiv:string
//     value?: number
//     growthRate?: number
//     loading: boolean
// }

// const StatisticCard = (props: StatisticCardProps) => {
//     const { nameDiv, avatarClass, label, value, growthRate, loading } = props

//     const avatarSize = 55

//     return (
//         <div className='shadow-md'>
//             <Loading
//                 loading={loading}
//                 customLoader={
//                     <MediaSkeleton
//                         avatarProps={{
//                             className: 'rounded',
//                             width: avatarSize,
//                             height: avatarSize,
//                         }}
//                     />
//                 }
//             >
//                 <div className="grid grid-cols-1 text-center  2xl:flex 2xl:justify-between 2xl:text-start items-center">
//                     <div className="2xl:flex items-center 2xl:gap-4">
//                         <div className=''>
//                             <span className=''>{label}</span>
//                             <h4 className='font-semibold mt-2'>
//                                 {nameDiv}
//                             </h4>
//                             <h3 className='font-medium'>
//                                 $ <NumericFormat
//                                     thousandSeparator
//                                     displayType="text"
//                                     value={value}
//                                 />
//                             </h3>
//                         </div>
//                     </div>
//                     <GrowShrinkTag className='xl:mt-10' value={growthRate} suffix="%" />
//                 </div>
//             </Loading>
//         </div>
//     )
// }

// const ConverseDivise = () => {
//     const [loading] = useState(false)
//     const { divisesData } = dashboardData

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
//             <StatisticCard
//                 // icon={<HiOutlineUserGroup />}
//                 avatarClass="!bg-indigo-600"
//                 label="Unidad de Fomento"
//                 nameDiv={divisesData?.totalCustomers?.divName}
//                 value={divisesData?.totalCustomers?.value}
//                 growthRate={divisesData?.totalCustomers?.growShrink}
//                 loading={loading}
//             />
//             <StatisticCard
//                 // icon={<HiOutlineUsers />}
//                 avatarClass="!bg-blue-500"
//                 label="Unidad Tributaria Mensual"
//                 nameDiv={divisesData?.activeCustomers?.divName}
//                 value={divisesData?.activeCustomers?.value}
//                 growthRate={divisesData?.activeCustomers?.growShrink}
//                 loading={loading}
//             />
//             <StatisticCard
//                 // icon={<HiOutlineUserAdd />}
//                 avatarClass="!bg-emerald-500"
//                 label="Dólar estadounidense"
//                 nameDiv={divisesData?.newCustomers?.divName}
//                 value={divisesData?.newCustomers?.value}
//                 growthRate={divisesData?.newCustomers?.growShrink}
//                 loading={loading}
//             />
//         </div>
//     )
// }

// export default ConverseDivise;
