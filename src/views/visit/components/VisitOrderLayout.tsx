import type { FC, ReactNode } from 'react'
import type { VisitOrderDocumentProps } from '../types/types'

type VisitOrderLayoutProps = VisitOrderDocumentProps & {
  title: string
  priceLabel: string
  children: ReactNode
  showCompanyFooter?: boolean
  companyFooter?: ReactNode
}

const VisitOrderLayout: FC<VisitOrderLayoutProps> = ({
  title,
  priceLabel,
  date,
  customerName,
  customerEmail,
  customerRut,
  customerPhone,
  customerAddress,
  propertyAddress,
  priceText,
  brokerName,
  customerIdLabel = 'Cédula de Identidad',
  brokerIdLabel = 'Cédula de Identidad',
  propertyImages = [],
  leftLogoSrc,
  rightLogoSrc,
  children,
  showCompanyFooter = false,
  companyFooter,
}) => {
  const visibleImages = propertyImages.slice(0, 3)

  return (
    <div className="mx-auto w-full max-w-[900px] bg-white px-10 py-8 text-[15px] leading-6 text-neutral-900 print:px-8 print:py-6">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          {leftLogoSrc ? (
            <img
              src={leftLogoSrc}
              alt="Logo izquierdo"
              className="h-14 w-auto object-contain"
            />
          ) : null}

          {rightLogoSrc ? (
            <img
              src={rightLogoSrc}
              alt="Logo derecho"
              className="h-14 w-auto object-contain"
            />
          ) : null}
        </div>

        <div className="text-right text-sm">
          <span className="font-medium">Fecha:</span>{' '}
          <span className="inline-block min-w-[140px] border-b border-neutral-800">
            {date}
          </span>
        </div>
      </div>

      <h1 className="mb-6 text-2xl font-bold uppercase tracking-tight">
        {title}
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-x-10 gap-y-1">
        <div>
          <p>
            <span className="font-semibold">Por esta Orden, don/doña:</span>
          </p>
          <p>
            <span className="inline-block min-w-[80px]">Nombre:</span>
            <span>{customerName}</span>
          </p>
          <p>
            <span className="inline-block min-w-[80px]">Mail:</span>
            <span>{customerEmail}</span>
          </p>
          <p className="text-justify break-words whitespace-normal">
            <span className="inline-block min-w-[80px]">Domicilio:</span>
            <span>{customerAddress}</span>
          </p>
        </div>

        <div className="pt-7">
          <p>
            <span className="inline-block min-w-[80px]">RUT:</span>
            <span>{customerRut}</span>
          </p>
          <p>
            <span className="inline-block min-w-[80px]">Teléfono:</span>
            <span>{customerPhone}</span>
          </p>
        </div>
      </div>

      <div className="mb-2">
        <p>Viene a solicitar visitar la(s) siguiente(s) propiedad(es):</p>
        <p className="border-b border-neutral-800 pb-1 font-semibold text-justify break-words whitespace-normal">
          {propertyAddress}
        </p>
      </div>

      <div className="mb-8 border-b border-neutral-800 pb-2">
        <span className="font-semibold">{priceLabel}</span>{' '}
        <span>{priceText}</span>
      </div>

      <div className="space-y-5 text-justify">{children}</div>

      {visibleImages.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-3 text-base font-semibold">
            Imágenes de la propiedad
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {visibleImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`Imagen propiedad ${index + 1}`}
                className="h-44 w-full rounded-md border border-neutral-200 object-cover"
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-16 grid grid-cols-2 gap-16">
        <div>
          <div className="mb-1 h-px w-[180px] bg-neutral-800" />
          <p className="font-semibold">[{customerName || 'Nombre Cliente'}]</p>
          <p>{customerIdLabel}</p>
        </div>

        <div>
          <div className="mb-1 h-px w-[180px] bg-neutral-800" />
          <p className="font-semibold">{brokerName}</p>
          <p>{brokerIdLabel}</p>
        </div>
      </div>

      {showCompanyFooter && companyFooter ? (
        <div className="mt-10">{companyFooter}</div>
      ) : null}
    </div>
  )
}

export default VisitOrderLayout
