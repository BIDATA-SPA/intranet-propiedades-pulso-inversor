type TUseCrud = {
  image?: File | string
  file?: File | string
  parentFolderId?: string
  folderId?: string
}

export const useCrud = ({
  image,
  parentFolderId,
  file,
  folderId,
}: TUseCrud) => {
  // ROOT FOLDER
  const createFatherFolder = (values) => {
    const formData = new FormData()

    Object.keys(values).forEach((key) => {
      const value = values[key]
      formData.append(key, value instanceof Blob ? value : String(value))
    })
    if (!image) {
      formData.append('image', image)
    }
    return formData
  }

  const updateFatherFolder = (values) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'image' && typeof value === 'string') {
        // stand by
      } else {
        formData.append(key, value instanceof Blob ? value : String(value))
      }
    })
    return formData
  }

  // ROOT FILE
  const createFatherFile = (values) => {
    const formData = new FormData()

    Object.keys(values).forEach((key) => {
      const value = values[key]
      formData.append(key, value instanceof Blob ? value : String(value))
    })
    if (folderId) {
      formData.append('folderId', folderId)
    }
    if (!file) {
      formData.append('file', file)
    }
    return formData
  }

  // CHILD FOLDER
  const createChildFolder = (values) => {
    const formData = new FormData()

    Object.keys(values).forEach((key) => {
      const value = values[key]
      formData.append(key, value instanceof Blob ? value : String(value))
    })
    if (parentFolderId) {
      formData.append('parentFolderId', parentFolderId)
    }
    if (!image) {
      formData.append('image', image)
    }

    return formData
  }

  return {
    createFatherFolder,
    updateFatherFolder,
    createFatherFile,
    createChildFolder,
  }
}
