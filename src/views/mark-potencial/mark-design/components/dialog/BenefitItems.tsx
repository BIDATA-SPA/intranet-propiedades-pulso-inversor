import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { HiFire } from 'react-icons/hi'

const data = [
  {
    id: 1,
    title: 'Logo Corporativo Profesional',
    description:
      'Te ayudamos a crear un logo distintivo que refleje tu identidad y genere confianza en tus clientes, garantizando una imagen moderna y profesional.',
    status: 'Activo',
  },
  {
    id: 2,
    title: 'Identidad Visual Personalizada',
    description:
      'Desarrollamos una paleta de colores y estilo visual coherente con tus valores y objetivos, diferenciándote de la competencia y creando una conexión emocional con tu público.',
    status: 'Activo',
  },
  {
    id: 3,
    title: 'Material Publicitario Adaptado',
    description:
      'Creación de flyers y banners adaptados a tu identidad visual, listos para usar en tus campañas, redes sociales o presentaciones comerciales.',
    status: 'Activo',
  },
  {
    id: 4,
    title: 'Logo Corporativo Potenciado en Redes Sociales',
    description:
      'Optimiza y amplifica tu logo en redes sociales con plantillas visuales personalizadas, aumentando tu visibilidad y profesionalismo en plataformas clave como Instagram, Facebook y LinkedIn.',
    status: 'Activo',
  },
]

const BenefitItems = () => {
  return (
    <div className="mb-8 px-2 h-[385px] overflow-y-scroll">
      <p className="mb-4">
        Crea una marca personal profesional con un logo impactante, identidad
        visual única y presencia potenciada en redes sociales, asegurando
        visibilidad y confianza en el mercado inmobiliario.
      </p>
      {data.map((benefit) => (
        <Card key={benefit.id} bordered className="mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <Avatar
                  className="bg-emerald-500"
                  shape="circle"
                  icon={<HiFire />}
                ></Avatar>
              </div>
              <div>
                <div className="flex items-center">
                  <h6>{benefit.title}</h6>
                  <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2">
                    <span className="capitalize">{benefit.status}</span>
                  </Tag>
                </div>
                <div>
                  <span>{benefit.description}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default BenefitItems
