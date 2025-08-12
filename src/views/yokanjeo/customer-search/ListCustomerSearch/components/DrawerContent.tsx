import PropertyInfo from './PropertyInfo'

const DrawerContent = ({ data, images }) => {
  const renderedItems =
    data && data.length > 0 ? (
      data.map((property, index) => (
        <PropertyInfo key={index} property={property} images={images} />
      ))
    ) : (
      <p className="w-full text-center">
        Esta oportunidad aún no cuenta con propiedades en match.
      </p>
    )

  return <ul className="gap-2">{renderedItems}</ul>
}

export default DrawerContent
