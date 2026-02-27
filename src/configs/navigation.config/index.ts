import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'

const navigationConfig: NavigationTree[] = [
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
    key: 'calendar',
    path: '/mi-calendario',
    title: 'Calendario',
    translateKey: '',
    icon: 'calendar',
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
]

export default navigationConfig
