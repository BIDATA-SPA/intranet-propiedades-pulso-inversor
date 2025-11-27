import {
  Button,
  Checkbox,
  FormItem,
  Notification,
  toast,
} from '@/components/ui'
import { useUpdatePropertyMutation } from '@/services/RtkQueryService'
import { useState } from 'react'

export const ContentTypeOfHeating = () => {
  return (
    <>
      <h6>
        <b>Calefacción de gas:</b>
      </h6>
      <p>
        El gas es una de las fuentes de energía más utilizada para la
        calefacción en sistemas de circuitos de radiadores, suelo radiante, etc.
      </p>
      <br></br>
      <h6>
        <b>Calefacción eléctrica:</b>
      </h6>
      <p>
        sistemas de calor por aire alimentados por bombas de calor inverter que
        ofrecen además refrigeración en verano. Este es el caso de la aerotermia
        que se sirve además del calor del aire exterior para rentabilizar su
        consumo eléctrico puesto que han sido concebidas para un uso continuado
        no puntual.
      </p>
      <br></br>
      <h6>
        <b>Calefacción solar térmica o fotovoltaica:</b>
      </h6>
      <p>
        Este tipo de sistemas de calefacción de autoconsumo puede proporcionar
        energía térmica para abastecer instalaciones de calefacción y ACS o bien
        eléctrica a través de instalaciones fotovoltaicas.
      </p>
      <br></br>
      <h6>
        <b>Calefacción de biomasa:</b>
      </h6>
      <p>
        La biomasa es el aprovechamiento de la materia orgánica para fines
        energéticos como los residuos forestales, agrícolas, industrias
        forestales, cultivos energéticos y residuos orgánicos de las ciudades.
        Puede alimentar elementos como estufas de pellets o una caldera de
        condensación que suministre un circuito de radiadores.
      </p>
      <br></br>
      <h6>
        <b>Calefacción por geotermia:</b>
      </h6>
      <p>
        La geotermia se basa en el aprovechamiento del calor almacenado bajo la
        superficie terrestre proveniente de volcanes, aguas termales, fumarolas
        y géiseres. Es un sistema de calefacción ecológico y muy eficiente que
        puede alimentar sistemas de suelo radiante o circuitos de radiadores de
        baja temperatura.
      </p>
      <br></br>
    </>
  )
}

export const ContentTypeOfKitchen = () => {
  return (
    <>
      <h6>
        <b>Cocinas en isla:</b>
      </h6>
      <p>
        Las cocinas tipo isla destacan por su amplitud y elegancia, ya que
        permiten realizar diferentes funciones a la vez, como cocinar y comer en
        la propia cocina. Existen tres tipos de cocinas en isla, y son los
        siguientes:
      </p>
      <ul>
        <li>
          ● <b>Isla de cocina y de lavado:</b>normalmente es la más demandada
          del mercado, pudiendo encontrar en ella la vitrocerámica y el
          fregadero.
        </li>
        <li>
          ● <b>Isla de apoyo:</b>Este tipo de cocinas, la isla funciona
          principalmente de almacenaje y de ayuda, ya que la encimera se
          encontrará despejada totalmente.
        </li>
        <li>
          ● <b>Isla de desayuno o de comida:</b> en este caso, la isla puede
          convertirse en el sitio ideal para desayunar, comer o merendar, por
          ejemplo.
        </li>
      </ul>
      <br></br>
      <h6>
        <b>Cocinas en forma de U:</b>
      </h6>
      <p>
        Las cocinas en U son ideales para cocinar, puesto que facilita la
        movilidad y la eficiencia a la hora de trabajar. Se adaptan
        perfectamente tanto a espacios grandes como pequeños. Ocupan tres
        paredes y tan solo tienen una zona de acceso. Sus ventajas son:
      </p>
      <ul>
        <li>
          ● La corta distancia entre las distintas zonas de trabajo, que permite
          tener todo a mano.
        </li>
        <li>
          ● Se pueden distribuir de diferentes formas y adaptarse muy bien al
          espacio disponible.
        </li>
        <li>
          ● Al ocupar tres paredes, tienen gran capacidad de almacenamiento. Son
          ideales para cocinas con poco espacio.
        </li>
      </ul>
      <br></br>
      <h6>
        <b>Cocinas tipo península:</b>
      </h6>
      <p>
        Son una buena alternativa a las cocinas tipo isla. La diferencia, es que
        en estas uno de los laterales se apoya en una pared. Esto significa que
        los elementos que la componen se sitúan de manera perpendicular sobre
        una de las paredes, dejando tres lados abiertos para el acceso.
      </p>
      <br></br>
      <h6>
        <b>Cocinas en L:</b>
      </h6>
      <p>
        Las cocinas en L son una tendencia cada vez más común, sobre todo
        cuando, al igual que en la cocina americana, se busca unir el espacio de
        cocina con el del comedor o salón. Principales ventajas:
      </p>
      <ul>
        <li>● Son realmente elegantes.</li>
        <li>
          ● Consiguen aprovechar muy bien el espacio disponible, especialmente
          para estancias rectangulares.
        </li>
        <li>
          ● Permiten realizar funciones como desayunar, almorzar o merendar,
          además de servir de espacio de cocinado y almacenaje de alimentos.
        </li>
      </ul>
      <br></br>
      <h6>
        <b>Cocinas en línea:</b>
      </h6>
      <p>
        Se trata del tipo de cocina más tradicional y muy aconsejable para
        estancias rectangulares con tamaño reducido. Estas son algunas de sus
        ventajas:
      </p>
      <ul>
        <li>● Son perfectas para estancias estrechas.</li>
        <li>
          ● En ellas se cocina y se trabaja de manera eficiente, diferenciando
          los espacios en la propia encimera.
        </li>
        <li>● Son muy fáciles de limpiar.</li>
      </ul>
    </>
  )
}

export const ContentPublishedProperty = () => {
  return (
    <>
      <p>
        Este campo alojará el link público en el que se encuentre publicada tu
        propiedad actualmente, como detalles, imágenes, contacto, etc. Haciendo
        referencia a los Portales de Propiedades como:{' '}
        <a
          href="https://www.portalinmobiliario.com/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          Portalinmobiliario.com
        </a>
        ,{' '}
        <a
          href="https://www.yapo.cl/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          Yapo.cl
        </a>
        ,{' '}
        <a
          href="https://chilepropiedades.cl/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          ChilePropiedades.cl
        </a>
        ,{' '}
        <a
          href="https://www.toctoc.com/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          TocToc.com
        </a>{' '}
        , etc.
      </p>
    </>
  )
}

export const ContentExitKanje = ({
  data: { property },
  onCloseDialog,
  setIsDialogOpen,
}) => {
  const [propertyData, setPropertyData] = useState({
    step1: {
      userId: property?.user?.id,
      customerId: property?.customer?.id,
      typeOfOperationId: property?.typeOfOperationId,
      timeAvailable: {
        start: property?.timeAvailableStart,
        end: property?.timeAvailableEnd,
      },
      typeOfPropertyId: property?.typeOfPropertyId,
      currencyId: property?.currencyId,
      propertyPrice: property?.propertyPrice,
    },
    step2: {
      highlighted: property?.highlighted,
      observations: property?.observations,
      characteristics: {
        surface: property?.characteristics?.surface,
        constructedSurface: property?.characteristics?.constructedSurface,
        floors: property?.characteristics?.floors,
        numberOfFloors: property?.characteristics?.numberOfFloors,
        terraces: property?.characteristics?.terraces,
        bathrooms: property?.characteristics?.bathrooms,
        bedrooms: property?.characteristics?.bedrooms,
        hasKitchen: property?.characteristics?.hasKitchen,
        typeOfKitchen: property?.characteristics?.typeOfKitchen,
        hasHeating: property?.characteristics?.hasHeating,
        typeOfHeating: property?.characteristics?.typeOfHeating,
        hasAirConditioning: property?.characteristics?.hasAirConditioning,
        hasParking: property?.characteristics?.hasParking,
        hasGarage: property?.characteristics?.hasGarage,
        numberOfParkingSpaces: property?.characteristics?.numberOfParkingSpaces,
        hasElevator: property?.characteristics?.hasElevator,
        hasGym: property?.characteristics?.hasGym,
        hasSwimmingPool: property?.characteristics?.hasSwimmingPool,
        hasSecurity: property?.characteristics?.hasSecurity,
        typeOfSecurity: property?.characteristics?.typeOfSecurity,
        locatedInCondominium: property?.characteristics?.locatedInCondominium,
        isFurnished: property?.characteristics?.isFurnished,
        hasBarbecueArea: property?.characteristics?.hasBarbecueArea,
        propertyTitle: property?.propertyTitle,
        propertyDescription: property?.propertyDescription,
      },
    },
    step3: {
      country: property?.address?.country,
      region: property?.address?.region,
      commune: property?.address?.commune,
      city: property?.address?.city,
      address: property?.address?.address,
      number: property?.address?.number,
      letter: property?.address?.letter,
      references: property?.address?.references,
    },
    step4: {
      isExchanged: property?.isExchanged,
      // timeInExchange: {
      //     start: property?.timeInExchangeStart,
      //     end: property?.timeInExchangeEnd,
      // },
      // propertyDescriptionInExchange:
      //     property?.propertyDescriptionInExchange,
    },
  })

  const [updateProperty, { isLoading, isError, isUninitialized }] =
    useUpdatePropertyMutation()

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isUninitialized) {
        await updateProperty({
          id: property?.id,
          ...propertyData,
        })
        openNotification(
          'success',
          '¡Actualizada!',
          'Propiedad en Canje actualizada exitosamente',
          3
        )
        onCloseDialog(setIsDialogOpen)
        setPropertyData({
          step1: {
            userId: property?.user?.id,
            customerId: property?.customer?.id,
            typeOfOperationId: property?.typeOfOperationId,
            timeAvailable: {
              start: property?.timeAvailableStart,
              end: property?.timeAvailableEnd,
            },
            typeOfPropertyId: property?.typeOfPropertyId,
            currencyId: property?.currencyId,
            propertyPrice: property?.propertyPrice,
          },
          step2: {
            highlighted: property?.highlighted,
            observations: property?.observations,
            characteristics: {
              surface: property?.characteristics?.surface,
              constructedSurface: property?.characteristics?.constructedSurface,
              floors: property?.characteristics?.floors,
              numberOfFloors: property?.characteristics?.numberOfFloors,
              terraces: property?.characteristics?.terraces,
              bathrooms: property?.characteristics?.bathrooms,
              bedrooms: property?.characteristics?.bedrooms,
              hasKitchen: property?.characteristics?.hasKitchen,
              typeOfKitchen: property?.characteristics?.typeOfKitchen,
              hasHeating: property?.characteristics?.hasHeating,
              typeOfHeating: property?.characteristics?.typeOfHeating,
              hasAirConditioning: property?.characteristics?.hasAirConditioning,
              hasParking: property?.characteristics?.hasParking,
              hasGarage: property?.characteristics?.hasGarage,
              numberOfParkingSpaces:
                property?.characteristics?.numberOfParkingSpaces,
              hasElevator: property?.characteristics?.hasElevator,
              hasGym: property?.characteristics?.hasGym,
              hasSwimmingPool: property?.characteristics?.hasSwimmingPool,
              hasSecurity: property?.characteristics?.hasSecurity,
              typeOfSecurity: property?.characteristics?.typeOfSecurity,
              locatedInCondominium:
                property?.characteristics?.locatedInCondominium,
              isFurnished: property?.characteristics?.isFurnished,
              hasBarbecueArea: property?.characteristics?.hasBarbecueArea,
              propertyTitle: property?.propertyTitle,
              propertyDescription: property?.propertyDescription,
            },
          },
          step3: {
            country: property?.address?.country,
            region: property?.address?.region,
            commune: property?.address?.commune,
            city: property?.address?.city,
            address: property?.address?.address,
            number: property?.address?.number,
            letter: property?.address?.letter,
            references: property?.address?.references,
          },
          step4: {
            isExchanged: property?.isExchanged,
            timeInExchange: {
              start: property?.timeInExchangeStart,
              end: property?.timeInExchangeEnd,
            },
            propertyDescriptionInExchange:
              property?.propertyDescriptionInExchange,
          },
        })
      }
    } catch (error) {
      if (error && isError) {
        throw new Error(error.message)
      }
    }
  }

  return (
    <div className="flex flex-col items-start justify-start text-start w-full overflow-y-scroll p-4">
      <form onSubmit={onSubmit}>
        <div className="mb-8">
          <div className="card card-border" role="presentation">
            <div className="card-body flex flex-col lg:flex-row items-center w-full gap-4">
              <div className="flex flex-col items-start justify-start text-start w-full">
                <div className="flex flex-col md:flex-row">
                  <h6>Activar esta propiedad en Canje</h6>
                  <div
                    className={`${
                      propertyData?.step4?.isExchanged
                        ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-100'
                        : 'bg-yellow-50 text-yellow-500 dark:bg-yellow-500/20 dark:text-emerald-100'
                    } tag flex justify-center items-center rounded-md border-0 mx-0 my-1 md:my-0 md:mx-2 w-20 text-center`}
                  >
                    <span className="uppercase">
                      {propertyData?.step4?.isExchanged ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <p className="text-gray-400">
                    Desea que la publicación este disponible para canje desde un
                    principio |{' '}
                    <span className="text-gray-700">activar aquí</span>.
                  </p>
                </div>
              </div>

              <FormItem>
                <Checkbox.Group>
                  <Checkbox
                    className="my-3"
                    checked={propertyData?.step4?.isExchanged}
                    onChange={(e) => {
                      setPropertyData({
                        ...propertyData,
                        step4: {
                          ...propertyData.step4,
                          isExchanged: e,
                        },
                      })
                    }}
                  >
                    Activar
                  </Checkbox>
                </Checkbox.Group>
              </FormItem>
            </div>
          </div>
        </div>

        <Button
          variant="solid"
          type="submit"
          className="m-2 absolute bottom-6 right-40"
          loading={isLoading}
        >
          {property?.isExchanged ? 'Deshabilitar' : 'Habilitar'}
        </Button>
      </form>
    </div>
  )
}
