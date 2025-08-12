const FilePreviewer = ({ url }) => {
  const fileType = url?.split('.').pop() || ''

  const renderPreview = () => {
    switch (fileType) {
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'webp':
        return (
          <img
            src={url}
            alt={`preview-${url}`}
            className="object-cover h-24 w-full max-w-full max-h-24"
          />
        )
      case 'pdf':
        return (
          <img
            width="48"
            height="48"
            src="/public/img/file/pdf-icon.png"
            alt="microsoft-excel-2019"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )

      case 'xlsx':
        return (
          <img
            width="48"
            height="48"
            src="/public/img/file/xlsx-icon.png"
            alt="microsoft-excel-2019"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )

      case 'docx':
        return (
          <img
            width="48"
            height="48"
            src="/public/img/file/docx-icon.png"
            alt="microsoft-excel-2019"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )

      case 'pptx':
        return (
          <img
            width="48"
            height="48"
            src="/public/img/file/pptx-icon.png"
            alt="microsoft-excel-2019"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )

      case 'txt':
        return (
          <img
            width="48"
            height="48"
            src="/public/img/file/txt-icon.png"
            alt="microsoft-excel-2019"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )

      default:
        return (
          <img
            width="48"
            height="48"
            src="/public/img/file/file-icon.png"
            alt="microsoft-excel-2019"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      {renderPreview()}
    </div>
  )
}

export default FilePreviewer
