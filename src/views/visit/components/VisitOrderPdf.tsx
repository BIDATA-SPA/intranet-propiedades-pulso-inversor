// src/views/visit/components/VisitOrderPdf.tsx
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'

export interface VisitOrderPdfData {
  logoUrl: string
  orderNumber: string
  visitDate: string
  scheduledDate: string
  scheduledTime: string
  client: {
    name: string
    rut: string
    email: string
    phone: string
  }
  property: {
    code: string
    address: string
    commune: string
    city: string
    region: string
    operationType: string
    propertyType: string
    bedrooms?: string
    bathrooms?: string
    surfaceM2?: string
    price: string
    currency: string
  }
  detail: string
  images?: string[]
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingHorizontal: 32,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 9,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 4,
  },
  table: {
    borderWidth: 0.5,
    borderColor: '#000',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cellLabel: {
    width: 90,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#000',
    paddingHorizontal: 4,
    paddingVertical: 3,
    fontWeight: 700,
  },
  cellValue: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: '#000',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  detailText: {
    marginTop: 4,
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  imagesRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
  },
  image: {
    flex: 1,
    height: 80,
    objectFit: 'cover',
  },
  footerText: {
    marginTop: 16,
    fontSize: 8,
    textAlign: 'justify',
    lineHeight: 1.3,
  },
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  signatureBlock: {
    width: '45%',
    borderTopWidth: 0.5,
    borderColor: '#000',
    paddingTop: 4,
    fontSize: 9,
  },
  signatureLabel: {
    fontWeight: 700,
  },
})

interface Props {
  data: VisitOrderPdfData
}

const VisitOrderPdf = ({ data }: Props) => {
  const { client, property } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={data.logoUrl} />
          <View style={styles.headerRight}>
            <Text style={styles.title}>
              ORDEN DE VISITA Nº {data.orderNumber}
            </Text>
            <Text style={styles.subtitle}>Fecha {data.visitDate}</Text>
            <Text style={styles.subtitle}>
              Fecha Visita Programada {data.scheduledDate} a las{' '}
              {data.scheduledTime}
            </Text>
          </View>
        </View>

        {/* Datos cliente */}
        <Text style={styles.sectionTitle}>Señor (a):</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Nombre</Text>
            <Text style={styles.cellValue}>{client.name || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>RUT</Text>
            <Text style={styles.cellValue}>{client.rut || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Email</Text>
            <Text style={styles.cellValue}>{client.email || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Teléfono</Text>
            <Text style={styles.cellValue}>{client.phone || '—'}</Text>
          </View>
        </View>

        {/* Datos propiedad */}
        <Text style={styles.sectionTitle}>
          Tengo el agrado de enviar a usted la(s) siguiente(s) propiedad(es):
        </Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>CÓDIGO</Text>
            <Text style={styles.cellValue}>{property.code || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>DIRECCIÓN</Text>
            <Text style={styles.cellValue}>{property.address || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>COMUNA</Text>
            <Text style={styles.cellValue}>{property.commune || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>CIUDAD</Text>
            <Text style={styles.cellValue}>{property.city || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>REGIÓN</Text>
            <Text style={styles.cellValue}>{property.region || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>OPERACIÓN</Text>
            <Text style={styles.cellValue}>
              {property.operationType || '—'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>TIPO</Text>
            <Text style={styles.cellValue}>{property.propertyType || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>DORMITORIOS</Text>
            <Text style={styles.cellValue}>{property.bedrooms || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>BAÑOS</Text>
            <Text style={styles.cellValue}>{property.bathrooms || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>M2</Text>
            <Text style={styles.cellValue}>{property.surfaceM2 || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>VALOR</Text>
            <Text style={styles.cellValue}>
              {property.price || '—'} {property.currency || ''}
            </Text>
          </View>
        </View>

        {/* Detalle */}
        <Text style={styles.sectionTitle}>DETALLE</Text>
        <Text style={styles.detailText}>
          {data.detail || 'Sin observaciones adicionales.'}
        </Text>

        {/* Imágenes si existen */}
        {data.images && data.images.length > 0 && (
          <View style={styles.imagesRow}>
            {data.images.slice(0, 4).map((img, idx) => (
              <Image key={idx} src={img} style={styles.image} />
            ))}
          </View>
        )}

        {/* Texto legal / pie */}
        <Text style={styles.footerText}>
          Agradecemos su interés en nuestra gestión. Esta orden de visita es un
          documento de respaldo para el recorrido y evaluación de la(s)
          propiedad(es) indicada(s). La información contenida en este documento
          es referencial y puede estar sujeta a modificaciones.
        </Text>

        {/* Firmas */}
        <View style={styles.signaturesRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>{client.name || 'Cliente'}</Text>
            <Text>RUT: {client.rut || '—'}</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Corredor</Text>
            <Text>Pulso Propiedades</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default VisitOrderPdf
