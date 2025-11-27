import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

export function usePathChangeEffect(callback: () => void) {
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname
      callback()
    }
  }, [location.pathname, callback])
}
