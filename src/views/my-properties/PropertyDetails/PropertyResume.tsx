import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import { HiOutlineHome } from 'react-icons/hi'
import TabActivity from './tabs/TabActivity'
import TabDetails from './tabs/TabDetails'
import TabMaps from './tabs/TabMaps'

const { TabNav, TabList, TabContent } = Tabs

const PropertyResume = ({ data: property }) => {
  return (
    <Card className="w-full lg:w-[100%] border-t-4 border-t-sky-400 dark:border-t-sky-400">
      <Tabs defaultValue="tab1">
        <TabList>
          <TabNav value="tab1" icon={<HiOutlineHome />}>
            Detalles
          </TabNav>
          {/* <TabNav disabled value="tab2" icon={<FaMapMarkerAlt />}>
            En mapa
          </TabNav>
          <TabNav disabled value="tab3" icon={<MdHistory />}>
            Actividad
          </TabNav> */}
        </TabList>
        <div className="py-4">
          <TabContent value="tab1">
            <TabDetails property={property} />
          </TabContent>
          <TabContent value="tab2">
            <TabMaps />
          </TabContent>
          <TabContent value="tab3">
            <TabActivity />
          </TabContent>
        </div>
      </Tabs>
    </Card>
  )
}

export default PropertyResume
