import { useAppSelector } from '../store'
import Item from './ToolsAndServicesItem'

const ToolsAndServicesList = ({ itemsList }) => {
  const view = useAppSelector((state) => state.toolsAndServices.view)

  return (
    <ul
      className={`${
        view === 'grid'
          ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'
          : view === 'list'
          ? 'grid-cols-1'
          : ''
      } grid gap-4 mt-4`}
    >
      {itemsList && itemsList.length > 0
        ? itemsList.map((item) => <Item key={item.id} item={item} />)
        : 'Crea una Carpeta de recursos'}
    </ul>
  )
}

export default ToolsAndServicesList
