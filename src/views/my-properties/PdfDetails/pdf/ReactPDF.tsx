import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link
} from '@react-pdf/renderer';

interface OrdenDeVisitaPDFProps {
  nombre: string
  rut: string
  correo: string
  telefono: string
  propertyId: string
  propertyDirection: string
  propertyPrice: string
  propertyPriceCode: string
  propertyCity: string
  propertyRegion: string
  day: string
  month: string
  year: string
  hour: string
}

// Estilos
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 0,
    fontSize: 12,
    lineHeight: 1.5,
  },
  content: {
    paddingHorizontal: 50,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  logo: {
    width: 200,
    margin: '0 auto',
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    textDecoration: 'underline',
    fontFamily: 'Helvetica-Bold'
  },
  section: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  table: {
    width: '100%',
    border: '1px solid black',
    marginTop: 20,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    border: '1px solid black',
    paddingHorizontal: 4,
    textAlign: 'center',
    paddingVertical: 10,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
    width: '100%',
    height: 32, // opcional, si sabes la altura exacta
    padding: 0,
    margin: 0,
  },
  logoF: {
    width: '100%',
    height: 'auto',
  },
  signatureRow: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature: {
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    fontSize: 10,
    textAlign: 'left',
    marginTop: 10,
  },
});

// Documento
const OrdenDeVisitaPDF = ({ nombre, rut, correo, telefono, propertyId, propertyDirection, propertyPrice, propertyPriceCode, propertyCity,propertyRegion,day,month,year,hour }: OrdenDeVisitaPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View fixed style={styles.header}>
        <Image src="/img/pdf/ImagenHeader.jpg" style={styles.logo} />
      </View>
      <View style={styles.headerTitle}>
        <Text style={styles.title}>ORDEN DE VISITA</Text>
      </View>


      <View style={styles.content}>
        <View style={styles.section}>
          <Text>
            En {propertyCity}, {propertyRegion} a {day} de {month} de {year}, {hour}, don/doña {nombre}. Rut N.º {rut}, teléfono: {telefono}, correo electrónico: {correo}, en adelante el “Cliente” solicita visitar la propiedad que más adelante se singularizan por intermediación de “PULSO INVERSOR SPA”, Rut:77.312.362-4 <Text style={{ fontFamily: 'Helvetica-Bold' }}>{'(PROPIEDADES PULSO INVERSOR)'}</Text> domiciliada en Cerro el Plomo 5931 oficina 1707, Las Condes, Chile, en adelante el “ Corredor” la que se regirá por los siguientes términos, en adelante también la “Orden de Visita”
          </Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>Código</Text>
            <Text style={styles.cell}>Dirección</Text>
            <Text style={styles.cell}>Precio</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>{propertyId}</Text>
            <Text style={styles.cell}>{propertyDirection}</Text>
            <Text style={styles.cell}>{propertyPrice} {propertyPriceCode}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>PRIMERO:</Text> El Cliente declara que en caso de interesarse en una o más de estas propiedades, se obliga a encargar a PULSO INVERSOR SPA, Rut:77.312.362-4 <Text style={{ fontFamily: 'Helvetica-Bold' }}>{'(PROPIEDADES PULSO INVERSOR)'}</Text>, hacer los trámites pertinentes ante el propietario para comprarla o arrendarla. Asimismo, el cliente declara que esta oficina es la primera en ofrecer esta o estas propiedades y que cualquier gestión la realizará por su intermedio, obligándose a pagar una comisión del 2% más IVA, en caso de compra. Y en caso de arriendo una comisión de 50% del valor de un mes de arriendo más IVA , para contratos cuya duración sea inferior a 48 meses. En caso de ser un contrato igual o superior a 48 meses la comisión será de 2% más IVA, sobre la totalidad del flujo del contrato, cancelando ésta al firmar la Escritura de Compraventa o Contrato de Arrendamiento respectivo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>SEGUNDO:</Text> El cliente se obliga a pagar a PULSO INVERSOR SPA, Rut:77.312.362-4 <Text style={{ fontFamily: 'Helvetica-Bold' }}>{'(PROPIEDADES PULSO INVERSOR)'}</Text>, el doble de comisión correspondiente, como pena, si directa o indirectamente, procedente a la adquisición o arrendamiento prescindiendo en cualquier forma de la mediación de esta oficina; y /o si se compra o arrienda alguna de las propiedades aquí ofrecidas por un tercero, a quien le proporcione información o el uso de esta orden que es personal e intransferible.
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            El cliente declara, bajo juramento, que solicita y recibe esta orden para sí, su cónyuge o para la persona a quien señala el encabezamiento de este instrumento y contar con su autorización y encargo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>TERCERO:</Text> Cualquier duda o dificultad que surja entre las partes con motivo del presente contrato o de sus documentos complementarios o modificatorios, ya se refiera a su interpretación, cumplimiento, validez, terminación o cualquier otra causa relacionada con él, se resolverá mediante arbitraje, conforme al Reglamento Procesal de Arbitraje vigente del Centro de Arbitraje de la Cámara de Comercio de Santiago A.G. que formando parte integral de esta cláusula, las partes declaran conocer y aceptar. Las partes confieren mandato especial irrevocable a la Cámara de Comercio de Santiago A.G para que, a solicitud escrita de cualquiera de ellas, designe árbitro arbitrador de entre los integrantes del cuerpo arbitral del Centro de Arbitraje de esa Cámara. En contra de las resoluciones del árbitro no procederá recurso alguno, por lo cual las partes vienen a renunciar expresamente a ellos. El árbitro queda especialmente facultado para resolver todo asunto relacionado con su competencia y/o jurisdicción.
          </Text>
        </View>

        {/* Firmas */}
        <View style={styles.signatureRow}>
          <View style={styles.signature}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>....................................................</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>PULSO INVERSOR SPA</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>RUT: 77.312.362-4</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>{'(PROPIEDADES PULSO INVERSOR)'}</Text>
          </View>
          <View style={styles.signature}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>....................................................</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>CLIENTE</Text>
          </View>
        </View>
      </View>


      {/* Footer */}
      <View fixed style={styles.footer}>
        <Image src="/img/pdf/ImagenFooter.jpg" style={styles.logoF} />
      </View>
    </Page>
  </Document>
);

export default OrdenDeVisitaPDF;