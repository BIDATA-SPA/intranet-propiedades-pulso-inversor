import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { HiFire } from 'react-icons/hi'

const data = [
  {
    id: 1,
    title: 'Logo Inmobiliario de Impacto',
    description:
      'Diseñamos un logo que refleje tu profesionalismo y transmita confianza a compradores y vendedores, ayudándote a destacar como un corredor confiable.',
    status: 'Activo',
  },
  {
    id: 2,
    title: 'Identidad Visual para Corredores',
    description:
      'Creamos una identidad visual coherente con tus valores, que te diferencie en el mercado y genere una conexión sólida con tus clientes potenciales.',
    status: 'Activo',
  },
  {
    id: 3,
    title: 'Anuncios Inmobiliarios Personalizados',
    description:
      'Desarrollamos anuncios y material publicitario atractivo para promover propiedades y servicios en tus redes sociales y campañas online.',
    status: 'Activo',
  },
  {
    id: 4,
    title: 'Potenciación de Marca en Redes Sociales',
    description:
      'Optimiza tu presencia en redes sociales con plantillas adaptadas para mostrar propiedades y servicios, aumentando tu visibilidad y captando más leads.',
    status: 'Activo',
  },
]

const BenefitItems = () => {
  return (
    <div className="mb-8 px-2 h-[385px] overflow-y-scroll">
      <p className="mb-4">
        Lanzamos campañas de marketing personalizadas para optimizar la imagen
        de tu página web, impulsando tu presencia online y atrayendo más
        clientes.
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
