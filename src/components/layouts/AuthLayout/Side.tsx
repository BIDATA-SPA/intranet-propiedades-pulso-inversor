import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import Segment from '@/components/ui/Segment'
import { APP_NAME } from '@/constants/app.constant'
import classNames from 'classnames'
import { cloneElement } from 'react'
import { HiCheckCircle } from 'react-icons/hi'
import { LuMailPlus } from 'react-icons/lu'
import { MdMarkEmailRead, MdPassword } from 'react-icons/md'
import { TbUserSquareRounded } from 'react-icons/tb'

interface SideProps extends CommonProps {
  content?: React.ReactNode
}

const segmentSelections = [
  {
    value: 'Registra tus datos',
    desc: 'Ingresa tu nombre, apellidos y teléfono celular.',
    disabled: false,
    icon: <TbUserSquareRounded />,
  },
  {
    value: 'Registra tu correo',
    desc: 'Ingresa un correo, recuerda que con este podras "Iniciar Sesión" en la aplicación.',
    disabled: false,
    icon: <LuMailPlus />,
  },
  {
    value: 'Crea y confirma tu Contraseña',
    desc: 'Debes crear una contraseña la cual sera necesaria para entrar al sistema Procanje, recuerda anotarla correctamente.',
    disabled: false,
    icon: <MdPassword />,
  },
  {
    value: 'Valida tu correo',
    desc: 'Se te enviará un correo para validar tu cuenta, de esta forma podras acceder sin problemas al sistema.',
    disabled: false,
    icon: <MdMarkEmailRead />,
  },
]

const Side = ({ children, content, ...rest }: SideProps) => {
  const urlWb = window.location.pathname

  const switchSideBackground = () => {
    switch (urlWb) {
      case '/crear-cuenta/cliente':
        return 'bg-gray-600'
      case '/crear-cuenta/':
        return 'bg-lime-600'
      default:
        return 'bg-lime-600'
    }
  }

  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className={classNames(
          switchSideBackground(),
          'py-6 px-16 flex-col justify-between hidden lg:flex'
        )}
      >
        <Logo
          mode="dark"
          imgClass="w-auto h-[4.1rem] max-h-[4.1rem] drop-shadow-2xl"
        />
        <div className="gap-3">
          {urlWb === '/iniciar-sesion' ? (
            <div className="mb-2">
              <h3 className="text-white font-bold text-center mb-2 md:text-2xl 2xl:text-3xl">
                Integrate hoy y se parte de la Comunidad
              </h3>
              <p className="text-white text-center font-medium">
                Participa y crea tu propia comunidad, donde podras forjar
                excelentes relaciones con colegas del mundo del corretaje.
              </p>
            </div>
          ) : (
            <Segment
              defaultValue={['Registra tus datos']}
              className="gap-2 flex-col mt-3"
            >
              {segmentSelections.map((item) => (
                <Segment.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {({ active, value, onSegmentItemClick, disabled }) => {
                    return (
                      <div
                        className={classNames(
                          'flex',
                          'ring-1',
                          'justify-between',
                          'border-2',
                          'rounded-md ',
                          'border-gray-300',
                          'py-5 px-4',
                          'cursor-pointer',
                          'select-none',
                          'w-100',
                          'md:w-[350px]',
                          '2xl:w-[500px]',
                          'max-w-[98%]',
                          'group',
                          active
                            ? 'ring-cyan-500 border-cyan-500 group-hover'
                            : 'ring-transparent',
                          disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:ring-cyan-500 hover:border-cyan-500'
                        )}
                        onClick={onSegmentItemClick}
                      >
                        <div className="text-gray-200 sm:w-72 2xl:w-[380px] max-w-2xl">
                          <div className="flex flex-row items-center gap-3">
                            <h4 className="text-gray-200">{value}</h4>
                            <p className="text-2xl group-hover:scale-125 duration-200">
                              {item.icon}
                            </p>
                          </div>

                          <p className="font-medium">{item.desc}</p>
                        </div>
                        {active && (
                          <HiCheckCircle className="text-gray-50 text-xl" />
                        )}
                      </div>
                    )
                  }}
                </Segment.Item>
              ))}
            </Segment>
          )}
        </div>
        <span className="text-white">
          Desarrollada por{' '}
          <a
            href="https://bidata.cl/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline font-bold"
          >
            BIDATA SPA
          </a>{' '}
          &copy; {`${new Date().getFullYear()}`}{' '}
          <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
        </span>
      </div>
      <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children
            ? cloneElement(children as React.ReactElement, {
                ...rest,
              })
            : null}
        </div>
      </div>
    </div>
  )
}

export default Side
