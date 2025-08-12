import { useState } from 'react'

const useDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return { isDrawerOpen, openDrawer, closeDrawer }
}

export default useDrawer
