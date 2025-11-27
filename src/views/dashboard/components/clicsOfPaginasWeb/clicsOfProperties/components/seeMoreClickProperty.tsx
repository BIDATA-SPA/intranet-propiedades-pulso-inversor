import { Dialog, Dropdown } from '@/components/ui'
// import { MdOutlineConnectWithoutContact, MdWeb  } from "react-icons/md";
// import { FaWpforms } from "react-icons/fa";
// import { GrContactInfo } from "react-icons/gr";
import { useState } from 'react'
import { IoIosRocket } from 'react-icons/io'

const StadisticsClicks = ({ dataClicks }) => {
  const [moreProp, setMoreProp] = useState(false)
  const [sortByData, setSortByData] = useState('default')
  const limitTop = 99

  const sortData = (data) => {
    if (!Array.isArray(data)) return []

    switch (sortByData) {
      case 'default':
        return [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
      case 'mostInteractions':
        return [...data].sort((a, b) => {
          const totalA =
            (a?.propertyClick?.clickOfExternalLink || 0) +
            (a?.propertyClick?.clickOfOpenContact || 0) +
            (a?.propertyClick?.clickOfSendContact || 0)
          const totalB =
            (b?.propertyClick?.clickOfExternalLink || 0) +
            (b?.propertyClick?.clickOfOpenContact || 0) +
            (b?.propertyClick?.clickOfSendContact || 0)
          return totalB - totalA // Más interacciones
        })
      case 'leastInteractions':
        return [...data].sort((a, b) => {
          const totalA =
            (a?.propertyClick?.clickOfExternalLink || 0) +
            (a?.propertyClick?.clickOfOpenContact || 0) +
            (a?.propertyClick?.clickOfSendContact || 0)
          const totalB =
            (b?.propertyClick?.clickOfExternalLink || 0) +
            (b?.propertyClick?.clickOfOpenContact || 0) +
            (b?.propertyClick?.clickOfSendContact || 0)
          return totalA - totalB // Menos interacciones
        })
      default:
        // return data
        return [...data].sort((a, b) => b - a) // Orden descendente
    }
  }

  const sortedData = sortData(dataClicks)

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  const toggleMoreProp = async () => {
    setMoreProp(!moreProp)
  }

  return (
    <div className="overflow-x-hidden overflow-y-auto p-2 h-full xl:h-[60vh]">
      <div className="flex justify-start items-center mx-2 text-lime-500">
        <Dropdown
          title="Ordenar por"
          trigger="hover"
          className=""
          placement="bottom-start"
          onSelect={(eventKey) => setSortByData(eventKey)}
        >
          <Dropdown.Item eventKey="default">última subidas</Dropdown.Item>
          <Dropdown.Item eventKey="mostInteractions">
            Más interacciones
          </Dropdown.Item>
          <Dropdown.Item eventKey="leastInteractions">
            Menos interacciones
          </Dropdown.Item>
          {/* <Dropdown.Item eventKey="d">Item D</Dropdown.Item> */}
        </Dropdown>
      </div>
      <div className="flex flex-col gap-3 pt-3 mx-2">
        {sortedData?.length > 0
          ? sortedData?.slice(0, 3).map((propClick) => {
              return (
                <article
                  key={propClick?.id}
                  className="flex flex-col overflow-hidden w-full px-1 h-full 2xl:h-full rounded-md border border-sky-50 shadow-md hover:scale-105 duration-200"
                >
                  <div className="flex flex-col sm:flex-row  items-center px-4 sm:px-1">
                    <div className="w-1.5/3 items-center p-1">
                      {propClick?.images.length > 0 ? (
                        propClick.images.slice(0, 1).map((img) => (
                          <div key={img.id}>
                            <img
                              src={img.path}
                              loading="eager"
                              className="object-cover h-20 w-20 sm:h-24 sm:w-24 rounded-md"
                              alt=""
                            />
                          </div>
                        ))
                      ) : (
                        <img
                          src={'/img/not-found/not-found-image.png'}
                          className=" h-20 w-20 sm:h-24 sm:w-24 rounded-md"
                          alt=""
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-1 sm:w-96 sm:mx-6 px-1 sm:pl-2">
                      <div>
                        <h6 className="text-sm text-gray-800 font-semibold mt-2 mb-2">
                          {truncate(
                            propClick?.propertyTitle,
                            36 || 'Sin titulo'
                          )}
                        </h6>
                        <ul className="flex flex-row gap-2 justify-between text-xs mt-1">
                          <li className="flex flex-col items-center">
                            <span className="font-semibold">
                              {propClick?.propertyClick?.clickOfExternalLink ||
                                0}
                            </span>
                            <small className="text-sm">veces</small>
                            <small className="font-normal mb-2 text-center">
                              Han revisado link de portal
                            </small>
                          </li>
                          <li className="flex flex-col items-center">
                            <span className="font-semibold">
                              {propClick?.propertyClick?.clickOfOpenContact ||
                                0}
                            </span>
                            <small className="text-sm">veces</small>
                            <small className="font-normal mb-2  text-center">
                              Han revisado para contactarte
                            </small>
                          </li>
                          <li className="flex flex-col items-center">
                            <span className="font-semibold">
                              {propClick?.propertyClick?.clickOfSendContact ||
                                0}
                            </span>
                            <small className="text-sm">veces</small>
                            <small className="font-normal mb-2  text-center">
                              Te han contactado
                            </small>
                          </li>
                        </ul>
                      </div>
                      <div className="flex flex-row justify-end items-center cursor-pointer gap-1 mb-1 text-sky-400 group">
                        <p className="italic text-sm">Potenciar</p>
                        <IoIosRocket className="group-hover:translate-x-2 group-hover:-translate-y-1 duration-300" />
                      </div>

                      {/* <div  className="text-md sm:text-xs">
                                            <Progress color="green-600" percent={percentages[0]} />
                                        </div> */}
                    </div>
                  </div>
                </article>
              )
            })
          : ''}
        {!moreProp
          ? ''
          : moreProp &&
            (sortedData?.length > 0
              ? sortedData?.slice(4, limitTop).map((propClick) => {
                  return (
                    <article
                      key={propClick?.id}
                      className="flex flex-col overflow-hidden w-full px-1 h-full 2xl:h-full rounded-md border border-sky-50 shadow-md hover:scale-105 duration-200"
                    >
                      <div className="flex flex-col sm:flex-row  items-center px-4 sm:px-1">
                        <div className="w-1.5/3 items-center p-1">
                          {propClick?.images.length > 0 ? (
                            propClick.images.slice(0, 1).map((img) => (
                              <div key={img.id}>
                                <img
                                  src={img.path}
                                  className="object-cover h-20 w-20 sm:h-24 sm:w-24 rounded-md"
                                  alt=""
                                />
                              </div>
                            ))
                          ) : (
                            <img
                              src={'/img/not-found/not-found-image.png'}
                              className=" h-20 w-20 sm:h-24 sm:w-24 rounded-md"
                              alt=""
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-2 mt-1 sm:w-96 sm:mx-6 px-1 sm:pl-2">
                          <div>
                            <h6 className="text-sm text-gray-800 font-semibold mt-2 mb-2">
                              {truncate(
                                propClick?.propertyTitle,
                                36 || 'Sin titulo'
                              )}
                            </h6>
                            <ul className="flex flex-row gap-2 justify-between text-xs mt-1">
                              <li className="flex flex-col items-center">
                                <span className="font-semibold">
                                  {propClick?.propertyClick
                                    ?.clickOfExternalLink || 0}
                                </span>
                                <small className="text-sm">veces</small>
                                <small className="font-normal mb-2 text-center">
                                  Han revisado link de portal
                                </small>
                              </li>
                              <li className="flex flex-col items-center">
                                <span className="font-semibold">
                                  {propClick?.propertyClick
                                    ?.clickOfOpenContact || 0}
                                </span>
                                <small className="text-sm">veces</small>
                                <small className="font-normal mb-2  text-center">
                                  Han revisado para contactarte
                                </small>
                              </li>
                              <li className="flex flex-col items-center">
                                <span className="font-semibold">
                                  {propClick?.propertyClick
                                    ?.clickOfSendContact || 0}
                                </span>
                                <small className="text-sm">veces</small>
                                <small className="font-normal mb-2  text-center">
                                  Te han contactado
                                </small>
                              </li>
                            </ul>
                          </div>
                          <div className="flex flex-row justify-end items-center cursor-pointer gap-1 mb-1 text-sky-400 group">
                            <p className="italic text-sm">Potenciar</p>
                            <IoIosRocket className="group-hover:translate-x-2 group-hover:-translate-y-1 duration-300" />
                          </div>

                          {/* <div  className="text-md sm:text-xs">
                                            <Progress color="green-600" percent={percentages[0]} />
                                        </div> */}
                        </div>
                      </div>
                    </article>
                  )
                })
              : '')}
      </div>
      <div className="flex justify-end mx-4 m-1 mb-2 cursor-pointer mt-3">
        <p
          onClick={toggleMoreProp}
          className="italic hover:scale-x-105 duration-150 text-sky-400"
        >
          {moreProp ? 'Ver menos' : 'Ver más propiedades'}
        </p>
      </div>
    </div>
  )
}

const MainContentEvent = ({ closeDialogs, dataClicks }) => {
  return (
    <>
      <div className="text-center mb-4 sm:mb-2 mt-4 sm:mt-2 sm:mx-14">
        <h3 className="text-2xl">Estadísticas completas de tus propiedades</h3>
        <small>
          en la web oficial{' '}
          <a
            className="text-sky-600 underline underline-offset-1 italic"
            href="https://procanje.com/portal-propiedades"
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

const SeeMoreClicksPropertyDialog = ({
  openDialog,
  closeDialogs,
  dataClicks,
}) => {
  return (
    <Dialog isOpen={openDialog} onClose={closeDialogs} width={650}>
      <MainContentEvent closeDialogs={closeDialogs} dataClicks={dataClicks} />
    </Dialog>
  )
}

export default SeeMoreClicksPropertyDialog
