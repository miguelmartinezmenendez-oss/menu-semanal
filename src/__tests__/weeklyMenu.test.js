import { describe, it, expect } from 'vitest'
import { getWeekStart, formatWeekRange } from '../hooks/useWeeklyMenu'

describe('getWeekStart', () => {
  it('devuelve el lunes de la semana para un miércoles', () => {
    const result = getWeekStart(new Date('2026-06-10'))
    expect(result).toBe('2026-06-08')
  })

  it('devuelve el mismo lunes cuando la fecha es lunes', () => {
    const result = getWeekStart(new Date('2026-06-08'))
    expect(result).toBe('2026-06-08')
  })

  it('devuelve el lunes anterior cuando la fecha es domingo', () => {
    const result = getWeekStart(new Date('2026-06-14'))
    expect(result).toBe('2026-06-08')
  })
})

describe('formatWeekRange', () => {
  it('formatea el rango de semana en español', () => {
    const result = formatWeekRange('2026-06-08')
    expect(result).toContain('8')
    expect(result).toContain('14')
    expect(result.toLowerCase()).toContain('junio')
  })
})
