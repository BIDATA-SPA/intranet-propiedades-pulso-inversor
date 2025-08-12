import {
  default as imgLogo1,
  default as imgLogo2,
  default as imgLogo3,
  default as imgLogo4,
} from '@/assets/img/avatars/generic-user.jpg'
import { GrBus, GrConfigure, GrDeliver, GrKey } from 'react-icons/gr'

export const DataExternalServices = [
  {
    id: 1,
    icon: <GrKey className="text-gray-950 dark:text-gray-200 text-2xl mt-2" />,
    CantContact: 3,
    NameFolder: 'Cerrajeria',
    DescripFolder:
      'Apertura de puertas de autos, muebles y edificios cuyas llaves se han extraviado. apertura de puertas relativamente elásticas sin llave, especialmente tratándose de vehículos; reparación y mantenimiento de cerraduras, cerrojos y candados',
    CustomersAssigns: {
      children: [
        {
          id: 1,
          iconCustomer: imgLogo1,
          nameCustomer: 'Mark Zuckerber',
        },
        {
          id: 2,
          iconCustomer: imgLogo2,
          nameCustomer: 'Alexis',
        },
        {
          id: 3,
          iconCustomer: imgLogo4,
          nameCustomer: 'Nicolas Schurman',
        },
      ],
    },
  },
  {
    id: 2,
    icon: (
      <GrDeliver className="text-gray-950 dark:text-gray-200 text-2xl mt-2" />
    ),
    CantContact: 5,
    NameFolder: 'Mudanza',
    DescripFolder:
      'Empaquetado y traslado del contenido de hogares y oficinas de una ubicación a otra. Sus tareas incluyen el empaquetamiento del contenido de hogares u oficinas, incluidos los objetos como vajillas de porcelana y cristalerías.',
    CustomersAssigns: {
      children: [
        {
          id: 1,
          iconCustomer: imgLogo3,
          nameCustomer: 'Dua lipa',
        },
        {
          id: 2,
          iconCustomer: imgLogo2,
          nameCustomer: 'Alexis',
        },
        {
          id: 3,
          iconCustomer: imgLogo1,
          nameCustomer: 'Mark Zuckerber',
        },
      ],
    },
  },
  {
    id: 3,
    icon: (
      <GrConfigure className="text-gray-950 dark:text-gray-200 text-2xl mt-2" />
    ),
    CantContact: 4,
    NameFolder: 'Gasfiteria',
    DescripFolder:
      'instalación y mantenimiento de redes de tuberías para el abastecimiento de agua potable y evacuación de aguas residuales, así como las instalaciones de calefacción en edificaciones y otras construcciones.',
    CustomersAssigns: {
      children: [
        {
          id: 1,
          iconCustomer: imgLogo3,
          nameCustomer: 'Dua lipa',
        },
        {
          id: 2,
          iconCustomer: imgLogo2,
          nameCustomer: 'Alexis',
        },
        {
          id: 3,
          iconCustomer: imgLogo1,
          nameCustomer: 'Mark Zuckerber',
        },
      ],
    },
  },
  {
    id: 4,
    icon: <GrBus className="text-gray-950 dark:text-gray-200 text-2xl mt-2" />,
    CantContact: 2,
    NameFolder: 'Transporte',
    DescripFolder:
      'Ofrecemos el mejor servicio de traslado en autos blindados en categoría lujo. Contáctanos',
    CustomersAssigns: {
      children: [
        {
          id: 1,
          iconCustomer: imgLogo3,
          nameCustomer: 'Dua lipa',
        },
        {
          id: 2,
          iconCustomer: imgLogo2,
          nameCustomer: 'Alexis',
        },
        {
          id: 3,
          iconCustomer: imgLogo4,
          nameCustomer: 'Nicolas Schurman',
        },
      ],
    },
  },
  {
    id: 5,
    icon: <GrBus className="text-gray-950 dark:text-gray-200 text-2xl mt-2" />,
    CantContact: 2,
    NameFolder: 'Transporte',
    DescripFolder:
      'Ofrecemos el mejor servicio de traslado en autos blindados en categoría lujo. Contáctanos',
    CustomersAssigns: {
      children: [
        {
          id: 1,
          iconCustomer: imgLogo3,
          nameCustomer: 'Dua lipa',
        },
        {
          id: 2,
          iconCustomer: imgLogo2,
          nameCustomer: 'Alexis',
        },
        {
          id: 3,
          iconCustomer: imgLogo4,
          nameCustomer: 'Nicolas Schurman',
        },
      ],
    },
  },
  {
    id: 6,
    icon: <GrBus className="text-gray-950 dark:text-gray-200 text-2xl mt-2" />,
    CantContact: 2,
    NameFolder: 'Transporte',
    DescripFolder:
      'Ofrecemos el mejor servicio de traslado en autos blindados en categoría lujo. Contáctanos',
    CustomersAssigns: {
      children: [
        {
          id: 1,
          iconCustomer: imgLogo3,
          nameCustomer: 'Dua lipa',
        },
        {
          id: 2,
          iconCustomer: imgLogo2,
          nameCustomer: 'Alexis',
        },
        {
          id: 3,
          iconCustomer: imgLogo4,
          nameCustomer: 'Nicolas Schurman',
        },
      ],
    },
  },
]

export const userOwner = [
  {
    id: 1,
    accountUserName: 'Owner Services',
    avatar: imgLogo1,
    NameEmp: 'Facebook',
    DescripEmp: 'lorem ipsun aead fasaw wadasa',
    OwnEmpName: 'Mark Zuckerberg',
    OwnEmpEmail: 'Mark@gmail.com',
    OwnEmpPhone: 98223122,
    Valor: 12,
  },
  {
    id: 2,
    accountUserName: 'Owner Services',
    avatar: imgLogo2,
    NameEmp: 'Twitter',
    DescripEmp: 'lorem ipsun aead fasaw wadasa',
    OwnEmpName: 'Elon Musk',
    OwnEmpEmail: 'Elon@gmail.com',
    OwnEmpPhone: 98223122,
    Valor: 12,
  },
  {
    id: 3,
    accountUserName: 'Owner Services',
    avatar: imgLogo3,
    NameEmp: 'Facebook',
    DescripEmp: 'lorem ipsun aead fasaw wadasa',
    OwnEmpName: 'Marko Leon',
    OwnEmpEmail: 'Marko@gmail.com',
    OwnEmpPhone: 98223122,
    Valor: 12,
  },
  {
    id: 4,
    accountUserName: 'Owner Services',
    avatar: imgLogo4,
    NameEmp: 'Facebook',
    DescripEmp: 'lorem ipsun aead fasaw wadasa',
    OwnEmpName: 'Samira assar',
    OwnEmpEmail: 'Samira@gmail.com',
    OwnEmpPhone: 98223122,
    Valor: 12,
  },
]

export const userCustomer = [
  {
    id: 1,
    accountUserName: 'Customer',
    avatar: imgLogo2,
    CustName: 'Maria noma',
    CustEmail: 'Maria@gmail.com',
    CustPhone: 98223122,
  },
  {
    id: 2,
    accountUserName: 'Customer ',
    avatar: imgLogo3,
    CustName: 'Mariano Klose',
    CustEmail: 'Mariano@gmail.com',
    CustPhone: 98223122,
  },
  {
    id: 3,
    accountUserName: 'Customer',
    avatar: imgLogo1,
    CustName: 'Dua lipa',
    CustEmail: 'Dua@gmail.com',
    CustPhone: 98223122,
  },
  {
    id: 4,
    accountUserName: 'Customer',
    avatar: imgLogo4,
    CustName: 'Alexis',
    CustEmail: 'alexis@gmail.com',
    CustPhone: 98223122,
  },
]
