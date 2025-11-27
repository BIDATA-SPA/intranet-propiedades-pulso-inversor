import { GrHomeRounded } from 'react-icons/gr'
import { Dialog, Progress } from '../../../../../components/ui'

type TopCity = {
  name: string
  total: string // Refleja el formato del response body.
}

type RequestsStatisticsProps = {
  dataRequests: TopCity[]
}

// Función para calcular el porcentaje basado en el total global.
const parseToPercent = (dataRequests: TopCity[]) => {
  // Convertimos `total` a número y calculamos el total global.
  const totalRequests = dataRequests.reduce(
    (acc, item) => acc + Number(item.total),
    0
  )

  return dataRequests.map((item) => ({
    ...item,
    percent:
      totalRequests > 0
        ? ((Number(item.total) / totalRequests) * 100).toFixed(2)
        : '0.00',
  }))
}

const RequestsStatistics = ({ dataRequests }: RequestsStatisticsProps) => {
  // Calculamos los porcentajes.
  const percentages = parseToPercent(dataRequests)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-hidden my-2 mt-4 sm:mx-5 p-4 sm:p-2">
      {percentages.map((item, index) => (
        <article
          key={index}
          className="flex flex-col items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-lime-500 drop-shadow-2xl hover:scale-105 duration-200"
        >
          <div className="mb-3">
            <GrHomeRounded className="text-4xl text-lime-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
          </div>
          <h4
            className="text-sm font-semibold text-center mt-2 truncate w-full"
            title={item.name}
          >
            {item.name}
          </h4>
          <div className="text-center mt-1 w-full px-3">
            <span className="font-semibold text-gray-600 text-sm">
              {item.total} <small>propiedades</small>
            </span>
            <div className="relative w-full mt-2">
              <Progress
                color="green-600"
                percent={Number(item.percent) || 0}
                className="h-4 rounded-md"
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

type MainContentEventProps = {
  closeDialogs: () => void
  dataRequests: TopCity[]
}

const MainContentEvent = ({ dataRequests }: MainContentEventProps) => {
  const hasData = dataRequests.length > 0

  return (
    <>
      <div className="text-center mb-4 sm:mb-2 mt-4 sm:mt-2 sm:mx-14">
        <h3 className="text-2xl">Top 10 Localidades con más Propiedades</h3>
        <p className="text-gray-500">
          {hasData
            ? 'A continuación se muestran las cantidades de propiedades por localidad.'
            : 'No hay datos disponibles para mostrar.'}
        </p>
      </div>
      {hasData ? (
        <RequestsStatistics dataRequests={dataRequests} />
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 italic">No se encontraron datos.</p>
        </div>
      )}
    </>
  )
}

type TopsDialogsProps = {
  openDialog: boolean
  closeDialogs: () => void
  dataRequests: TopCity[]
}

const TopsDialogs = ({
  openDialog,
  closeDialogs,
  dataRequests,
}: TopsDialogsProps) => {
  return (
    <Dialog isOpen={openDialog} onClose={closeDialogs}>
      <div className="max-h-[500px] overflow-y-auto">
        <MainContentEvent
          closeDialogs={closeDialogs}
          dataRequests={dataRequests}
        />
      </div>
    </Dialog>
  )
}

export default TopsDialogs
