import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import { HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi'
import { toggleView, useAppDispatch, useAppSelector } from '../store'

const ExternalServiceActionBar = () => {
    const dispatch = useAppDispatch()
    const view = useAppSelector((state) => state.serviceList.view)

    const onViewToggle = () => {
        dispatch(toggleView(view === 'grid' ? 'list' : 'grid'))
    }

    return (
        <div className="lg:flex items-center justify-between mb-4">
            <h3 className="mb-4 lg:mb-0">Servicios Externos</h3>
            <div className="flex flex-col md:flex-row md:items-center gap-1">
                <Tooltip
                    title={
                        view === 'grid'
                            ? 'Vista de lista'
                            : 'Vista en cuadrícula'
                    }
                    placement="top"
                >
                    <Button
                        className="flex"
                        variant="plain"
                        size="sm"
                        icon={
                            view === 'grid' ? (
                                <HiOutlineViewList />
                            ) : (
                                <HiOutlineViewGrid />
                            )
                        }
                        onClick={() => onViewToggle()}
                    />
                </Tooltip>
            </div>
        </div>
    )
}

export default ExternalServiceActionBar
