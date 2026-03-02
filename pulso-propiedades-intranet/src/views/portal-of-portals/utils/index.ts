export const formatCLP = (value?: number | null) => {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatUF = (value?: number | null) => {
  if (value == null || isNaN(value)) return '—'
  // UF formatting as a number; consumer can map to real UF price externally if needed
  return (
    new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(value) +
    ' UF'
  )
}

export const formatArea = (m2?: number | null, unit = 'mt2') => {
  if (m2 == null || isNaN(m2)) return '—'
  return `${m2.toLocaleString('es-CL')} ${unit.replace('mt2', 'm²')}`
}

export const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return '—'
  }
}

export const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ')

// Simple copy helper
export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // alert('Copiado al portapapeles')
  } catch {
    alert('No se pudo copiar')
  }
}

export const capitalize = (s?: string) => {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
