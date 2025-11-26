import { useState } from 'react'

const PAYMENT_DATE_KEY = 'paymentDate'

/**
 * Calcula el último día hábil (lunes a viernes) de un mes
 */
const getLastBusinessDay = (year: number, month: number): number => {
  // Obtener el último día del mes
  let lastDay = new Date(year, month + 1, 0)

  // Retroceder hasta encontrar un día hábil (lunes-viernes)
  while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
    lastDay.setDate(lastDay.getDate() - 1)
  }

  return lastDay.getDate()
}

/**
 * Hook para manejar la configuración global de fecha de cobro
 * Esta fecha define el inicio del "mes financiero" del usuario
 * Ahora usa el último día hábil del mes
 */
export const usePaymentDate = () => {
  // Mantener compatibilidad con localStorage pero ahora siempre será el último día hábil
  const [paymentDate, setPaymentDateState] = useState<number>(() => {
    const today = new Date()
    return getLastBusinessDay(today.getFullYear(), today.getMonth())
  })

  const setPaymentDate = (date: number) => {
    // Esta función ahora es legacy, pero la mantenemos para compatibilidad
    const validDate = Math.max(1, Math.min(31, date))
    setPaymentDateState(validDate)
    localStorage.setItem(PAYMENT_DATE_KEY, validDate.toString())
  }

  /**
   * Obtiene el día de pago para un mes/año específico
   */
  const getPaymentDayForMonth = (year: number, month: number): number => {
    return getLastBusinessDay(year, month)
  }

  /**
   * Obtiene el rango de fechas del "mes financiero" actual
   * basado en el último día hábil de cada mes
   */
  const getCurrentPeriod = () => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    const currentPaymentDay = getLastBusinessDay(currentYear, currentMonth)

    let startDate: Date
    let endDate: Date

    if (currentDay >= currentPaymentDay) {
      // Estamos en el período actual (del último día hábil de este mes al último día hábil del mes siguiente)
      startDate = new Date(currentYear, currentMonth, currentPaymentDay)
      const nextMonth = currentMonth + 1
      const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear
      const nextMonthAdjusted = nextMonth > 11 ? 0 : nextMonth
      const nextPaymentDay = getLastBusinessDay(nextYear, nextMonthAdjusted)
      endDate = new Date(nextYear, nextMonthAdjusted, nextPaymentDay - 1)
    } else {
      // Estamos antes del último día hábil, usar período anterior
      const prevMonth = currentMonth - 1
      const prevYear = prevMonth < 0 ? currentYear - 1 : currentYear
      const prevMonthAdjusted = prevMonth < 0 ? 11 : prevMonth
      const prevPaymentDay = getLastBusinessDay(prevYear, prevMonthAdjusted)
      startDate = new Date(prevYear, prevMonthAdjusted, prevPaymentDay)
      endDate = new Date(currentYear, currentMonth, currentPaymentDay - 1)
    }

    return { startDate, endDate }
  }

  /**
   * Obtiene el rango de fechas de un período específico
   * @param monthsOffset - Offset desde el período actual (0 = actual, -1 = anterior, 1 = siguiente)
   */
  const getPeriod = (monthsOffset: number = 0) => {
    const today = new Date()
    const targetYear = today.getFullYear()
    const targetMonth = today.getMonth() + monthsOffset

    // Ajustar año y mes si es necesario
    const adjustedDate = new Date(targetYear, targetMonth, 1)
    const year = adjustedDate.getFullYear()
    const month = adjustedDate.getMonth()

    // El período comienza en el último día hábil del MES ANTERIOR
    const prevMonth = month - 1
    const prevYear = prevMonth < 0 ? year - 1 : year
    const prevMonthAdjusted = prevMonth < 0 ? 11 : prevMonth
    const startDay = getLastBusinessDay(prevYear, prevMonthAdjusted)
    const periodStart = new Date(prevYear, prevMonthAdjusted, startDay)

    // El período termina el día antes del último día hábil del mes objetivo
    const endDay = getLastBusinessDay(year, month)
    const periodEnd = new Date(year, month, endDay - 1)

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
    getPaymentDayForMonth,
  }
}
