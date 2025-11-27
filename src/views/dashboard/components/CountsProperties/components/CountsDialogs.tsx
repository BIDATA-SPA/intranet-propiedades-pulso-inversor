import { GrHomeRounded } from 'react-icons/gr'
import { Dialog, Progress } from '../../../../../components/ui'

type CountsByType = {
  typeOfPropertyId: string
  total: number
}

type RequestsStatisticsProps = {
  dataRequests: CountsByType[]
}

const parseToPercent = (dataRequests: CountsByType[]) => {
  const totalRequests = dataRequests.reduce((acc, item) => acc + item.total, 0)
  return dataRequests.map((item) => ({
    ...item,
    percent: ((item.total / totalRequests) * 100).toFixed(2),
  }))
}

const RequestsStatistics = ({ dataRequests }: RequestsStatisticsProps) => {
  const percentages = parseToPercent(dataRequests)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-hidden my-2 mt-4 sm:mx-5 p-4 sm:p-2">
      {percentages.map((item, index) => (
        <article
          key={index}
          className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-lime-500 drop-shadow-2xl hover:scale-105 duration-200"
        >
          <div className="mb-3">
            <GrHomeRounded className="text-4xl text-lime-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
          </div>
          <h4
            className="text-sm font-semibold text-center mt-2 truncate w-full"
            title={item.typeOfPropertyId} // Mostrar texto completo al pasar el mouse.
          >
            {item.typeOfPropertyId}
          </h4>
          <div className="text-center mt-1 w-full px-3">
            <span className="font-semibold text-gray-600 text-sm">
              {item.total} <small>veces</small>
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
  dataRequests: CountsByType[]
}

const MainContentEvent = ({
  closeDialogs,
  dataRequests,
}: MainContentEventProps) => {
  return (
    <>
      <div className="text-center mb-4 sm:mb-2 mt-4 sm:mt-2 sm:mx-14">
        <h3 className="text-2xl">Estadísticas de tipos de Propiedades</h3>
        <p className="text-gray-500">
          A continuación se muestran las estadísticas de tipos de propiedades.
        </p>
      </div>
      <RequestsStatistics dataRequests={dataRequests} />
    </>
  )
}

type CountsDialogsProps = {
  openDialog: boolean
  closeDialogs: () => void
  dataRequests: CountsByType[]
}

const CountsDialogs = ({
  openDialog,
  closeDialogs,
  dataRequests,
}: CountsDialogsProps) => {
  return (
    <Dialog isOpen={openDialog} onClose={closeDialogs}>
      <MainContentEvent
        closeDialogs={closeDialogs}
        dataRequests={dataRequests}
      />
    </Dialog>
  )
}

export default CountsDialogs
