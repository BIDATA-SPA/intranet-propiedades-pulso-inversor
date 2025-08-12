import { Button } from '@/components/ui'
import {
  useGetCustomerSearchByIdQuery,
  useUpdateCustomerSearchRefreshMutation,
} from '@/services/RtkQueryService'
import { useToast } from '@/views/my-properties/hooks/use-toast'
import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { GrUpdate } from 'react-icons/gr'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import FormCustomerSearch from './FormCustomerSearch'

const DetailsCustomerSearch = () => {
  const { customerSearchId } = useParams()
  const navigate = useNavigate()
  const { openNotification } = useToast()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editingInitialValues, setEditingInitialValues] = useState({
    bathrooms: '',
    bedrooms: '',
    address: {
      street: '',
      countryId: '',
      stateId: '',
      cityId: '',
      number: '',
      letter: '',
      references: '',
    },
    currencyId: '',
    hasParking: false,
    hasSecurity: false,
    hasSwimmingPool: false,
    id: '',
    locatedInCondominium: false,
    maxPrice: 0,
    minPrice: 0,
    region: '',
    typeOfOperationId: '',
    typeOfPropertyId: '',
  })
  const { data, isFetching } = useGetCustomerSearchByIdQuery(customerSearchId, {
    refetchOnMountOrArgChange: true,
  })
  const [updateCustomerSearchRefresh, { isLoading, isUninitialized }] =
    useUpdateCustomerSearchRefreshMutation()

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        bathrooms: data?.bathrooms,
        bedrooms: data?.bedrooms,
        currencyId: data?.currencyId,
        hasParking: data?.hasParking,
        hasSecurity: data?.hasSecurity,
        hasSwimmingPool: data?.hasSwimmingPool,
        id: data?.id,
        locatedInCondominium: data?.locatedInCondominium,
        maxPrice: data?.maxPrice,
        minPrice: data?.minPrice,
        region: data?.region,
        typeOfOperationId: data?.typeOfOperationId,
        typeOfPropertyId: data?.typeOfPropertyId,
        customer: {
          id: data?.customer?.id,
          name: data?.customer?.name,
          lastName: data?.customer?.lastName,
        },
        address: {
          address: data?.address,
          countryId: data?.country?.id,
          stateId: data?.state?.id, // ⚠️
          cityId: data?.city?.id, // ⚠️
          number: '',
          letter: '',
          references: '',
        },
      })
    } else {
      setEditingInitialValues({
        bathrooms: '',
        bedrooms: '',
        currencyId: '',
        hasParking: false,
        hasSecurity: false,
        hasSwimmingPool: false,
        id: '',
        locatedInCondominium: false,
        maxPrice: 0,
        minPrice: 0,
        region: '',
        typeOfOperationId: '',
        typeOfPropertyId: '',
        customer: {
          id: '',
          name: '',
          lastName: '',
        },
        address: {
          address: '',
          number: '',
          letter: '',
          references: '',
          countryId: '',
          stateId: '',
          cityId: '',
        },
      })
    }
  }, [data, isFetching])

  const onSubmit = async () => {
    try {
      const response = await updateCustomerSearchRefresh({
        id: customerSearchId,
      })

      openNotification({
        title: `Matches actualizados correctamente`,
        content: <FaCheck className="text-green-500" />,
        duration: 0,
      })

      if (response && isUninitialized) {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
        navigate('/procanje/buzon-de-clientes')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return (
    <div className="rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 flex-col lg:flex-row">
        <div>
          <h3>Actualizar Oportunidad</h3>
          <p>Actualiza una oportunidad de búsqueda para clientes.</p>
        </div>

        <div className="flex gap-2 my-4 md:my-0">
          <Button
            size="sm"
            variant="solid"
            color="green-500"
            icon={<GrUpdate />}
            loading={isLoading}
            onClick={() => onSubmit()}
          >
            Actualizar matches
          </Button>

          <Button
            size="sm"
            variant="solid"
            color="sky-500"
            icon={<HiArrowLeft />}
            onClick={() => navigate('/procanje/buzon-de-clientes')}
          >
            Regresar
          </Button>
        </div>
      </div>

      {/* CUSTOMER SEARCH FORM UPDATE */}
      <FormCustomerSearch
        isEditingFields={isEditingFields}
        setIsEditingFields={setIsEditingFields}
        initialValues={editingInitialValues}
      />
    </div>
  )
}

export default DetailsCustomerSearch
