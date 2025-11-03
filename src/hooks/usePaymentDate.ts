import { useState } from 'react'

const PAYMENT_DATE_KEY = 'paymentDate'

/**
 * Hook para manejar la configuración global de fecha de cobro
 * Esta fecha define el inicio del "mes financiero" del usuario
 */
export const usePaymentDate = () => {
  const [paymentDate, setPaymentDateState] = useState<number>(() => {
    const stored = localStorage.getItem(PAYMENT_DATE_KEY)
    return stored ? parseInt(stored, 10) : 1 // Default: día 1 del mes
  })

  const setPaymentDate = (date: number) => {
    // Validar que esté entre 1 y 31
    const validDate = Math.max(1, Math.min(31, date))
    setPaymentDateState(validDate)
    localStorage.setItem(PAYMENT_DATE_KEY, validDate.toString())
  }

  /**
   * Obtiene el rango de fechas del "mes financiero" actual
   * basado en la fecha de cobro configurada
   */
  const getCurrentPeriod = () => {
    const today = new Date()
    const currentDay = today.getDate()

    let startDate: Date
    let endDate: Date

    if (currentDay >= paymentDate) {
      // Estamos en el período actual
      startDate = new Date(today.getFullYear(), today.getMonth(), paymentDate)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, paymentDate - 1)
    } else {
      // Estamos antes de la fecha de cobro, usar período anterior
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, paymentDate)
      endDate = new Date(today.getFullYear(), today.getMonth(), paymentDate - 1)
    }

    return { startDate, endDate }
  }

  /**
   * Obtiene el rango de fechas de un período específico
   * @param monthsOffset - Offset desde el período actual (0 = actual, -1 = anterior, 1 = siguiente)
   */
  const getPeriod = (monthsOffset: number = 0) => {
    const { startDate } = getCurrentPeriod()

    const periodStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + monthsOffset,
      paymentDate
    )

    const periodEnd = new Date(
      periodStart.getFullYear(),
      periodStart.getMonth() + 1,
      paymentDate - 1
    )

    return { startDate: periodStart, endDate: periodEnd }
  }

  /**
   * Formatea un período a string ISO para usar en queries
   */
  const formatPeriodForQuery = (period: { startDate: Date; endDate: Date }) => {
    return {
      startDate: period.startDate.toISOString().split('T')[0],
      endDate: period.endDate.toISOString().split('T')[0],
    }
  }

  return {
    paymentDate,
    setPaymentDate,
    getCurrentPeriod,
    getPeriod,
    formatPeriodForQuery,
  }
}
