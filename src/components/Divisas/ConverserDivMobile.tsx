import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { useState, type ReactNode } from 'react'
// import {
//     HiOutlineUserAdd,
//     HiOutlineUserGroup,
//     HiOutlineUsers,
// } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { headerDivisas } from '../../data/divisasData'

type StatisticCardProps = {
    // icon: ReactNode
    avatarClass: string
    label: string
    nameDiv:string
    value?: number
    growthRate?: number
    loading: boolean
}

const StatisticCard = (props: StatisticCardProps) => {
    const { nameDiv, avatarClass, label, value, growthRate, loading } = props

    const avatarSize = 55

    return (
        <div>
            <Loading
                loading={loading}
                customLoader={
                    <MediaSkeleton
                        // avatarProps={{
                        //     className: 'rounded',
                        //     width: avatarSize,
                        //     height: avatarSize,
                        // }}
                    />
                }
            >
                <div className="text-center items-center">
                    <div className="flex items-center gap-2">
                        <div className='text-xs'>
                            {/* <span className=''>{label}</span> */}
                            <h4 className='text-xs  font-semibold mt-2 text-gray-500'>
                                {nameDiv}
                            </h4>
                            <h3 className='text-xs font-light text-gray-600'>
                                $<NumericFormat
                                    thousandSeparator
                                    displayType="text"
                                    value={value}
                                />
                            </h3>
                        </div>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

const ConverseDiviseMobile = () => {
    const [loading] = useState(false)
    const { divisesData } = headerDivisas

    return (
        <div className="flex justify-center lg:grid-cols-2 xl:grid-cols-3 gap-2 mb-1 mx-1 ">
            <StatisticCard
                // icon={<HiOutlineUserGroup />}
                avatarClass=""
                label=""
                nameDiv={divisesData?.totalCustomers?.divName}
                value={divisesData?.totalCustomers?.value}
                growthRate={divisesData?.totalCustomers?.growShrink}
                loading={loading}
            />
            <StatisticCard
                // icon={<HiOutlineUsers />}
                avatarClass=""
                label=""
                nameDiv={divisesData?.activeCustomers?.divName}
                value={divisesData?.activeCustomers?.value}
                growthRate={divisesData?.activeCustomers?.growShrink}
                loading={loading}
            />
            <StatisticCard
                // icon={<HiOutlineUserAdd />}
                avatarClass=""
                label=""
                nameDiv={divisesData?.newCustomers?.divName}
                value={divisesData?.newCustomers?.value}
                growthRate={divisesData?.newCustomers?.growShrink}
                loading={loading}
            />
        </div>
    )
}

export default ConverseDiviseMobile;
