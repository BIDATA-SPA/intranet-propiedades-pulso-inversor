/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors, FormikTouched } from 'formik'
import AmbientesCasaFields from './Casa/AmbientesFields'
import ComodidadesYEquipamiento from './Casa/ComodidadesYEquipamiento'
import FichaTecnica from './Casa/FichaTecnica'
import PrincipalCasaFields from './Casa/PrincipalFields'
import Seguridad from './Casa/Seguridad'
import Servicios from './Casa/Servicios'
import CollapsibleForm from './CollapsibleForm'

// DEPARTAMENTO
import AmbientesDepartamentoFields from './Departamento/AmbientesFields'
import ComodidadesYEquipamientoDepartamentoFields from './Departamento/ComodidadesYEquipamientoFields'
import CondicionesEspecialesDepartamentoFields from './Departamento/CondicionesEspecialesFields'
import EspaciosComunesDepartamentoFields from './Departamento/EspaciosComunesFields'
import FichaTecnicaDepartamentoFields from './Departamento/FichaTecnicaFields'
import OtrosDepartamentoFields from './Departamento/OtrosFields'
import PrincipalDepartamentoFields from './Departamento/PrincipalFields'
import SeguridadDepartamentoFields from './Departamento/SeguridadFields'
import ServiciosDepartamentoFields from './Departamento/ServiciosFields'

// PARCELA
import AmbientesParcelaFields from './Parcela/AmbientesFields'
import ComodidadesYEquipamientoParcelaFields from './Parcela/ComodidadesYEquipamientoFields'
import EspaciosComunesParcelaFields from './Parcela/EspaciosComunesFields'
import FichaTecnicaParcelaFields from './Parcela/FichaTecnicaFields'
import PrincipalParcelaFields from './Parcela/PrincipalFields'
import SeguridadParcelaFields from './Parcela/SeguridadFields'
import ServiciosParcelaFields from './Parcela/ServiciosFields'

// BODEGA
import ComodidadesYEquipamientoBodegaFields from './Bodega/ComodidadesYEquipamientoFields'
import FichaTecnicaBodegaFields from './Bodega/FichaTecnicaFields'
import PrincipalBodegaFields from './Bodega/PrincipalFields'
import SeguridadBodegaFields from './Bodega/SeguridadFields'
import ServiciosBodegaFields from './Bodega/ServiciosFields'

// OFICINA
import AmbientesOficinaFields from './Oficina/AmbientesFields'
import ComodidadesYEquipamientoOficinaFields from './Oficina/ComodidadesYEquipamientoOficinaFields'
import EspaciosComunesOficinaFields from './Oficina/EspaciosComunesOficinaFields'
import FichaTecnicaOficinaFields from './Oficina/FichaTecnica'
import PrincipalOficinaFields from './Oficina/PrincipalFields'
import SeguridadOficinaFields from './Oficina/SeguridadOficinaFields'
import ServiciosOficinaFields from './Oficina/ServiciosOficinaFields'

// ESTACIONAMIENTO
import FichaTecnicaEstacionamientoFields from './Estacionamiento/FichaTecnicaFields'
import PrincipalEstacionamientoFields from './Estacionamiento/PrincipalFields'
import SeguridadEstacionamientoFields from './Estacionamiento/SeguridadFields'

// TERRENO
import EspaciosComunesTerrenoFields from './Terreno/EspaciosComunes'
import FichaTecnicaTerrenoFields from './Terreno/FichaTecnicaFields'
import PrincipalTerrenoFields from './Terreno/PrincipalFields'
import SeguridadTerrenoFields from './Terreno/SeguridadFields'
import ServiciosTerrenoFields from './Terreno/ServiciosFields'

// INDUSTRIAL
import ComodidadesYEquipamientoIndustrialFields from './Industrial/ComodidadesYEquipamientoFields'
import FichaTecnicaIndustrialFields from './Industrial/FichaTecnicaFields'
import PrincipalIndustrialFields from './Industrial/PrincipalFields'
import SeguridadIndustrialFields from './Industrial/SeguridadFields'
import ServiciosIndustrialFields from './Industrial/ServiciosFields'

// LOCAL COMERCIAL
import AmbientesLocalComercialFields from './LocalComercial/AmbientesFields'
import ComodidadesYEquipamientoLocalComercialFields from './LocalComercial/ComodidadesYEquipamientoOficinaFields'
import FichaTecnicaLocalComercialFields from './LocalComercial/FichaTecnicaFields'
import PrincipalLocalComercialFields from './LocalComercial/PrincipalFields'
import SeguridadLocalComercialFields from './LocalComercial/SeguridadFields'
import ServiciosLocalComercialFields from './LocalComercial/ServiciosFields'

// AGRICOLA
import ComodidadesYEquipamientoAgricolaFields from './Agricola/ComodidadesYEquipamientoFields'
import FichaTecnicaAgricolaFields from './Agricola/FichaTecnicaFields'
import PrincipalAgricolaFields from './Agricola/PrincipalFields'
import ServiciosAgricolaFields from './Agricola/ServiciosFields'

export type PropertyType =
  | 'Casa'
  | 'Departamento'
  | 'Parcela'
  | 'Bodega'
  | 'Oficina'
  | 'Estacionamiento'
  | 'Terreno'
  | 'Industrial'
  | 'Local Comercial'
  | 'Agrícola'
  | 'Sitio' //⚠️
  | 'Departamento Amoblado' //⚠️
  | 'Casa Amoblada' //⚠️
  | 'Sepultura' //⚠️
  | string

export interface FieldNameProps<T> {
  typeOfPropertyId: PropertyType
  errors: FormikErrors<T>
  touched: FormikTouched<T>
  values?: any
}

const FormSwitcher = ({
  typeOfPropertyId = '',
  values,
  touched,
  errors,
}: FieldNameProps<any>) => {
  switch (typeOfPropertyId) {
    case 'Casa':
      return (
        <>
          <div className="my-2">
            <PrincipalCasaFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ambientes">
              <AmbientesCasaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamiento
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnica values={values} touched={touched} errors={errors} />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <Seguridad values={values} touched={touched} errors={errors} />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <Servicios values={values} touched={touched} errors={errors} />
            </CollapsibleForm>
          </div>
        </>
      )
    case 'Departamento':
      return (
        <>
          <div className="my-2">
            <PrincipalDepartamentoFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ambientes">
              <AmbientesDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamientoDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Condiciones Especiales">
              <CondicionesEspecialesDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Espacios Comunes">
              <EspaciosComunesDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Otros">
              <OtrosDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosDepartamentoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )

    case 'Parcela':
      return (
        <>
          <div className="my-2">
            <PrincipalParcelaFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ambientes">
              <AmbientesParcelaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamientoParcelaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Espacios Comunes">
              <EspaciosComunesParcelaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaParcelaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadParcelaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosParcelaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )

    case 'Bodega':
      return (
        <>
          <div className="my-2">
            <PrincipalBodegaFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamientoBodegaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaBodegaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadBodegaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosBodegaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )

    case 'Oficina':
      return (
        <>
          <div className="my-2">
            <PrincipalOficinaFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ambientes">
              <AmbientesOficinaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamientoOficinaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Espacios Comunes">
              <EspaciosComunesOficinaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaOficinaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadOficinaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosOficinaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )

    case 'Estacionamiento':
      return (
        <>
          <div className="my-2">
            <PrincipalEstacionamientoFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaEstacionamientoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadEstacionamientoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )

    case 'Terreno':
      return (
        <>
          <div className="my-2">
            <PrincipalTerrenoFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Espacios Comunes">
              <EspaciosComunesTerrenoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaTerrenoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadTerrenoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosTerrenoFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )

    case 'Industrial':
      return (
        <>
          <div className="my-2">
            <PrincipalIndustrialFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamientoIndustrialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaIndustrialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadIndustrialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosIndustrialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )

    case 'Local Comercial':
      return (
        <>
          <div className="my-2">
            <PrincipalLocalComercialFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ambientes">
              <AmbientesLocalComercialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamientoLocalComercialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaLocalComercialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Seguridad">
              <SeguridadLocalComercialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosLocalComercialFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )
    case 'Agrícola':
      return (
        <>
          <div className="my-2">
            <PrincipalAgricolaFields
              values={values}
              touched={touched}
              errors={errors}
            />
          </div>

          <div className="my-2">
            <CollapsibleForm title="Comodidades y Equipamiento">
              <ComodidadesYEquipamientoAgricolaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Ficha Técnica">
              <FichaTecnicaAgricolaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>

          <div className="my-2">
            <CollapsibleForm title="Servicios">
              <ServiciosAgricolaFields
                values={values}
                touched={touched}
                errors={errors}
              />
            </CollapsibleForm>
          </div>
        </>
      )
    default:
      break
  }
}

export default FormSwitcher
