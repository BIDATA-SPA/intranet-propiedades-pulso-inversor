import Drawer from '@/components/ui/Drawer'
import RealtorInfo from './RealtorInfo'

const DrawerContent = ({ matches, currentProperty }) => {
  const renderedItems =
    matches && matches?.length > 0 ? (
      matches?.map((realtor, index) => (
        <RealtorInfo
          key={index}
          realtor={realtor}
          currentProperty={currentProperty}
        />
      ))
    ) : (
      <p className="w-full text-center">
        Esta oportunidad aún no cuenta con propiedades en match.
      </p>
    )

  return <ul className="gap-2">{renderedItems}</ul>
}

const DrawerComponent = ({
  isOpen,
  onDrawerClose,
  customerSearchMatches,
  currentProperty,
}) => {
  return (
    <Drawer
      title={
        customerSearchMatches?.length === 0
          ? 'Sin resultados'
          : `Corredores encontrados (${customerSearchMatches.length})`
      }
      isOpen={isOpen}
      onClose={onDrawerClose}
      onRequestClose={onDrawerClose}
    >
      <DrawerContent
        matches={customerSearchMatches}
        currentProperty={currentProperty}
      />
    </Drawer>
  )
}

export default DrawerComponent
