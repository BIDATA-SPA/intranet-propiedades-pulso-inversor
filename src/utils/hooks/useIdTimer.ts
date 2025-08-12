import { useEffect, useRef } from 'react'

const useIdleTimer = (onIdle: () => void, timeout = 5 * 60 * 1000) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      onIdle()
    }, timeout)
  }

  useEffect(() => {
    // user type events
    const events = ['mousemove', 'keydown', 'scroll', 'click']

    const handleActivity = () => {
      resetTimer()
    }

    // Add listeners to events
    events.forEach((event) => window.addEventListener(event, handleActivity))

    // Iniciar el timer al montar el componente
    resetTimer()

    // Clean to unmount component
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      )
    }
  }, [onIdle, timeout])
}

export default useIdleTimer
