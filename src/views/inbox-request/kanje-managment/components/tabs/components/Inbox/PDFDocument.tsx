import { formatDate } from '@/utils/formatDate'
import { stripHtml } from '@/utils/stripHTML'
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

// Estilos personalizados que emulan Tailwind CSS en @react-pdf/renderer
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  logo: {
    width: 150,
    height: 35,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 1.5,
    marginBottom: 10,
    textAlign: 'left',
  },
  listItem: {
    marginBottom: 10,
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signatureBlock: {
    width: '45%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    paddingBottom: 10,
  },
  signatureImage: {
    width: 50,
    height: 50,
  },
  signatureText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  smallText: {
    fontSize: 10,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecoration: 'underline',
  },
})

const PDFDocument = ({ emailInfo }) => {
  const latestContract = emailInfo?.contract?.[emailInfo?.contract?.length - 1]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo */}
        <Image style={styles.logo} src="/img/logo/logo-light-full.png" />

        {/* Título */}
        <Text style={styles.title}>Orden de Canje</Text>

        {/* Contenido del Contrato */}
        <Text style={styles.bodyText}>
          {`En Santiago, a ${new Date().toLocaleDateString()}, entre don ${
            emailInfo?.realtorOwner?.name
          } ${emailInfo?.realtorOwner?.lastName}, cédula de identidad Nº ${
            emailInfo?.realtorOwner?.rut || 'No definido'
          }, con domicilio en ${
            emailInfo?.realtorOwner?.address?.city || ''
          }, ${emailInfo?.realtorOwner?.address?.state || ''}, comuna de ${
            emailInfo?.realtorOwner?.address?.city || ''
          }, en
          adelante denominado "Propietario de Canje", y por otra parte ${
            emailInfo?.requestingRealtor?.name
          } ${emailInfo?.requestingRealtor?.lastName}, cédula de identidad N° ${
            emailInfo?.requestingRealtor?.rut || 'No definido'
          }, con domicilio en ${
            emailInfo?.requestingRealtor?.address?.city || ''
          }, ${emailInfo?.requestingRealtor?.address?.state || ''}, comuna de ${
            emailInfo?.requestingRealtor?.address?.city || ''
          }, denominado en adelante "Solicitante de Canje".`}
        </Text>

        {/* Cláusulas del Contrato */}
        <Text style={[styles.bodyText, styles.bold]}>Primera:</Text>
        <Text style={styles.bodyText}>
          Las partes acuerdan realizar el canje del corretaje de la(s)
          siguiente(s) propiedad(es):{' '}
          {emailInfo?.property?.propertyTitle || 'No definido'},{' '}
          {stripHtml(emailInfo?.property?.propertyDescription) || 'No definido'}
          .
        </Text>

        <Text style={[styles.bodyText, styles.bold]}>Segunda:</Text>
        <Text style={styles.bodyText}>
          El Corredor declara que posee las órdenes de venta en exclusividad de
          la/s propiedades mencionadas anteriormente.
        </Text>

        <Text style={[styles.bodyText, styles.bold]}>Tercera:</Text>
        <Text style={styles.bodyText}>
          El Solicitante, mediante el Corredor propietario de canje, se
          compromete a visitar las propiedades y a realizar todas las
          negociaciones y suscripción de contratos pertinentes a través de su
          intermedio.
        </Text>

        <Text style={[styles.bodyText, styles.bold]}>Cuarta:</Text>
        <Text style={styles.bodyText}>
          El plazo de esta orden de canje será a partir del{' '}
          {formatDate(emailInfo?.property?.timeInExchangeStart)} hasta{' '}
          {formatDate(emailInfo?.property?.timeInExchangeEnd)}, contando desde
          la fecha de emisión de esta orden.
        </Text>

        <Text style={[styles.bodyText, styles.bold]}>Quinta:</Text>
        <Text style={styles.bodyText}>
          En caso de que el canje entre las partes se realice con éxito, los
          honorarios de corretaje se establecerán de la siguiente manera: El
          Corredor Propietario establecerá una comisión de{' '}
          {`${latestContract?.ownerAmount}`} sobre el valor final de la
          transacción, mientras que el Corredor Solicitante acordará una
          comisión de {`${latestContract?.applicantAmount}`}.
        </Text>

        {/* Sección de Firmas */}
        <View style={styles.signatureContainer}>
          {latestContract?.ownerSignature && (
            <View style={styles.signatureBlock}>
              <Image
                style={styles.signatureImage}
                src="/img/contracts/check.png"
              />
              <Text style={styles.signatureText}>Firmado</Text>
              <Text style={styles.signatureText}>
                {`${emailInfo?.realtorOwner?.name} ${emailInfo?.realtorOwner?.lastName}`}
              </Text>
              <Text style={styles.smallText}>
                {formatDate(latestContract?.ownerSignatureDate)}
              </Text>
            </View>
          )}
          {latestContract?.applicantSignature && (
            <View style={styles.signatureBlock}>
              <Image
                style={styles.signatureImage}
                src="/img/contracts/check.png"
              />
              <Text style={styles.signatureText}>Firmado</Text>
              <Text style={styles.signatureText}>
                {`${emailInfo?.requestingRealtor?.name} ${emailInfo?.requestingRealtor?.lastName}`}
              </Text>
              <Text style={styles.smallText}>
                {formatDate(latestContract?.applicantSignatureDate)}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Página 1 de 1</Text>
      </Page>
    </Document>
  )
}

export default PDFDocument

// import { formatThousands } from '@/utils/formatCurrency'
// import { formatDate } from '@/utils/formatDate'
// import {
//   Document,
//   Image,
//   Link,
//   Page,
//   StyleSheet,
//   Text,
//   View,
// } from '@react-pdf/renderer'

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#FFFFFF',
//     padding: 30,
//     fontFamily: 'Helvetica',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     textDecoration: 'underline',
//     margin: 10,
//   },
//   titleSign: {
//     fontSize: 14,
//     fontWeight: 'normal',
//     textAlign: 'center',
//     textDecoration: 'none',
//     margin: 10,
//   },
//   bodyText: {
//     fontSize: 12,
//     marginBottom: 10,
//   },
//   strongFont: {
//     fontSize: 12,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
//   listItem: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   header: {
//     fontSize: 16,
//     marginTop: 10,
//     marginBottom: 5,
//     fontWeight: 'bold',
//   },
//   signature: {
//     marginTop: 15,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   text: {
//     fontSize: 10,
//   },
//   signatureContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   signatureBlock: {
//     alignItems: 'center',
//     margin: 10,
//   },
//   signatureImage: {
//     width: 50,
//     height: 50,
//   },
//   signatureText: {
//     marginTop: 6,
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   gridColumn: {
//     width: '50%',
//     padding: 10,
//   },
//   image: {
//     width: 150,
//     height: 35,
//     marginBottom: 10,
//   },
//   footer: {
//     marginTop: 20,
//     fontSize: 12,
//     textAlign: 'center',
//     borderTopWidth: 2,
//     borderTopColor: '#d3d3d3',
//     borderTopStyle: 'solid',
//     paddingTop: 5,
//   },
//   underline: {
//     textDecoration: 'underline',
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
// })

// const PDFDocument = ({ emailInfo }) => {
//   const latestContract = emailInfo?.contract?.[emailInfo?.contract?.length - 1]

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <Image style={styles.image} src="/img/logo/logo-light-full.png" />
//         <Text style={styles.title}>ORDEN DE CANJE</Text>
//         <Text style={styles.bodyText}>
//           En Santiago, a {new Date().toLocaleDateString()}, entre don
//           {emailInfo?.realtorOwner?.name} {emailInfo?.realtorOwner?.lastName},
//           cédula nacional de {'chilena'}, identidad N° {'X'}{' '}
//           {emailInfo?.realtorOwner?.rut ?? 'No definido'}, domicilio en{' '}
//           {emailInfo?.realtorOwner?.address?.city ?? 'No definido'}, comuna de{' '}
//           {emailInfo?.realtorOwner?.address?.state ?? 'No definido'}, en
//           adelante <span style={styles.strongFont}>{'El Corredor'}</span>, y por
//           la otra parte,{' '}
//           <span style={styles.strongFont}>
//             {'Patrimonio Inmobiliario Dos Limitada'}
//           </span>
//           , Rol Unico Tributario {'N° 76.467.871'}, representada por{' '}
//           {'Emersson Xavier Ricardo Toloza Meza'}, cédula nacional de identidad{' '}
//           {'N° 14.144.425-7'}, ambos con domicilio en {'General Flores N° 83'},{' '}
//           {'Comuna de Providencia, Ciudad de Santiago;'} ambos comparecientes
//           son mayores de edad, quienes acreditaron sus identidades con sus
//           respectivas cédulas de identidad y exponen que han convenido en
//           celebrar el presente contrato de{' '}
//           <strong className="uppercase">Orden de canje</strong>, que se regirá
//           exclusivamente por las cláusulas que a continuación se indican:
//         </Text>

//         {/* Agrega aquí más textos y secciones según tu contenido */}
//         <View style={styles.bodyText}>
//           <Text style={styles.bold}>PRIMERO:</Text>
//           <Text>
//             {' '}
//             Las partes acuerdan que se efectuará Canje en el Corretaje de la(s)
//             siguiente(s) Propiedad(es):
//           </Text>
//         </View>
//         <View style={styles.bodyText}>
//           <Text style={styles.bold}>SEGUNDO:</Text>
//           <Text>
//             {' '}
//             El Corredor declara que tiene las órdenes de venta en exclusividad
//             de las propiedades individualizadas anteriormente.
//           </Text>
//         </View>

//         <View style={styles.bodyText}>
//           <Text style={styles.bold}>TERCERO:</Text>
//           <Text>
//             {' '}
//             PATRIMONIO INMOBILIARIO DOS LIMITADA declara que por medio de EL
//             CORREDOR, visitará el o los inmuebles antes señalados y se
//             compromete a realizar todas las negociaciones, acuerdos y
//             suscripción de contratos pertinentes por su intermedio.
//           </Text>
//         </View>

//         <View style={styles.bodyText}>
//           <Text style={styles.bold}>CUARTO:</Text>
//           <Text>
//             {' '}
//             Las partes acuerdan que los honorarios de corretaje correspondientes
//             se cobrarán y percibirán de la siguiente manera: PATRIMONIO
//             INMOBILIARIO DOS LIMITADA cobrará a la parte{' '}
//             {`$${formatThousands(latestContract?.ownerAmount)}`} y EL CORREDOR
//             COBRARÁ A LA PARTE{' '}
//             {`$${formatThousands(latestContract?.applicantAmount)}`}.
//           </Text>
//         </View>

//         <View style={styles.bodyText}>
//           <Text style={styles.bold}>QUINTO:</Text>
//           <Text>
//             {' '}
//             El plazo de esta orden de canje será de 50 días hábiles, a contar de
//             la fecha de emisión de esta orden.
//           </Text>
//         </View>

//         {/* Sección de Firmas */}
//         <View style={styles.signatureContainer}>
//           {latestContract?.ownerSignature && (
//             <View style={styles.signatureBlock}>
//               <Image
//                 style={styles.signatureImage}
//                 src="/img/contracts/check.png"
//               />
//               <Text style={styles.signatureText}>Firmado</Text>
//               <Text style={styles.signatureText}>
//                 {emailInfo?.realtorOwner?.name}
//               </Text>
//             </View>
//           )}

//           {latestContract?.applicantSignature && (
//             <View style={styles.signatureBlock}>
//               <Image
//                 style={styles.signatureImage}
//                 src="/img/contracts/check.png"
//               />
//               <Text style={styles.signatureText}>Firmado</Text>
//               <Text style={styles.signatureText}>
//                 {emailInfo?.requestingRealtor?.name}
//               </Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.titleSign}>
//           <Text>Fecha de acuerdo</Text>
//           <Text> {formatDate(latestContract?.applicantSignatureDate)}</Text>
//         </View>

//         <Text style={styles.footer}>
//           <Link src="http://www.procanje.com/">www.procanje.com</Link>
//         </Text>
//       </Page>
//     </Document>
//   )
// }

// export default PDFDocument
