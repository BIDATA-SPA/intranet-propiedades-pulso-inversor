export type Brand = {
  id: number
  startCampaign: boolean
  priceRangeId:
    | { id: 'Hoy mismo'; name: 'Hoy mismo' }
    | {
        id: 'Dentro de 1 semana'
        name: 'Dentro de 1 semana'
      }
    | { id: 'Dentro de 1 mes'; name: 'Dentro de 1 mes' }
    | { id: 'Dentro de 2 meses'; name: 'Dentro de 2 meses' }
  startDateRangeId:
    | {
        id: 'Entre $25.000 a $50.000'
        name: 'Entre $25.000 a $50.000'
      }
    | {
        id: 'Entre $50.000 a $100.000'
        name: 'Entre $50.000 a $100.000'
      }
    | { id: 'Entre $100.000 a $150.000'; name: 'Entre $100.000 a $150.000' }
    | { id: 'Entre $150.000 a $200.000'; name: 'Entre $150.000 a $200.000' }
  toBeContacted: boolean
  meetingOption:
    | {
        id: 1
        name: 'Zoom'
      }
    | {
        id: 2
        name: 'Google Meet'
      }
    | {
        id: 3
        name: 'Microsoft Teams'
      }
    | {
        id: 4
        name: 'Discord'
      }
  meetingUrl: string
  serviceType: { id: 1; name: '' }
  meeting: Date // Fecha de encuentro entre admin y corredor para efectuar la solicitud, esta la establece el admin segun la opcion de inicio de campana que haya seleccionado el corredor
  status:
    | {
        id: 1
        name: 'Approved'
      }
    | {
        id: 2
        name: 'Pending'
      }
    | {
        id: 3
        name: 'Rejected'
      }
  user: {
    email: string
    phone: string
  }
  emailDetails: [] // los detalles del email una vez enviada la solicitud
  createdAt: Date | null
  updatedAt: Date | null
  deletedAt: Date | null
}
