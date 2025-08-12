import { Tooltip } from '@/components/ui'
import Button from '@/components/ui/Button'
import { RootState } from '@/store'
import { toggleViewMode } from '@/views/my-properties/store/propertyListSlice'
import { HiPlusCircle, HiViewList } from 'react-icons/hi'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PropertyFilter from './PropertyFilter'

const PropertiesTableTools = () => {
  const dispatch = useDispatch()

  const viewMode = useSelector(
    (state: RootState) => state.propertiesList.data.viewMode
  )

  const handleToggleView = () => {
    dispatch(toggleViewMode())
  }

  return (
    <>
      <Tooltip title={viewMode === 'list' ? 'Lista' : 'Grilla'}>
        <Button
          size="sm"
          icon={viewMode === 'list' ? <HiViewList /> : <HiOutlineSquares2X2 />}
          onClick={handleToggleView}
        ></Button>
      </Tooltip>

      <PropertyFilter />

      <Link
        className="block lg:inline-block md:mb-0 mb-4"
        to="/mis-propiedades/crear-propiedad"
      >
        <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
          Nueva Propiedad
        </Button>
      </Link>
    </>
  )
}

export default PropertiesTableTools
