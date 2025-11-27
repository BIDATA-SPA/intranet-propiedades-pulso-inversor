export const dashboardData = {
  scheduleData: [
    {
      id: '0',
      time: '10:00am',
      eventName: 'Reunión con Cliente',
      desciption: 'Vía Zoom',
      type: 'meeting',
    },
    {
      id: '1',
      time: '1:00pm',
      eventName: 'Actualizar información de contacto',
      desciption: 'Vía app',
      type: 'task',
    },
    {
      id: '2',
      time: '3:00pm',
      eventName: 'Solicitar Propiedad en Canje a Corredor/a',
      desciption: 'Tarea diaria',
      type: 'task',
    },
    {
      id: '3',
      time: '3:00pm',
      eventName: 'Solicitar Propiedad en Canje a Corredor/a',
      desciption: 'Tarea diaria',
      type: 'task',
    },
    {
      id: '4',
      time: '3:00pm',
      eventName: 'Solicitar Propiedad en Canje a Corredor/a',
      desciption: 'Tarea diaria',
      type: 'task',
    },
    {
      id: '5',
      time: '3:00pm',
      eventName: 'Solicitar Propiedad en Canje a Corredor/a',
      desciption: 'Tarea diaria',
      type: 'task',
    },
  ],

  customerData: {
    totalCustomers: {
      nameTitle: 'Clientes activos',
      value: 30,
      path: '/clientes',
      growShrink: 1.2,
    },
    newCustomers: {
      nameTitle: 'Nuevos clientes',
      value: 9,
      path: '/clientes',
      growShrink: 4.3,
    },
  },

  customerDataGlobal: {
    totalCustomers: {
      nameTitle: 'Total oportunidad de cliente',
      value: 30,
      growShrink: 1.2,
    },
    activeCustomers: {
      nameTitle: 'Oportunidad de cliente nuevas',
      value: 25,
      growShrink: -3.7,
    },
    newCustomers: {
      nameTitle: 'Oportunidade cliente activa',
      value: 9,
      growShrink: 4.3,
    },
  },

  propertyData: {
    totalProperties: {
      nameTitle: 'Total de propiedades creadas',
      value: 76,
      path: '/mis-propiedades',
      growShrink: 17.2,
    },
    newProperties: {
      nameTitle: 'Nuevas propiedades creadas',
      value: 9,
      path: '/mis-propiedades',
      growShrink: -2.3,
    },
  },
  propertyDataGlobal: {
    totalProperties: {
      nameTitle: 'Total propiedades en Canje',
      value: 136,
      growShrink: 17.2,
    },
  },

  divisesData: {
    totalCustomers: { divName: 'UF', value: 36.891, growShrink: 17.2 },
    activeCustomers: { divName: 'UTM', value: 64.343, growShrink: 32.7 },
    newCustomers: { divName: 'USD', value: 957.55, growShrink: -2.3 },
  },
}
