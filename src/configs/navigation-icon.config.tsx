import { FaCalendarDays, FaHandshake, FaUsers } from 'react-icons/fa6'
import { HiMiniRocketLaunch, HiOutlineBuildingOffice2 } from 'react-icons/hi2'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  properties: <HiOutlineBuildingOffice2 />,
  yo: <FaHandshake />,
  customers: <FaUsers />,
  calendar: <FaCalendarDays />,
  potencial: <HiMiniRocketLaunch />,
}

export default navigationIcon
