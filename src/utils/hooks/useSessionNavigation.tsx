import navigationConfig, {
  navigationConfigCustomer,
} from '@/configs/navigation.config'
import { useMemo } from 'react'

export const useSessionNavigation = (sessionTypeId: number) => {
  const navigationTree = useMemo(() => {
    const userSessionTypeId = sessionTypeId

    const menuMap = {
      1: navigationConfig, // admin user session id
      2: navigationConfig, // realtor user session id
      3: navigationConfigCustomer, // customer user session id
    }

    return menuMap[userSessionTypeId] || []
  }, [sessionTypeId])

  return { navigationTree }
}
