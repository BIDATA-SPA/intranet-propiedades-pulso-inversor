import { Spinner } from '@/components/ui'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useGetDashboardQuery } from '../../../../services/RtkQueryService'
import TopsDialogs from '../TopCitiesMostProperties/components/TopsDialogs'
import UseDialog from '../TopCitiesMostProperties/hooks/useDialog'

type CityData = { name: string; total: number }
type Dashboard = {
  globalInfo?: {
    top10CitiesWithMostProperties?: CityData[]
  }
}

const TopCitiesMostProperties = () => {
  const [metaData, setMetaData] = useState<Dashboard | null>(null)
  const { data, isLoading } = useGetDashboardQuery(null, {})
  const { openDialog, openSeeDialog, closeDialogs } = UseDialog() || {}

  const handleDialogOpen = () => {
    openSeeDialog()
  }

  useEffect(() => {
    if (data) {
      setMetaData(data as Dashboard)
    }
  }, [data])

  const cityData = metaData?.globalInfo?.top10CitiesWithMostProperties || []
  const cityNames = cityData.map((city) => city.name)
  const cityTotals = cityData.map((city) => city.total)
  const hasData = cityData.length > 0

  return (
    <>
      <article className="shadow-md group h-96 w-full sm:h-full border border-1 rounded-md overflow-hidden overflow-y-auto">
        <div className="mx-3 m-2">
          <h5 className="text-gray-600">
            Top 10 Localidades con más Propiedades
          </h5>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <Spinner />
          </div>
        ) : hasData ? (
          <>
            <Chart
              options={{
                chart: {
                  type: 'bar',
                },
                xaxis: {
                  categories: cityNames,
                  title: {
                    text: 'Localidades',
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold',
                    },
                  },
                },
                yaxis: {
                  title: {
                    text: 'Total de Propiedades',
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold',
                    },
                  },
                },
                colors: ['#97a822'],
                plotOptions: {
                  bar: {
                    borderRadius: 4,
                    horizontal: false,
                  },
                },
                tooltip: {
                  enabled: true,
                },
              }}
              series={[
                {
                  name: 'Total de Propiedades',
                  data: cityTotals,
                },
              ]}
              type="bar"
              height={350}
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
          <div className="flex items-center justify-center h-80">
            <p className="text-gray-500 italic">
              No hay datos disponibles para mostrar.
            </p>
          </div>
        )}
      </article>

      {openDialog?.see && (
        <TopsDialogs
          openDialog={openDialog.see}
          dataRequests={cityData.map((city) => ({
            ...city,
            total: city.total.toString(),
          }))}
          closeDialogs={closeDialogs}
        />
      )}
    </>
  )
}

export default TopCitiesMostProperties
