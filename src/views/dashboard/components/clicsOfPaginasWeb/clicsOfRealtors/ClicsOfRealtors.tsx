import { COLORS } from '@/constants/chart.constant'
import { useGetMyInfoQuery } from '@/services/RtkQueryService'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import SeeMoreClicksDialog from './components/SeeMoreClicks'
import UseDialog from './hooks/useDialogs'

const ClicsOfRealtors = () => {
  const [userClick, setUserClick] = useState(null)

  const { data } = useGetMyInfoQuery({}, {})
  const { openDialog, openSeeDialog, closeDialogs } = UseDialog()

  const handleDialogOpen = () => {
    openSeeDialog()
  }

  useEffect(() => {
    if (data) {
      const response = data.userClick
      setUserClick(response)
    }
  }, [data])

  const hasClicks = userClick
    ? userClick.clickOfMoreOfRealtor +
        userClick.clickOfNameRealtor +
        userClick.clickOfOpenContact +
        userClick.clickOfSendContact +
        userClick.clickOfWebPage >
      0
    : false

  return (
    <>
      <article className="shadow-md group group-hover:blur-lg h-96 w-full sm:h-full border border-1 rounded-md overflow-hidden overflow-y-auto">
        <div className="mx-3 m-2">
          <h5 className="text-gray-600">Cantidad de clics a tu perfil</h5>
          <small>
            realizados en portal corredores en página web oficial{' '}
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
        {hasClicks ? (
          <>
            <Chart
              options={{
                colors: COLORS,
                labels: [
                  'Visita a perfil',
                  'Resumen de perfil',
                  'Intentado contactar',
                  'Contactado por correo ',
                  'Han visto tu sitio web',
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
              series={[
                userClick?.clickOfMoreOfRealtor || 0,
                userClick?.clickOfNameRealtor || 0,
                userClick?.clickOfOpenContact || 0,
                userClick?.clickOfSendContact || 0,
                userClick?.clickOfWebPage || 0,
              ]}
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
          <div className="flex items-center justify-center h-80">
            <p className="text-gray-500 italic">No hay clics para mostrar.</p>
          </div>
        )}
      </article>

      {openDialog.see && (
        <SeeMoreClicksDialog
          openDialog={openDialog.see}
          closeDialogs={closeDialogs}
          dataClicks={userClick}
        />
      )}
    </>
  )
}

export default ClicsOfRealtors
