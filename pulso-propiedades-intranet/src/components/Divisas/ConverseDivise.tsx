import Tooltip from '@/components/ui/Tooltip'
import { useEffect, useState } from 'react'
import { Badge } from '../ui'
// import {
//     HiOutlineUserAdd,
//     HiOutlineUserGroup,
//     HiOutlineUsers,
// } from 'react-icons/hi'
import {
  getExchangeRate,
  getExchangeRateUSD,
  getExchangeRateUTM,
} from '@/services/converseDivises/Divises.service'
import { PiChartLineUpLight } from 'react-icons/pi'
import { headerDivisas } from '../../data/divisasData'

type StatisticCardProps = {
  // icon: ReactNode
  avatarClass: string
  label: string
  nameDiv: string
  value?: number
  growthRate?: number
  loading: boolean
}

// const StatisticCard = (props: StatisticCardProps) => {
//     const { nameDiv, avatarClass, label, value, growthRate, loading } = props

//     const avatarSize = 55

//     return (
//         <div>
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
//                 <div className="text-center 2xl:flex 2xl:justify-between 2xl:text-start items-center">
//                     <div className="flex items-center gap-2 2xl:gap-4">
//                         <div className='text-xs '>
//                             {/* <span className=''>{label}</span> */}
//                             <h4 className='text-xs font-semibold lg:text-base mt-2 xl:m-1 2xl:ml-4 text-gray-500'>
//                                 {nameDiv}
//                             </h4>
//                             <h3 className='text-xs font-light lg:font-medium lg:text-base xl:m-1 text-gray-600'>
//                                 $<NumericFormat
//                                     thousandSeparator
//                                     displayType="text"
//                                     value={value}
//                                 />
//                             </h3>
//                         </div>
//                     </div>
//                     {/* <GrowShrinkTag className='' value={growthRate} suffix="%" /> */}
//                 </div>
//             </Loading>
//         </div>
//     )
// }

const ConverseDivise = () => {
  const [loading, setLoading] = useState(false)
  const { divisesData } = headerDivisas

  const [exchangeRate, setExchangeRate] = useState<string | null>(null)
  const [exchangeRateUtm, setExchangeRateUtm] = useState<string | null>(null)
  const [exchangeRateUsd, setExchangeRateUsd] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const apiKey = 'b3c682f4e4e29811fa1fd8d3781a463b59181fb7'
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // const apiKey = 'b3c682f4e4e29811fa1fd8d3781a463b59181fb7';
        const response = await getExchangeRate(apiKey)

        if (response && response.UFs && response.UFs.length > 0) {
          const ufValue = response.UFs[0].Valor
          const formattedUfValue = parseFloat(
            ufValue.replace(',', '.')
          ).toFixed(3)
          setExchangeRate(formattedUfValue)
          setError(null)
        } else {
          setError('No se encontraron UFs en la respuesta')
        }
      } catch (error) {
        setError('Error al obtener la tasa de cambio')
      }
    }
    fetchExchangeRate()
    // const interval = setInterval(fetchExchangeRate, 1 * 60 * 1000);
    // return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const fetchExchangeRateUtm = async () => {
      try {
        // const apiKey = 'b3c682f4e4e29811fa1fd8d3781a463b59181fb7';
        const response = await getExchangeRateUTM(apiKey)

        if (response && response.UTMs && response.UTMs.length > 0) {
          const utmValue = response.UTMs[0].Valor
          const formattedUtmValue = parseFloat(
            utmValue.replace(',', '.')
          ).toFixed(3)
          setExchangeRateUtm(formattedUtmValue)
          setError(null)
        } else {
          setError('No se encontraron UTMs en la respuesta')
        }
      } catch (error) {
        setError('Error al obtener la tasa de cambio')
      }
    }
    fetchExchangeRateUtm()
    // const interval = setInterval(fetchExchangeRateUtm, 1 * 60 * 1000);
    // return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const fetchExchangeRateUsd = async () => {
      try {
        // const apiKey = 'b3c682f4e4e29811fa1fd8d3781a463b59181fb7';
        const response = await getExchangeRateUSD(apiKey)

        if (response && response.Dolares && response.Dolares.length > 0) {
          const usdValue = response.Dolares[0].Valor
          const formattedUsdValue = parseFloat(
            usdValue.replace(',', '.')
          ).toFixed(2)
          setExchangeRateUsd(formattedUsdValue)
          setError(null)
        } else {
          setError('No se encontraron UTMs en la respuesta')
        }
      } catch (error) {
        setError('Error al obtener la tasa de cambio')
      }
    }
    fetchExchangeRateUsd()
    // const interval = setInterval(fetchExchangeRateUsd, 1 * 60 * 1000);
    // return () => clearInterval(interval);
  }, [])

  return (
    <div className=" absolute bg-gray-50 dark:bg-gray-800 dark:border-t-gray-600 dark:border-b-gray-600 border-b border-t sm:border-none sm:border-t-none left-0 top-16 p-2 w-full flex justify-center items-center shadow-sm sm:w-[75%] sm:relative sm:top-0 sm:shadow-none  sm:bg-transparent sm:flex sm:flex-row sm:justify-center sm:gap-2 sm:mb-1 sm:mx-1">
      <Tooltip title="Indicadores económicos" placement="bottom">
        <p className="font-semibold lg:block hidden">
          <PiChartLineUpLight className="text-2xl mx-3 text-gray-600 dark:text-gray-400" />
        </p>
      </Tooltip>
      {error && <p>{error}</p>}
      <Tooltip title={`UF ${exchangeRate ?? '0'}`} placement="bottom">
        <Badge
          className="mr-4 text-nowrap p-1 text-sm font-bold px-2 border dark:border-white dark:bg-white dark:text-black border-lime-500/50 dark:border-white/50 shadow-md hover:bg-lime-600 hover:text-white duration-300 cursor-pointer"
          content={`UF ${exchangeRate ?? '0'}`}
          innerClass="bg-lime-500 text-white"
        />
      </Tooltip>
      <Tooltip title={`UTM ${exchangeRateUtm ?? '0'}`} placement="bottom">
        <Badge
          className="mr-4 p-1 text-sm font-bold px-2 border dark:border-white dark:bg-white dark:text-black border-lime-500/50 dark:border-white/50 shadow-md hover:bg-lime-600 hover:text-white duration-300 cursor-pointer"
          content={`UTM ${exchangeRateUtm ?? '0'}`}
          innerClass="bg-lime-500 text-white"
        />
      </Tooltip>
      <Tooltip title={`USD $${exchangeRateUsd ?? '0'}`} placement="bottom">
        <Badge
          className="mr-4 p-1 text-sm font-bold px-2 border dark:border-white dark:bg-white dark:text-black border-lime-500/50 dark:border-white/50 shadow-md hover:bg-lime-600 hover:text-white duration-300 cursor-pointer"
          content={`USD $${exchangeRateUsd ?? '0'}`}
          innerClass="bg-lime-500 text-white"
        />
      </Tooltip>
    </div>
  )
}

export default ConverseDivise
