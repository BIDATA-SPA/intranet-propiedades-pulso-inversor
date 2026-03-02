/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useMemo, useState } from 'react'
import * as Yup from 'yup'

import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

import type { PortalFindParams } from '@/services/portal/portalPublication'

type Opt = { value: string; label: string }

type Props = {
  value: PortalFindParams
  onChange: (next: PortalFindParams) => void
  onReset?: () => void
  className?: string
  compact?: boolean
}

/** === Opciones de selects === */
const optListing: Opt[] = [
  { value: 'venta', label: 'Venta' },
  { value: 'arriendo', label: 'Arriendo' },
]
const optProperty: Opt[] = [
  { value: 'departamento', label: 'Departamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'local', label: 'Local' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'parcela', label: 'Parcela' },
  { value: 'terreno', label: 'Terreno' },
]
const optStatus: Opt[] = [
  { value: 'available', label: 'Disponible' },
  { value: 'inactive', label: 'Inactiva' },
  { value: 'reserved', label: 'Reservada' },
  { value: 'sold', label: 'Vendida' },
]
const optCurrency: Opt[] = [
  { value: 'CLP', label: 'CLP' },
  { value: 'UF', label: 'UF' },
  { value: 'USD', label: 'USD' },
]
const optUnit: Opt[] = [{ value: 'mt2', label: 'm²' }]
const optOrientation: Opt[] = [
  { value: 'N', label: 'N' },
  { value: 'NE', label: 'NE' },
  { value: 'E', label: 'E' },
  { value: 'SE', label: 'SE' },
  { value: 'S', label: 'S' },
  { value: 'SO', label: 'SO' },
  { value: 'O', label: 'O' },
  { value: 'NO', label: 'NO' },
]
const optCondition: Opt[] = [
  { value: 'new', label: 'Nuevo' },
  { value: 'used', label: 'Usado' },
]

/** === Helpers === */
const toNum = (v: unknown): number | undefined => {
  if (v === '' || v === null || v === undefined) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
const clean = (obj: Record<string, any>) => {
  const out: Record<string, any> = {}
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (typeof v === 'string' && v.trim() === '') return
    out[k] = v
  })
  return out
}
const ensureRange = (min?: number, max?: number) => {
  if (min === undefined && max === undefined) return {}
  if (min !== undefined && max !== undefined && min > max) {
    return { min: max, max: min }
  }
  return { min, max }
}

/** === Modelo del formulario (usamos Date para los DatePicker) === */
type FormModel = {
  portal: string | null
  listing_type: string | null
  property_type: string | null
  status: string | null
  currency: string | null
  unit: string | null
  orientation: string | null
  condition: string | null

  code: string
  external_url: string

  price_clp_min?: number | ''
  price_clp_max?: number | ''
  price_uf_min?: number | ''
  price_uf_max?: number | ''

  area_useful_min?: number | ''
  area_useful_max?: number | ''
  area_total_min?: number | ''
  area_total_max?: number | ''

  bedrooms_min?: number | ''
  bedrooms_max?: number | ''
  bathrooms_min?: number | ''
  bathrooms_max?: number | ''
  parking_min?: number | ''
  parking_max?: number | ''

  city: string
  commune: string
  region: string
  neighborhood: string

  published_at_from: Date | null
  published_at_to: Date | null
  scraped_at_from: Date | null
  scraped_at_to: Date | null

  age_min?: number | ''
  age_max?: number | ''

  consolidated_id: string
  consolidated_status: string
}

const schema = Yup.object().shape({
  // no obligatorios; validaciones leves si quieres
  external_url: Yup.string()
    .nullable()
    .notRequired()
    .url('Debe ser una URL válida.'),
})

/** Mapea PortalFindParams -> FormModel */
function paramsToForm(value: PortalFindParams): FormModel {
  const toDate = (iso?: string | null) => (iso ? new Date(iso) : null)

  return {
    portal: (value.portal as string) ?? null,
    listing_type: (value.listing_type as string) ?? null,
    property_type: (value.property_type as string) ?? null,
    status: (value.status as string) ?? null,
    currency: (value.currency as string) ?? null,
    unit: (value.unit as string) ?? null,
    orientation: (value.orientation as string) ?? null,
    condition: (value.condition as string) ?? null,

    code: value.code ?? '',
    external_url: value.external_url ?? '',

    price_clp_min: value.price_clp_min ?? '',
    price_clp_max: value.price_clp_max ?? '',
    price_uf_min: value.price_uf_min ?? '',
    price_uf_max: value.price_uf_max ?? '',

    area_useful_min: value.area_useful_min ?? '',
    area_useful_max: value.area_useful_max ?? '',
    area_total_min: value.area_total_min ?? '',
    area_total_max: value.area_total_max ?? '',

    bedrooms_min: value.bedrooms_min ?? '',
    bedrooms_max: value.bedrooms_max ?? '',
    bathrooms_min: value.bathrooms_min ?? '',
    bathrooms_max: value.bathrooms_max ?? '',
    parking_min: value.parking_min ?? '',
    parking_max: value.parking_max ?? '',

    city: value.city ?? '',
    commune: value.commune ?? '',
    region: value.region ?? '',
    neighborhood: value.neighborhood ?? '',

    published_at_from: toDate(value.published_at_from),
    published_at_to: toDate(value.published_at_to),
    scraped_at_from: toDate(value.scraped_at_from),
    scraped_at_to: toDate(value.scraped_at_to),

    age_min: value.age_min ?? '',
    age_max: value.age_max ?? '',

    consolidated_id: value.consolidated_id ?? '',
    consolidated_status: value.consolidated_status ?? '',
  }
}

/** Mapea FormModel -> PortalFindParams (limpia, normaliza, ISO fechas) */
function formToParams(
  values: FormModel,
  base: PortalFindParams
): PortalFindParams {
  const d2iso = (d: Date | null | undefined) =>
    d ? d.toISOString() : undefined

  // normalización de rangos
  const clp = ensureRange(
    toNum(values.price_clp_min),
    toNum(values.price_clp_max)
  )
  const uf = ensureRange(toNum(values.price_uf_min), toNum(values.price_uf_max))
  const au = ensureRange(
    toNum(values.area_useful_min),
    toNum(values.area_useful_max)
  )
  const at = ensureRange(
    toNum(values.area_total_min),
    toNum(values.area_total_max)
  )
  const bed = ensureRange(
    toNum(values.bedrooms_min),
    toNum(values.bedrooms_max)
  )
  const bath = ensureRange(
    toNum(values.bathrooms_min),
    toNum(values.bathrooms_max)
  )
  const park = ensureRange(toNum(values.parking_min), toNum(values.parking_max))
  const age = ensureRange(toNum(values.age_min), toNum(values.age_max))

  const next: PortalFindParams = clean({
    // mantener paginación externa pero reseteando página
    page: 1,
    page_size: base.page_size ?? 10,
    portal: values.portal ?? null,
    listing_type: values.listing_type ?? null,
    property_type: values.property_type ?? null,
    status: values.status ?? null,
    currency: values.currency ?? null,
    unit: values.unit ?? null,
    orientation: values.orientation ?? null,
    condition: values.condition ?? null,
    code: values.code || null,
    external_url: values.external_url || null,
    price_clp_min: clp.min,
    price_clp_max: clp.max,
    price_uf_min: uf.min,
    price_uf_max: uf.max,

    area_useful_min: au.min,
    area_useful_max: au.max,
    area_total_min: at.min,
    area_total_max: at.max,

    bedrooms_min: bed.min,
    bedrooms_max: bed.max,
    bathrooms_min: bath.min,
    bathrooms_max: bath.max,
    parking_min: park.min,
    parking_max: park.max,

    city: values.city || null,
    commune: values.commune || null,
    region: values.region || null,
    neighborhood: values.neighborhood || null,

    published_at_from: d2iso(values.published_at_from),
    published_at_to: d2iso(values.published_at_to),
    scraped_at_from: d2iso(values.scraped_at_from),
    scraped_at_to: d2iso(values.scraped_at_to),

    age_min: age.min,
    age_max: age.max,

    consolidated_id: values.consolidated_id || null,
    consolidated_status: values.consolidated_status || null,
  })

  return next
}

const PortalFiltersBar: React.FC<Props> = ({
  value,
  onChange,
  onReset,
  className,
  compact,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const initialValues = useMemo(
    () => paramsToForm(value || {}),
    [JSON.stringify(value)]
  )

  // layout
  const gridBasic = compact
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  const gridAdvanced = compact
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'

  return (
    <div
      className={`rounded-xl border p-4 dark:border-gray-700 ${
        className ?? ''
      }`}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(vals) => {
          const next = formToParams(vals, value || {})
          onChange(next)
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          resetForm,
          isSubmitting,
        }) => (
          <Form>
            <FormContainer>
              <div className="mb-2">
                <h4 className="text-sm font-semibold">Filtros Básicos</h4>
              </div>
              <div className={`grid gap-3 ${gridBasic}`}>
                {/* Portal */}
                {/* <FormItem label="Portal">
                  <Field name="portal">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        isClearable
                        field={field}
                        form={form}
                        options={PORTAL_OPTIONS as Opt[]}
                        value={
                          (PORTAL_OPTIONS as Opt[]).find(
                            (o) => o.value === values.portal
                          ) || null
                        }
                        onChange={(opt: Opt | null) =>
                          setFieldValue(field.name, opt?.value ?? null)
                        }
                      />
                    )}
                  </Field>
                </FormItem> */}

                {/* Tipo de Operación */}
                <FormItem label="Tipo de Operación">
                  <Field name="listing_type">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        isClearable
                        placeholder="Seleccionar..."
                        field={field}
                        form={form}
                        options={optListing}
                        value={
                          optListing.find(
                            (o) => o.value === values.listing_type
                          ) || null
                        }
                        onChange={(opt: Opt | null) =>
                          setFieldValue(field.name, opt?.value ?? null)
                        }
                      />
                    )}
                  </Field>
                </FormItem>

                {/* Tipo de Inmueble */}
                <FormItem label="Tipo de Inmueble">
                  <Field name="property_type">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        isClearable
                        placeholder="Seleccionar..."
                        field={field}
                        form={form}
                        options={optProperty}
                        value={
                          optProperty.find(
                            (o) => o.value === values.property_type
                          ) || null
                        }
                        onChange={(opt: Opt | null) =>
                          setFieldValue(field.name, opt?.value ?? null)
                        }
                      />
                    )}
                  </Field>
                </FormItem>

                {/* Estado */}
                <FormItem label="Estado">
                  <Field name="status">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        isClearable
                        placeholder="Seleccionar..."
                        field={field}
                        form={form}
                        options={optStatus}
                        value={
                          optStatus.find((o) => o.value === values.status) ||
                          null
                        }
                        onChange={(opt: Opt | null) =>
                          setFieldValue(field.name, opt?.value ?? null)
                        }
                      />
                    )}
                  </Field>
                </FormItem>

                {/* Moneda */}
                <FormItem label="Moneda">
                  <Field name="currency">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        isClearable
                        placeholder="Seleccionar..."
                        field={field}
                        form={form}
                        options={optCurrency}
                        value={
                          optCurrency.find(
                            (o) => o.value === values.currency
                          ) || null
                        }
                        onChange={(opt: Opt | null) =>
                          setFieldValue(field.name, opt?.value ?? null)
                        }
                      />
                    )}
                  </Field>
                </FormItem>

                {/* Código */}
                <FormItem label="Código">
                  <Field name="code">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Input field={field} form={form} placeholder="Ej: 168" />
                    )}
                  </Field>
                </FormItem>

                {/* URL externa */}
                <FormItem
                  label="URL externa"
                  invalid={Boolean(errors.external_url && touched.external_url)}
                  errorMessage={errors.external_url as string}
                >
                  <Field name="external_url">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Input
                        field={field}
                        form={form}
                        placeholder="https://…"
                      />
                    )}
                  </Field>
                </FormItem>

                {/* Unidad */}
                <FormItem label="Unidad">
                  <Field name="unit">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        isClearable
                        placeholder="Seleccionar..."
                        field={field}
                        form={form}
                        options={optUnit}
                        value={
                          optUnit.find((o) => o.value === values.unit) || null
                        }
                        onChange={(opt: Opt | null) =>
                          setFieldValue(field.name, opt?.value ?? null)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
              </div>

              {/* ======= Toggle Avanzados ======= */}
              <div className="flex items-center justify-between mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="!px-3"
                  onClick={() => setShowAdvanced((s) => !s)}
                >
                  {showAdvanced ? 'Ocultar avanzados' : 'Más filtros'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="plain"
                    onClick={() => {
                      resetForm()
                      onChange({ page: 1, page_size: value.page_size ?? 10 })
                      onReset?.()
                    }}
                  >
                    Limpiar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    variant="solid"
                    loading={isSubmitting}
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </div>

              {/* ======= Avanzados ======= */}
              {showAdvanced && (
                <div className="mt-4">
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold">Filtros Avanzados</h4>
                  </div>

                  {/* Precios */}
                  <div className={`grid gap-3 ${gridAdvanced}`}>
                    <FormItem label="Precio CLP min">
                      <Field name="price_clp_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="0"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Precio CLP max">
                      <Field name="price_clp_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="100000000"
                          />
                        )}
                      </Field>
                    </FormItem>

                    <FormItem label="Precio UF mín">
                      <Field name="price_uf_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="0"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Precio UF máx">
                      <Field name="price_uf_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="5000"
                          />
                        )}
                      </Field>
                    </FormItem>

                    {/* Superficies */}
                    <FormItem label="Útil min (m²)">
                      <Field name="area_useful_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="100"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Útil max (m²)">
                      <Field name="area_useful_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="500"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Total min (m²)">
                      <Field name="area_total_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="550"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Total max (m²)">
                      <Field name="area_total_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="600"
                          />
                        )}
                      </Field>
                    </FormItem>

                    {/* Dorms / Baños / Est */}
                    <FormItem label="Dorms min">
                      <Field name="bedrooms_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="1"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Dorms máx">
                      <Field name="bedrooms_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="3"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Baños mín">
                      <Field name="bathrooms_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="1"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Baños máx">
                      <Field name="bathrooms_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="3"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Estac. mín">
                      <Field name="parking_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="1"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Estac. máx">
                      <Field name="parking_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="3"
                          />
                        )}
                      </Field>
                    </FormItem>

                    {/* Ubicación */}
                    <FormItem label="Ciudad">
                      <Field name="city">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            field={field}
                            form={form}
                            placeholder="Santiago"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Comuna">
                      <Field name="commune">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            field={field}
                            form={form}
                            placeholder="Las Condes"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Región">
                      <Field name="region">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            field={field}
                            form={form}
                            placeholder="Metropolitana de Santiago"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Barrio">
                      <Field name="neighborhood">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input field={field} form={form} />
                        )}
                      </Field>
                    </FormItem>

                    {/* Fechas */}
                    <FormItem label="Publicada desde">
                      <Field name="published_at_from">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <DatePicker
                            placeholder="Seleccionar fecha..."
                            field={field}
                            form={form}
                            value={values.published_at_from}
                            onChange={(d) => form.setFieldValue(field.name, d)}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Publicada hasta">
                      <Field name="published_at_to">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <DatePicker
                            placeholder="Seleccionar fecha..."
                            field={field}
                            form={form}
                            value={values.published_at_to}
                            onChange={(d) => form.setFieldValue(field.name, d)}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Scrape desde">
                      <Field name="scraped_at_from">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <DatePicker
                            field={field}
                            form={form}
                            value={values.scraped_at_from}
                            placeholder="Seleccionar fecha..."
                            onChange={(d) => form.setFieldValue(field.name, d)}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Scrape hasta">
                      <Field name="scraped_at_to">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <DatePicker
                            field={field}
                            form={form}
                            value={values.scraped_at_to}
                            placeholder="Seleccionar fecha..."
                            onChange={(d) => form.setFieldValue(field.name, d)}
                          />
                        )}
                      </Field>
                    </FormItem>

                    {/* Edad / Orientación / Condición */}
                    <FormItem label="Antiguedad mín">
                      <Field name="age_min">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="2005"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Antiguedad max">
                      <Field name="age_max">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            type="number"
                            field={field}
                            form={form}
                            placeholder="2024"
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Orientación">
                      <Field name="orientation">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Select
                            isClearable
                            field={field}
                            form={form}
                            options={optOrientation}
                            value={
                              optOrientation.find(
                                (o) => o.value === values.orientation
                              ) || null
                            }
                            onChange={(opt: Opt | null) =>
                              setFieldValue(field.name, opt?.value ?? null)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Condición">
                      <Field name="condition">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Select
                            isClearable
                            field={field}
                            form={form}
                            options={optCondition}
                            value={
                              optCondition.find(
                                (o) => o.value === values.condition
                              ) || null
                            }
                            onChange={(opt: Opt | null) =>
                              setFieldValue(field.name, opt?.value ?? null)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>

                    {/* Consolidación */}
                    <FormItem label="Consolidación ID">
                      <Field name="consolidated_id">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input field={field} form={form} />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Estado de Consolidación">
                      <Field name="consolidated_status">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input field={field} form={form} />
                        )}
                      </Field>
                    </FormItem>
                  </div>

                  {/* Acciones inferiores en avanzados */}
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="plain"
                      onClick={() => {
                        resetForm()
                        onChange({ page: 1, page_size: value.page_size ?? 10 })
                        onReset?.()
                      }}
                    >
                      Limpiar
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      variant="solid"
                      loading={isSubmitting}
                    >
                      Aplicar filtros
                    </Button>
                  </div>
                </div>
              )}
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PortalFiltersBar

// /* eslint-disable react-hooks/exhaustive-deps */
// import type { Select as SelectType } from '@/@types/select'
// import Select from '@/components/ui/Select'
// import { PortalFindParams } from '@/services/portal/portalPublication'
// import classNames from 'classnames'
// import React, { useEffect, useState } from 'react'

// type Props = {
//   /** Filtros actuales (valores efectivos que se están usando en la query) */
//   value: PortalFindParams
//   /** Se dispara al presionar “Aplicar filtros” con los valores validados/limpios */
//   onChange: (next: PortalFindParams) => void
//   /** Limpia filtros a estado base y dispara onChange */
//   onReset?: () => void
//   className?: string
//   compact?: boolean
// }

// /** Helpers */
// const toNum = (v: string): number | null => {
//   if (v === '' || v === null || v === undefined) return null
//   const n = Number(v)
//   return Number.isFinite(n) ? n : null
// }
// const clean = (obj: Record<string, any>) => {
//   const out: Record<string, any> = {}
//   Object.entries(obj).forEach(([k, v]) => {
//     if (v === undefined || v === null) return
//     if (typeof v === 'string' && v.trim() === '') return
//     out[k] = v
//   })
//   return out
// }

// /** Opciones fijas del portal (puedes externalizarlas si quieres) */
// const optListing: SelectType[] = [
//   { value: 'venta', label: 'Venta' },
//   { value: 'arriendo', label: 'Arriendo' },
// ]
// const optProperty: SelectType[] = [
//   { value: 'departamento', label: 'Departamento' },
//   { value: 'casa', label: 'Casa' },
//   { value: 'oficina', label: 'Oficina' },
//   { value: 'local', label: 'Local' },
//   { value: 'bodega', label: 'Bodega' },
//   { value: 'parcela', label: 'Parcela' },
//   { value: 'terreno', label: 'Terreno' },
// ]
// const optStatus: SelectType[] = [
//   { value: 'available', label: 'Disponible' },
//   { value: 'inactive', label: 'Inactiva' },
//   { value: 'reserved', label: 'Reservada' },
//   { value: 'sold', label: 'Vendida' },
// ]
// const optCurrency: SelectType[] = [
//   { value: 'CLP', label: 'CLP' },
//   { value: 'UF', label: 'UF' },
//   { value: 'USD', label: 'USD' },
// ]
// const optUnit: SelectType[] = [{ value: 'mt2', label: 'm²' }]
// const optOrientation: SelectType[] = [
//   { value: 'N', label: 'N' },
//   { value: 'NE', label: 'NE' },
//   { value: 'E', label: 'E' },
//   { value: 'SE', label: 'SE' },
//   { value: 'S', label: 'S' },
//   { value: 'SO', label: 'SO' },
//   { value: 'O', label: 'O' },
//   { value: 'NO', label: 'NO' },
// ]
// const optCondition: SelectType[] = [
//   { value: 'new', label: 'Nuevo' },
//   { value: 'used', label: 'Usado' },
// ]

// /**
//  * Barra de filtros para el listado del Portal.
//  * Construye y normaliza PortalFindParams con nombres exactos exigidos por la API.
//  */
// const PortalFiltersBar: React.FC<Props> = ({
//   value,
//   onChange,
//   onReset,
//   className,
//   compact,
// }) => {
//   // Estado local editable antes de “Aplicar”
//   const [local, setLocal] = useState<PortalFindParams>({})

//   // Sincroniza estado local si value cambia externamente
//   useEffect(() => {
//     setLocal(value || {})
//   }, [JSON.stringify(value)])

//   const set = <K extends keyof PortalFindParams>(
//     key: K,
//     v: PortalFindParams[K]
//   ) => setLocal((prev) => ({ ...prev, [key]: v }))

//   const apply = () => {
//     const cleaned = clean({
//       ...local,
//       // normalizaciones opcionales:
//       page: value.page ?? 1,
//       page_size: value.page_size ?? 10,
//     }) as PortalFindParams
//     onChange(cleaned)
//   }

//   const reset = () => {
//     const base: PortalFindParams = { page: 1, page_size: value.page_size ?? 10 }
//     setLocal(base)
//     onChange(base)
//     onReset?.()
//   }

//   // layout (compacto o completo)
//   const col = compact
//     ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
//     : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'

//   return (
//     <div className={classNames('mb-4 rounded-xl border p-3', className)}>
//       <div className={classNames('grid gap-3', col)}>
//         {/* Operación / Tipo / Estado */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Operación</label>
//           <Select
//             size="sm"
//             isSearchable={false}
//             value={
//               optListing.find(
//                 (o) => o.value === (local.listing_type ?? null)
//               ) || null
//             }
//             options={optListing}
//             onChange={(opt) =>
//               set(
//                 'listing_type',
//                 ((opt as SelectType)?.value as string) ?? null
//               )
//             }
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Tipo</label>
//           <Select
//             isSearchable
//             size="sm"
//             value={
//               optProperty.find(
//                 (o) => o.value === (local.property_type ?? null)
//               ) || null
//             }
//             options={optProperty}
//             onChange={(opt) =>
//               set(
//                 'property_type',
//                 ((opt as SelectType)?.value as string) ?? null
//               )
//             }
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Estado</label>
//           <Select
//             size="sm"
//             isSearchable={false}
//             value={
//               optStatus.find((o) => o.value === (local.status ?? null)) || null
//             }
//             options={optStatus}
//             onChange={(opt) =>
//               set('status', ((opt as SelectType)?.value as string) ?? null)
//             }
//           />
//         </div>

//         {/* Moneda / Unidad */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Moneda</label>
//           <Select
//             size="sm"
//             isSearchable={false}
//             value={
//               optCurrency.find((o) => o.value === (local.currency ?? null)) ||
//               null
//             }
//             options={optCurrency}
//             onChange={(opt) =>
//               set('currency', ((opt as SelectType)?.value as string) ?? null)
//             }
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Unidad</label>
//           <Select
//             size="sm"
//             isSearchable={false}
//             value={
//               optUnit.find((o) => o.value === (local.unit ?? null)) || null
//             }
//             options={optUnit}
//             onChange={(opt) =>
//               set('unit', ((opt as SelectType)?.value as string) ?? null)
//             }
//           />
//         </div>

//         {/* Código / URL externa */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Código</label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             placeholder="Ej: 168"
//             value={local.code ?? ''}
//             onChange={(e) => set('code', e.target.value || null)}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             URL externa
//           </label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             placeholder="https://…"
//             value={local.external_url ?? ''}
//             onChange={(e) => set('external_url', e.target.value || null)}
//           />
//         </div>

//         {/* Precio CLP */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Precio CLP min
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.price_clp_min ?? ''}
//             onChange={(e) => set('price_clp_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Precio CLP max
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.price_clp_max ?? ''}
//             onChange={(e) => set('price_clp_max', toNum(e.target.value))}
//           />
//         </div>

//         {/* Precio UF */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Precio UF min
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.price_uf_min ?? ''}
//             onChange={(e) => set('price_uf_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Precio UF max
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.price_uf_max ?? ''}
//             onChange={(e) => set('price_uf_max', toNum(e.target.value))}
//           />
//         </div>

//         {/* Superficies */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Útil min (m²)
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.area_useful_min ?? ''}
//             onChange={(e) => set('area_useful_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Útil max (m²)
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.area_useful_max ?? ''}
//             onChange={(e) => set('area_useful_max', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Total min (m²)
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.area_total_min ?? ''}
//             onChange={(e) => set('area_total_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Total max (m²)
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.area_total_max ?? ''}
//             onChange={(e) => set('area_total_max', toNum(e.target.value))}
//           />
//         </div>

//         {/* Dormitorios / Baños / Est */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Dorms min</label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.bedrooms_min ?? ''}
//             onChange={(e) => set('bedrooms_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Dorms max</label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.bedrooms_max ?? ''}
//             onChange={(e) => set('bedrooms_max', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Baños min</label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.bathrooms_min ?? ''}
//             onChange={(e) => set('bathrooms_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Baños max</label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.bathrooms_max ?? ''}
//             onChange={(e) => set('bathrooms_max', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Estac. min
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.parking_min ?? ''}
//             onChange={(e) => set('parking_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Estac. max
//           </label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.parking_max ?? ''}
//             onChange={(e) => set('parking_max', toNum(e.target.value))}
//           />
//         </div>

//         {/* Ubicación */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Ciudad</label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.city ?? ''}
//             onChange={(e) => set('city', e.target.value || null)}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Comuna</label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.commune ?? ''}
//             onChange={(e) => set('commune', e.target.value || null)}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Región</label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.region ?? ''}
//             onChange={(e) => set('region', e.target.value || null)}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Barrio</label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.neighborhood ?? ''}
//             onChange={(e) => set('neighborhood', e.target.value || null)}
//           />
//         </div>

//         {/* Fechas (strings ISO o YYYY-MM-DD) */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Publicada desde
//           </label>
//           <input
//             type="date"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={(local.published_at_from ?? '').slice(0, 10)}
//             onChange={(e) =>
//               set(
//                 'published_at_from',
//                 e.target.value ? new Date(e.target.value).toISOString() : null
//               )
//             }
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Publicada hasta
//           </label>
//           <input
//             type="date"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={(local.published_at_to ?? '').slice(0, 10)}
//             onChange={(e) =>
//               set(
//                 'published_at_to',
//                 e.target.value ? new Date(e.target.value).toISOString() : null
//               )
//             }
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Scrape desde
//           </label>
//           <input
//             type="date"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={(local.scraped_at_from ?? '').slice(0, 10)}
//             onChange={(e) =>
//               set(
//                 'scraped_at_from',
//                 e.target.value ? new Date(e.target.value).toISOString() : null
//               )
//             }
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Scrape hasta
//           </label>
//           <input
//             type="date"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={(local.scraped_at_to ?? '').slice(0, 10)}
//             onChange={(e) =>
//               set(
//                 'scraped_at_to',
//                 e.target.value ? new Date(e.target.value).toISOString() : null
//               )
//             }
//           />
//         </div>

//         {/* Edad / Orientación / Condición */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Edad min</label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.age_min ?? ''}
//             onChange={(e) => set('age_min', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Edad max</label>
//           <input
//             type="number"
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.age_max ?? ''}
//             onChange={(e) => set('age_max', toNum(e.target.value))}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Orientación
//           </label>
//           <Select
//             size="sm"
//             isSearchable={false}
//             value={
//               optOrientation.find(
//                 (o) => o.value === (local.orientation ?? null)
//               ) || null
//             }
//             options={optOrientation}
//             onChange={(opt) =>
//               set('orientation', ((opt as SelectType)?.value as string) ?? null)
//             }
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">Condición</label>
//           <Select
//             size="sm"
//             isSearchable={false}
//             value={
//               optCondition.find((o) => o.value === (local.condition ?? null)) ||
//               null
//             }
//             options={optCondition}
//             onChange={(opt) =>
//               set('condition', ((opt as SelectType)?.value as string) ?? null)
//             }
//           />
//         </div>

//         {/* Consolidación */}
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Consolidated ID
//           </label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.consolidated_id ?? ''}
//             onChange={(e) => set('consolidated_id', e.target.value || null)}
//           />
//         </div>
//         <div>
//           <label className="block text-xs text-slate-500 mb-1">
//             Consolidated status
//           </label>
//           <input
//             className="w-full rounded-md border px-2 py-1 text-sm"
//             value={local.consolidated_status ?? ''}
//             onChange={(e) => set('consolidated_status', e.target.value || null)}
//           />
//         </div>
//       </div>

//       <div className="mt-3 flex items-center gap-2">
//         <button
//           className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
//           onClick={apply}
//         >
//           Aplicar filtros
//         </button>
//         <button
//           className="rounded-md border px-3 py-1.5 hover:bg-slate-50"
//           type="button"
//           onClick={reset}
//         >
//           Limpiar
//         </button>
//       </div>
//     </div>
//   )
// }

// export default PortalFiltersBar
