import { Avatar, Tooltip } from '@/components/ui'
import Dropdown from '@/components/ui/Dropdown'
import {
  FaHandshake,
  FaPaperPlane,
  FaRegLightbulb,
  FaToolbox,
  FaTools,
  FaUsers,
} from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { IoIosRocket, IoMdTrendingUp } from 'react-icons/io'
import { MdSupportAgent } from 'react-icons/md'
import { PiCompassToolBold } from 'react-icons/pi'
import { SiGooglebigquery } from 'react-icons/si'
import { TbHomeShare } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const renderToggle = (title: string, icon: React.ReactNode) => (
  <Tooltip title={title}>
    <div className="flex items-center cursor-pointer">
      <Avatar
        className="bg-lime-100 rounded-lg cursor-pointer text-lime-600 dark:bg-lime-500/20 dark:text-lime-100 hover:bg-lime-500/20"
        icon={icon}
      />
      <h6 className="text-sm font-bold ml-2 hidden 2xl:block">{title}</h6>
    </div>
  </Tooltip>
)

const dropdownData = [
  {
    title: 'Propiedades',
    icon: <HiOutlineBuildingOffice2 />,
    placement: 'bottom-left',
    items: [
      {
        key: 'properties',
        label: 'Mis Propiedades',
        path: '/mis-propiedades',
        icon: <HiOutlineBuildingOffice2 />,
      },
      {
        key: 'clients',
        label: 'Mis Clientes',
        path: '/clientes',
        icon: <FaUsers />,
      },
    ],
  },
/*   {
    title: 'Canjes',
    icon: <FaHandshake />,
    placement: 'bottom-center',
    items: [
      {
        key: 'client-box',
        label: 'Buzón de Clientes',
        path: '/procanje/buzon-de-clientes',
        icon: <FaHandshake />,
      },
      {
        key: 'properties-box',
        label: 'Buzón de Propiedades',
        path: '/procanje/buzon-de-propiedades',
        icon: <TbHomeShare />,
      },
    ],
  }, */
  {
    title: 'Oportunidades',
    icon: <IoMdTrendingUp />,
    placement: 'bottom-center',
    items: [
      /* {
        key: 'contact-request',
        label: 'Solicitud de Corredores',
        path: '/solicitudes-de-contacto',
        icon: <FaPaperPlane />,
      },
      {
        key: 'exchange-request',
        label: 'Solicitud de Canjes',
        path: '/gestion-de-solicitud-de-canjes/inbox',
        icon: <FaPaperPlane />,
      },
      {
        key: 'help',
        label: 'Solicitud de Servicios',
        path: '/gestion-de-solicitud-de-servicios/inbox',
        icon: <FaPaperPlane />,
      },
      {
        key: 'external-services',
        label: 'Servicios externos',
        path: '/servicios-externos',
        icon: <FaGear />,
      }, */
      {
        key: 'resources',
        label: 'Mis recursos',
        path: '/mis-recursos',
        icon: <FaToolbox />,
      },
      /* {
        key: 'ideas',
        label: 'Ideas Corredor',
        path: '/ideas-corredor',
        icon: <FaRegLightbulb />,
      }, */
    ],
  },

  /* {
    title: 'Crece con nosotros',
    icon: <IoIosRocket />,
    placement: 'bottom-center',
    items: [
      {
        key: 'campaign',
        label: 'Campaña publicitaria',
        path: '/potenciar/crear-campaña',
        icon: <SiGooglebigquery />,
      },
      {
        key: 'brand-design',
        label: 'Diseña tu marca',
        path: '/potenciar/diseñar-marca',
        icon: <FaTools />,
      },
      {
        key: 'brand-logo',
        label: 'Diseña tu web',
        path: '/potenciar/diseñar-web',
        icon: <PiCompassToolBold />,
      },
    ],
  }, */

  {
    title: 'Soporte',
    icon: <MdSupportAgent />,
    placement: 'bottom-end',
    items: [
      {
        key: 'support',
        label: 'Ayuda',
        path: '/ayuda',
        icon: <MdSupportAgent />,
      },
    ],
  },
]

const renderDropdownItems = (
  items: {
    key: string
    label: string
    path: string
    icon: JSX.Element
    placement?: string
  }[]
) =>
  items.map((item) => (
    <Dropdown.Item
      key={item.key}
      style={{ padding: '1.5rem' }}
      className="w-full py-4 flex items-center justify-start h-full"
    >
      <Link
        to={item.path}
        className="w-full h-full flex items-center justify-start"
      >
        <Avatar
          className="bg-lime-100 rounded-lg cursor-pointer text-lime-600 dark:bg-lime-500/20 dark:text-lime-100 hover:bg-lime-500/20"
          icon={item.icon}
        />
        <span className="ml-2 text-lime-600">{item.label}</span>
      </Link>
    </Dropdown.Item>
  ))

const QuickNavigation = () => {
  return (
    <div className="flex gap-5 flex-row w-full justify-center 2xl:justify-end">
      {dropdownData.map((dropdown, index) => (
        <Dropdown
          key={index}
          renderTitle={renderToggle(dropdown.title, dropdown.icon)}
          placement={dropdown.placement}
        >
          {renderDropdownItems(dropdown.items)}
        </Dropdown>
      ))}
    </div>
  )
}

export default QuickNavigation
