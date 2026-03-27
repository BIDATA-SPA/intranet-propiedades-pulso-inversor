import type { FC } from 'react'
import type { VisitOrderDocumentProps } from '../types/types'
import VisitOrderLayout from './VisitOrderLayout'

const VisitOrderSale: FC<VisitOrderDocumentProps> = (props) => {
  return (
    <VisitOrderLayout
      {...props}
      title="ORDEN DE VISITA PARA COMPRAVENTA"
      priceLabel="Valor venta $/UF"
    >
      <p>
        El interesado declara haber visitado la propiedad por intermedio del
        Corredor de Propiedades don/ña ____________________________,
        comprometiéndose a efectuar toda transacción de la(s) propiedad(es)
        ofrecida(s) en esta orden por intermedio del Corredor individualizado y
        acepta expresamente lo siguiente:
      </p>

      <p>
        El interesado/a deberá pagar al Corredor por concepto de honorarios
        profesionales, la suma equivalente al 2% del precio de venta más IVA.
        Los honorarios señalados se pagarán mediante Vale Vista al momento de la
        firma de la Escritura de Compraventa. El mencionado instrumento quedará
        siempre en custodia del señor Notario respectivo, con instrucciones de
        entregar el Vale vista a su beneficiario, una vez acreditada la
        inscripción del dominio de la propiedad en el Conservador de Bienes
        Raíces respectivo, a nombre del comprador.
      </p>

      <p>
        Todas las obligaciones antes señaladas también se harán efectivas, en el
        caso que la compra la realicen el cónyuge, ascendientes o descendientes
        en línea directa y colaterales por consanguinidad hasta el segundo grado
        inclusive; sociedad de personas o capital en que el interesado tenga
        participación como accionista, socio o representante administrador; es
        decir, si proporcionare su uso o información a terceros, el firmante
        deberá pagar íntegra la comisión pactada. En el caso de concretar una
        operación comercial con terceros sin la participación del Corredor de
        Propiedades y/o la Empresa, deberá cancelar a ésta el doble de la
        comisión convenida.
      </p>

      <p>
        Cualquier dificultad que pueda surgir entre el firmante y la Empresa
        /Corredor de Propiedades con motivo de esta Orden de Visita, será
        resuelta por la justicia ordinaria. Para todos los efectos, las partes
        fijan su domicilio en la ciudad de Santiago y se someten a sus
        Tribunales de Justicia.
      </p>
    </VisitOrderLayout>
  )
}

export default VisitOrderSale
