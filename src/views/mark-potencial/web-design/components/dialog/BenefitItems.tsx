import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { HiFire } from 'react-icons/hi'

const data = [
  {
    id: 1,
    title: 'Diseño de Página Web Personalizado',
    description:
      'Creamos una página web profesional adaptada a tu estilo y necesidades, que refleje tu experiencia como corredor de propiedades.',
    status: 'Activo',
  },
  {
    id: 2,
    title: 'Optimización SEO para Corredores',
    description:
      'Diseñamos tu web con estrategias SEO que mejoran tu posicionamiento en buscadores, facilitando que potenciales clientes te encuentren fácilmente.',
    status: 'Activo',
  },
  {
    id: 3,
    title: 'Sitio Web Adaptado a Dispositivos Móviles',
    description:
      'Desarrollamos una web completamente responsive, optimizada para que tus clientes naveguen desde cualquier dispositivo sin perder calidad.',
    status: 'Activo',
  },
  {
    id: 4,
    title: 'Integración de Propiedades y Contacto',
    description:
      'Incluimos un sistema de gestión de propiedades y formularios de contacto para que puedas mostrar tus inmuebles y captar clientes directamente desde tu web.',
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
