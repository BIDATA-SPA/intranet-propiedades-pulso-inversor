export type ToolsAndServives = {
  id: number | string
  name: string
  description: string
  image: string
  path: string | null
  childrensFolders?: { id: number; name: string }[]
  files?: { id: number; name: string }[]
}

export type CreateToolsAndServicesBody = {
  name: string
  description: string
  parentFolderId: number | null
  image: File | null
}

export type CreateToolsAndServicesFileBody = {
  name: string
  description: string
  folderId: number | null
  file: File | null
}

export type CreateExternalServiceFormModel = {
  name: string
  description: string
  parentFolderId: number | null
  image: File | null
}
