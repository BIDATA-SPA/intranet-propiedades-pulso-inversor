import Tabs from '@/components/ui/Tabs'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import PropertiesContent from './dashboard-content/properties'

const { TabNav, TabList, TabContent } = Tabs

const tabItems = [
  {
    value: 'tab1',
    icon: <HiOutlineBuildingOffice2 />,
    disabled: false,
    children: 'Mis Propiedades',
  },
]

const tabNavItems = tabItems.map(({ value, icon, disabled, children }) => (
  <TabNav key={value} value={value} icon={icon} disabled={disabled}>
    {children}
  </TabNav>
))

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="tab1">
      <TabList>{tabNavItems}</TabList>

      <div className="p-4">
        <TabContent value="tab1">
          <PropertiesContent />
        </TabContent>
      </div>
    </Tabs>
  )
}

export default DashboardTabs
