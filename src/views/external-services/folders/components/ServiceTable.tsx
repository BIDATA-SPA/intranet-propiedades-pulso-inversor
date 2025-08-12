import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import Avatar from '@/components/ui/Avatar'
import Dialog from '@/components/ui/Dialog'
import Tooltip from '@/components/ui/Tooltip'
import {
  useGetAllServicesByFolderQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useDialog } from '@/utils/useDialog'
import { useMemo, useRef, useState } from 'react'
import { FiPackage } from 'react-icons/fi'
import { TbUserShare } from 'react-icons/tb'
import { useParams } from 'react-router-dom'
import { dialogIds } from '../lib/placeholder-data'
import ContactFormDialog from './ContactFormDialog'
import ServiceDeleteConfirmation from './ServiceDeleteConfirmation'

type Service = {
  id: number
  name: string
  description: string
  email: string
  logo: string
  phone: string
  webPage: string
  owner: {
    id: 1
    companyDescription: string
    companyName: string
    ownerEmail: string
    ownerName: string
    ownerPhone: string
  }
}

const ActionColumn = ({ row }) => {
  const { data: user } = useGetMyInfoQuery({
    refetchOnMountOrArgChange: true,
  })
  const { textTheme } = useThemeClass()
  const { isDialogOpen, openDialog, onDialogClose } = useDialog()
  const [selectedService, setSelectedService] = useState(null)

  const onOpenDialog = (selectedRow) => {
    setSelectedService({
      ...selectedRow,
      realtorFrom: user?.session?.email,
    })
    openDialog(dialogIds.contactExternalService)
  }

  return (
    <>
      <div className="flex justify-center text-lg">
        <span
          className={`cursor-pointer p-2 hover:${textTheme}`}
          onClick={() => onOpenDialog(row)}
        >
          <Tooltip title="Gestionar solicitud de servicio">
            <TbUserShare className="cursor-pointer" />
          </Tooltip>
        </span>
      </div>

      <Dialog
        isOpen={isDialogOpen(dialogIds.contactExternalService)}
        width={650}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h4>Gestionar solicitud de servicio</h4>
        <div className="mt-4">
          <p className="my-3">
            Redacta un email para la solicitud de servicio de tus clientes.
          </p>
          <ContactFormDialog selectedService={selectedService} />
        </div>
      </Dialog>
    </>
  )
}

const ServiceColumn = ({ row }: { row: Service }) => {
  const avatar = row?.logo ? (
    <Avatar src={row?.logo} />
  ) : (
    <Avatar icon={<FiPackage />} />
  )

  return (
    <div className="flex items-center">
      {avatar}
      <span className={`ml-2 rtl:mr-2 font-semibold`}>
        {row?.name || 'No definido'}
      </span>
    </div>
  )
}

const ServiceTable = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const { folderId } = useParams()
  const { data, isLoading } = useGetAllServicesByFolderQuery({
    folderId,
    search: '',
    paginated: true,
    limit: 10,
    page: 1,
  })

  const columns: ColumnDef<Service>[] = useMemo(
    () => [
      {
        header: 'Servicio',
        accessorKey: 'service',
        cell: (props) => {
          const row = props.row.original
          return <ServiceColumn row={row} />
        },
      },
      {
        header: 'Empresa',
        accessorKey: 'company',
        cell: (props) => {
          const { companyName } = props.row.original.owner
          return (
            <span className="capitalize">{companyName || 'No definido'}</span>
          )
        },
      },
      {
        header: 'Teléfono/Celular',
        accessorKey: 'ownerPhone',
        cell: (props) => {
          const { ownerPhone } = props.row.original.owner
          return (
            <span className="capitalize">{ownerPhone || 'No definido'}</span>
          )
        },
      },
      {
        header: 'Correo electrónico',
        accessorKey: 'ownerEmail',
        cell: (props) => {
          const { ownerEmail } = props.row.original.owner
          return (
            <span className="capitalize">{ownerEmail || 'No definido'}</span>
          )
        },
      },
      {
        header: 'Valor del servicio',
        accessorKey: 'value',
        cell: () => {
          return <span>{`No definido`}</span>
        },
      },
      {
        header: 'Acciones',
        id: 'action',
        cell: (props) => <ActionColumn row={props.row.original} />,
      },
    ],
    []
  )

  return (
    <>
      {!data?.data && data?.data?.length === 0 ? (
        <span>Esta carpeta no cuenta con servicios disponibles.</span>
      ) : (
        <>
          <DataTable
            ref={tableRef}
            columns={columns}
            data={data}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ className: 'rounded-md' }}
            loading={isLoading}
            // pagingData={{
            //     total: tableData.total as number,
            //     pageIndex: tableData.pageIndex as number,
            //     pageSize: tableData.pageSize as number,
            // }}
            // onPaginationChange={onPaginationChange}
            // onSelectChange={onSelectChange}
            // onSort={onSort}
          />
          <ServiceDeleteConfirmation />
        </>
      )}
    </>
  )
}

export default ServiceTable
