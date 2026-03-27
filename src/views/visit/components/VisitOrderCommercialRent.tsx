import type { FC } from 'react'
import type { VisitOrderDocumentProps } from '../types/types'
import VisitOrderLayout from './VisitOrderLayout'

const VisitOrderCommercialRent: FC<VisitOrderDocumentProps> = (props) => {
  return (
    <VisitOrderLayout
      {...props}
      showCompanyFooter
      title="ORDEN DE VISITA PARA ARRENDAMIENTO COMERCIAL"
      priceLabel="Valor renta $/UF"
      companyFooter={
        <div className="text-sm leading-6">
          <p className="font-semibold">
            Sociedad Inversiones CVD SPA – Pulso Propiedades
          </p>
          <p>RUT 77.579.633-2</p>
          <p>
            Representante Legal: Felipe Rojas Tejo cédula de identidad
            15.641.470-0
          </p>
        </div>
      }
    >
      <p>
        El interesado declara haber visitado la propiedad por intermedio del
        Corredor de Propiedades don/ña ____________________________,
        comprometiéndose a efectuar toda transacción de la(s) propiedad(es)
        ofrecida(s) en esta orden por intermedio del Corredor individualizado y
        acepta expresamente lo siguiente:
      </p>

      <p>
        El interesado/a deberá pagar a Sociedad de Inversiones CVD SpA – Pulso
        Propiedades (en adelante la Empresa) por concepto de honorarios
        profesionales, el valor de 1 mes de renta más IVA por contratos de hasta
        3 años. En caso de arrendamientos a plazos superiores a 3 años, los
        honorarios profesionales serán de un 2% más IVA del total de rentas
        estipuladas en el período del contrato. Los honorarios señalados se
        pagarán al contado mediante transferencia al momento de la firma del
        contrato respectivo.
      </p>

      <p>
        En relación con la Ley 21.719 de Protección de Datos Personales, el
        firmante autoriza a la Empresa a revisar sus informes comerciales y
        financieros para postular al arriendo del inmueble indicado
        precedentemente. De no ser aceptada esta solicitud de arrendamiento,
        ésta debe eliminar de sus bases de datos la documentación entregada al
        cumplirse el plazo de quince días desde el envío.
      </p>

      <p>
        Esta orden es personal e intransferible; si proporcionare su uso o
        información a terceros, el firmante deberá pagar íntegra la comisión
        pactada. En el caso de concretar una operación comercial con terceros
        sin la participación del Corredor de Propiedades y/o la Empresa, deberá
        cancelar a ésta el doble de la comisión convenida.
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

export default VisitOrderCommercialRent
