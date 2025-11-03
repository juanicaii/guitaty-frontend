import { useState, useEffect } from 'react'

interface NetworkStatus {
  online: boolean
  type?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    online: navigator.onLine
  })

  useEffect(() => {
    const updateStatus = () => {
      const connection = (navigator as any).connection
        || (navigator as any).mozConnection
        || (navigator as any).webkitConnection

      setStatus({
        online: navigator.onLine,
        type: connection?.type,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData
      })
    }

    updateStatus()

    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    const connection = (navigator as any).connection
      || (navigator as any).mozConnection
      || (navigator as any).webkitConnection

    if (connection) {
      connection.addEventListener('change', updateStatus)
    }

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
      if (connection) {
        connection.removeEventListener('change', updateStatus)
      }
    }
  }, [])

  return status
}
