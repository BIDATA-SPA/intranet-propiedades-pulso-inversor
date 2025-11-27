import { Dialog, Progress } from '@/components/ui'
import { FaWpforms } from 'react-icons/fa'
import { GrContactInfo } from 'react-icons/gr'
import { MdOutlineConnectWithoutContact, MdWeb } from 'react-icons/md'
import { TbUserSquareRounded } from 'react-icons/tb'

const StadisticsClicks = ({ dataClicks }) => {
  // console.log('contador', dataClicks)

  const parseToPercent = () => {
    const totalClicks = Object.values(dataClicks).reduce(
      (acc, val) => acc + val,
      0
    )
    // const percentClicks = {}

    // Convertir cada valor en porcentaje
    const percentClicks = Object.keys(dataClicks).map((key) => {
      return ((dataClicks[key] / totalClicks) * 100).toFixed(2)
    })

    return percentClicks
  }

  const percentages = parseToPercent()

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-hidden my-2 mt-4 sm:mx-5 p-4 sm:p-2">
        <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-lime-500 drop-shadow-2xl hover:scale-105 duration-200">
          <div className="mb-3">
            <TbUserSquareRounded className="text-4xl text-lime-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
          </div>
          <div className="text-center mt-3">
            <span className="font-semibold  ">
              {dataClicks?.clickOfMoreOfRealtor} <small>veces</small>
            </span>
            <p className="font-normal mb-6 sm:text-xs">Han visto tu perfil</p>
            <div className="text-md sm:text-xs">
              <Progress color="green-600" percent={percentages[0]} />
            </div>
          </div>
        </article>
        <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-lime-500 drop-shadow-2xl hover:scale-105 duration-200">
          <div className="mb-3">
            <MdOutlineConnectWithoutContact className="text-4xl text-lime-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
          </div>
          <div className="text-center mt-3">
            <span className="font-semibold">
              {dataClicks?.clickOfNameRealtor} <small>veces</small>
            </span>
            <p className="font-normal mb-3 sm:text-xs">
              Han hecho clic a tu nombre
            </p>
            <div className="text-md sm:text-xs">
              <Progress color="green-600" percent={percentages[1]} />
            </div>
          </div>
        </article>
        <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-lime-500 drop-shadow-2xl hover:scale-105 duration-200">
          <div className="mb-3">
            <GrContactInfo className="text-4xl text-lime-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
          </div>
          <div className="text-center mt-3">
            <span className="font-semibold">
              {dataClicks?.clickOfOpenContact} <small>veces</small>
            </span>
            <p className="font-normal mb-3 sm:text-xs">
              Han revisado tu contacto
            </p>
            <div className="text-md sm:text-xs">
              <Progress color="green-600" percent={percentages[2]} />
            </div>
          </div>
        </article>
        <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-lime-500 drop-shadow-2xl hover:scale-105 duration-200">
          <div className="mb-3">
            <FaWpforms className="text-4xl text-lime-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
          </div>
          <div className="text-center mt-3">
            <span className="font-semibold">
              {dataClicks?.clickOfSendContact} <small>veces</small>
            </span>
            <p className="font-normal mb-3 sm:text-xs">
              Te han enviado un correo
            </p>
            <div className="text-md sm:text-xs">
              <Progress color="green-600" percent={percentages[3]} />
            </div>
          </div>
        </article>
        <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-lime-500 drop-shadow-2xl hover:scale-105 duration-200">
          <div className="mb-3">
            <MdWeb className="text-4xl text-lime-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
          </div>
          <div className="text-center mt-3">
            <span className="font-semibold">
              {dataClicks?.clickOfWebPage} <small>veces</small>
            </span>
            <p className="font-normal mb-3 sm:text-xs">
              Han visitado tu sitio web
            </p>
            <div className="text-md sm:text-xs">
              <Progress color="green-600" percent={percentages[4]} />
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

const MainContentEvent = ({ closeDialogs, dataClicks }) => {
  return (
    <>
      <div className="text-center mb-4 sm:mb-2 mt-4 sm:mt-2 sm:mx-14">
        <h3 className="text-2xl">Estadísticas completas como corredor</h3>
        <small>
          en la web oficial{' '}
          <a
            className="text-sky-600 underline underline-offset-1 italic"
            href="https://procanje.com/portal-corredores"
            target="_blank"
            rel="noreferrer"
          >
            Procanje.com
          </a>
        </small>
      </div>
      <StadisticsClicks dataClicks={dataClicks} />
    </>
  )
}

const SeeMoreClicksDialog = ({ openDialog, closeDialogs, dataClicks }) => {
  return (
    <Dialog isOpen={openDialog} onClose={closeDialogs}>
      <MainContentEvent closeDialogs={closeDialogs} dataClicks={dataClicks} />
    </Dialog>
  )
}

export default SeeMoreClicksDialog
