import { Property } from '../../types'
import { formatArea, formatCLP } from '../../utils'
import {
  AreaIcon,
  BillIcon,
  ClockIcon,
  CompassIcon,
  ConditionIcon,
  FloorIcon,
} from '../ui/Icons'
import Section from '../ui/Section'
import StatItem from '../ui/StatItem'
import DescriptionSection from './DescriptionSection'
import FeaturesSection from './FeaturesSection'
import ImageGallery from './ImageGallery'
import LocationInMapSection from './LocationInMapSection'
// import ShareSection from './ShareSection'
import SidebarCard from './SidebarCard'
import TagsSection from './TagsSection'
import TitleSection from './TitleSection'

export const PropertyDetail: React.FC<{ property: Property }> = ({
  property,
}) => {
  const statsTop = [
    {
      label: 'Útil',
      value: formatArea(property.area_useful, property.unit),
      icon: <AreaIcon />,
    },
    {
      label: 'Total',
      value: formatArea(property.area_total, property.unit),
      icon: <AreaIcon />,
    },
    {
      label: 'Gastos Comunes',
      value: formatCLP(property.common_expenses),
      icon: <BillIcon />,
    },
    { label: 'Piso', value: property.floor ?? '—', icon: <FloorIcon /> },
    {
      label: 'Antigüedad',
      value: property.age != null ? `${property.age} años` : '—',
      icon: <ClockIcon />,
    },
    {
      label: 'Orientación',
      value: property.orientation || '—',
      icon: <CompassIcon />,
    },
    {
      label: 'Estado',
      value: property.condition || '—',
      icon: <ConditionIcon />,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title & Address */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TitleSection property={property} />
        </div>
      </div>

      {/* Media + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={property.images} />

          <Section title="Resumen">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {statsTop.map((s, i) => (
                <StatItem
                  key={i}
                  label={s.label}
                  value={s.value}
                  icon={s.icon}
                />
              ))}
            </div>
          </Section>

          {/* Description */}
          <DescriptionSection property={property} />

          {/* Features */}
          <FeaturesSection property={property} />

          {/* Location & Address */}
          <LocationInMapSection property={property} />

          {/* Tags */}
          <TagsSection property={property} />

          {/* Share action */}
          {/* <ShareSection property={property} /> */}
        </div>

        <div className="lg:col-span-1">
          {/* Sidebar */}
          <SidebarCard property={property} />
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
