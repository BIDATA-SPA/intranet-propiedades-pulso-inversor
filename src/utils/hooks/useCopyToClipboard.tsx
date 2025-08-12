import { useState } from 'react'

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    if (!navigator.clipboard) {
      console.warn('Clipboard not supported')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy: ', error)
    }
  }

  return { isCopied, copyToClipboard, setIsCopied }
}
