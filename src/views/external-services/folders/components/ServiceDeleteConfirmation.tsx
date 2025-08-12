import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useAppDispatch } from '../../store'

const ServiceDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    // const dialogOpen = useAppSelector(
    //     (state) => state.serviceList.data.deleteConfirmation
    // )
    // const selectedProduct = useAppSelector(
    //     (state) => state.serviceList.data.selectedProduct
    // )
    // const tableData = useAppSelector(
    //     (state) => state.salesProductList.data.tableData
    // )

    const onDialogClose = () => {}

    const onDelete = async () => {
        // const success = await deleteProduct({ id: selectedProduct })
        // if (success) {
        //     dispatch(getProducts(tableData))
        //     toast.push(
        //         <Notification
        //             title={'Successfuly Deleted'}
        //             type="success"
        //             duration={2500}
        //         >
        //             Product successfuly deleted
        //         </Notification>,
        //         {
        //             placement: 'top-center',
        //         }
        //     )
        // }
    }

    return (
        <ConfirmDialog
            isOpen={false} // dialogOpen
            type="danger"
            title="Delete product"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Are you sure you want to delete this product? All record related
                to this product will be deleted as well. This action cannot be
                undone.
            </p>
        </ConfirmDialog>
    )
}

export default ServiceDeleteConfirmation
