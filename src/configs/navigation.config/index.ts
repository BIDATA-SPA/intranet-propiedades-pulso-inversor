import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'

const navigationConfig: NavigationTree[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    translateKey: '',
    icon: 'dashboard',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: 'my-properties',
    path: '/mis-propiedades',
    title: 'Mis Propiedades',
    translateKey: '',
    icon: 'properties',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: 'customers',
    path: '/clientes',
    title: 'Clientes',
    translateKey: '',
    icon: 'customers',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: 'calendar',
    path: '/mi-calendario',
    title: 'Calendario',
    translateKey: '',
    icon: 'calendar',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: 'tools-and-services',
    path: '/mis-recursos',
    title: 'Mis recursos',
    translateKey: '',
    icon: 'toolsAndServices',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: 'support',
    path: '/ayuda',
    title: 'Ayuda',
    translateKey: '',
    icon: 'support',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
]

const navigationConfigCustomer: NavigationTree[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    translateKey: '',
    icon: 'dashboard',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
]

export default navigationConfig
export { navigationConfigCustomer }
