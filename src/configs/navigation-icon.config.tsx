import { BiHelpCircle } from 'react-icons/bi'
import { FaMailBulk, FaRegLightbulb } from 'react-icons/fa'
import {
  FaCalendarDays,
  FaHandshake,
  FaPeopleGroup,
  FaToolbox,
  FaUsers,
} from 'react-icons/fa6'
import {
  HiMiniRocketLaunch,
  HiOutlineBuildingOffice2,
  HiOutlineChartPie,
  HiOutlineCog8Tooth,
} from 'react-icons/hi2'
import { MdMarkunreadMailbox } from 'react-icons/md'
import { RiUserStarLine } from 'react-icons/ri'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  dashboard: <HiOutlineChartPie />,
  properties: <HiOutlineBuildingOffice2 />,
  yo: <FaHandshake />,
  aliedRealtor: <FaPeopleGroup />,
  customers: <FaUsers />,
  calendar: <FaCalendarDays />,
  potencial: <HiMiniRocketLaunch />,
  externalServices: <HiOutlineCog8Tooth />,
  toolsAndServices: <FaToolbox />,
  support: <BiHelpCircle />,
  realtorIdeas: <FaRegLightbulb />,
  buzon: <MdMarkunreadMailbox />,
  inbox: <FaMailBulk />,
  realtorReview: <RiUserStarLine />,
}

export default navigationIcon
