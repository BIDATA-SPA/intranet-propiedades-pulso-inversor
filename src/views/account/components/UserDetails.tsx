import { Button, Card, Skeleton } from '@/components/ui'
import { useGetUserByIdQuery } from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import UserAvatarForm from './UserAvatarForm'
import UserForm from './UserForm'

const initialValues = {
  name: '',
  lastName: '',
  rut: '',
  dialCodeId: '',
  phone: '',
  webPage: '',
  about: '',
  companies: [],
  planId: null,
  address: {
    street: '',
    countryId: '',
    stateId: '',
    cityId: '',
  },
}

const UserDetails = () => {
  const [isEditingFields, setIsEditingFields] = useState(false)
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const [editingInitialValues, setEditingInitialValues] =
    useState(initialValues)
  const { data, isFetching } = useGetUserByIdQuery(userId, {
    refetchOnMountOrArgChange: true,
  })

  const formatDate = (date: Date | null, withTime = true) => {
    if (!date) return

    return withTime
      ? format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
      : format(new Date(date), 'dd-MM-yyyy')
  }

  useEffect(() => {
    if (data && !isFetching) {
      const lastPlanId = data.plan.at(-1)?.plan.id

      setEditingInitialValues({
        name: data?.name,
        lastName: data?.lastName,
        rut: data?.rut,
        phone: data?.phone,
        dialCodeId: data?.dialCode?.id, // data?.dialCode
        webPage: data?.webPage,
        about: data?.about,
        companies: data?.companies,
        planId: lastPlanId || null,
        address: {
          street: data?.address?.street ?? '',
          countryId: data?.address?.country?.id,
          stateId: data?.address?.internalDbState?.id, // ⚠️
          cityId: data?.address?.internalDbCity?.id, // ⚠️
        },
      })
    } else {
      setEditingInitialValues({
        name: '',
        lastName: '',
        rut: '',
        phone: '',
        dialCodeId: '',
        webPage: '',
        about: '',
        companies: [],
        planId: null,
        address: {
          street: '',
          countryId: '',
          stateId: '',
          cityId: '',
        },
      })
    }
  }, [data, isFetching])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>Mi Información</h3>
        <Button
          size="sm"
          variant="solid"
          color="sky-500"
          icon={<HiArrowLeft />}
          onClick={() => navigate('/')}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-4 h-full">
          <Card className="xl:w-[500px] xl:h-[120%]">
            <div className="flex flex-col xl:justify-between mx-auto ">
              <div className="flex flex-col items-center">
                {isFetching ? (
                  <Skeleton width={150} height={20} className="mt-2" />
                ) : (
                  <>
                    <h4 className="font-bold text-center text-gray-700 antialiased">
                      Corredor/a {data?.name} {data?.lastName}
                    </h4>
                    <UserAvatarForm data={data} />

                    {userAuthority === 2
                      ? data?.webPage && (
                          <a
                            href={data?.webPage}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            <span className="text-sky-500">{`${data?.webPage}`}</span>
                          </a>
                        )
                      : null}
                  </>
                )}
              </div>

              <div className="grid xl:grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 mt-8">
                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Nombre:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.name || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Apellido:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.lastName || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        RUT:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.rut || 'Por completar...'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Teléfono:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.phone || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Fecha de creación:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {!data?.createdAt
                          ? 'No definida.'
                          : formatDate(new Date(data?.createdAt), false) || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Fecha de actualización:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {!data?.updatedAt
                          ? 'No definida.'
                          : formatDate(new Date(data?.updatedAt), false) || '-'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <UserForm
              data={data}
              isEditingFields={isEditingFields}
              setIsEditingFields={setIsEditingFields}
              initialValues={editingInitialValues}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
