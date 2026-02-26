import { COLORS } from '@/constants/chart.constant'
import { useGetAllPropertiesQuery } from '@/services/RtkQueryService'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useAppSelector } from '../../../../my-properties/store'
import SeeMoreClicksPropertyDialog from './components/seeMoreClickProperty'
import UseDialog from './hooks/useDialog'

const ClicsOfProperties = () => {
  const [propertyClick, setPropertyClick] = useState([])
  const [loading, setLoading] = useState(true)
  const { openDialog, openSeeDialog, closeDialogs } = UseDialog()

  const data = useAppSelector((state) => state.propertiesList)
  const { data: properties, isLoading } = useGetAllPropertiesQuery({
    page: data?.page || 1,
    limit: 999,
    ...data?.filters,
  })

  //limitare los caracteres y poniendo ... en su lugar si es demasiado largo
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  const handleDialogOpen = () => {
    openSeeDialog()
  }

  useEffect(() => {
    if (properties) {
      const clicks = properties?.data.slice(0, 6).map((item) => {
        const clicksTotal =
          (item?.propertyClick?.clickOfExternalLink || 0) +
          (item?.propertyClick?.clickOfOpenContact || 0) +
          (item?.propertyClick?.clickOfSendContact || 0)
        return clicksTotal
      })

      setPropertyClick(clicks)
      setLoading(false)
    }
  }, [properties])

  // useEffect(() => {
  //   if (properties) {
  //     // dispatch(setProperties(properties.data))
  //     // dispatch(setTotalItems(properties.meta.totalItems))

  //     // dispatch(
  //     //   setPropertiesData({
  //     //     properties: properties?.data,
  //     //     totalItems: properties?.meta?.totalItems,
  //     //   })
  //     // )

  //     const titles = properties?.data
  //       .slice(0, 6)
  //       .map((item) => item?.propertyTitle)
  //     const clicks = properties?.data.slice(0, 6).map((item) => {
  //       const clicksTotal =
  //         item?.propertyClick?.clickOfExternalLink +
  //         item?.propertyClick?.clickOfOpenContact +
  //         item?.propertyClick?.clickOfSendContact
  //       return clicksTotal || 0 // Devuelve 0 si no hay datos de clics
  //     })
  //     setPropertyClick(clicks)
  //   }
  //   dispatch(setLoading(isLoading))
  // }, [properties, isLoading, dispatch])

  const hasClicks = propertyClick.reduce((acc, curr) => acc + curr, 0) > 0

  return (
    <>
      <article className="shadow-md group group-hover:blur-lg h-96 w-full sm:h-full border border-1 rounded-md overflow-hidden overflow-y-auto">
        <div className="mx-3 m-2">
          <h5 className="text-gray-600">
            Cantidad de clics en tus propiedades
          </h5>
          <small>
            realizados en portal propiedades en página web oficial{' '}
            <a
              className="underline underline-offset-1 italic"
              href="https://pulsopropiedades.cl/propiedades"
              target="_blank"
              rel="noreferrer"
            >
              Pulso Propiedades
            </a>
          </small>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-56">
            <p className="text-gray-500 italic">Cargando datos...</p>
          </div>
        ) : hasClicks ? (
          <>
            <Chart
              options={{
                colors: COLORS,
                // labels: ['Propiedad 2', 'Propiedad 3', 'Propiedad 4', 'Propiedad 5'],
                labels: properties?.data
                  .slice(0, 6)
                  .map((item) => truncate(item?.propertyTitle, 28)) || [
                  'Propiedad 1',
                  'Propiedad 2',
                ],
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: 'bottom',
                      },
                    },
                  },
                ],
              }}
              series={propertyClick?.length > 0 ? propertyClick : [0]}
              height={320}
              type="pie"
            />
            <div className="flex justify-end mx-4 m-1 mb-2 cursor-pointer">
              <p
                className="italic hover:scale-x-105 duration-150 text-sky-400"
                onClick={() => handleDialogOpen()}
              >
                Ver más detalles
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-56">
            <p className="text-gray-500 italic">No hay clics para mostrar.</p>
          </div>
        )}
      </article>

      {openDialog.see && (
        <SeeMoreClicksPropertyDialog
          openDialog={openDialog.see}
          closeDialogs={closeDialogs}
          // dataProp={properties.data}
          dataClicks={properties?.data}
        />
      )}
    </>
  )
}

export default ClicsOfProperties
