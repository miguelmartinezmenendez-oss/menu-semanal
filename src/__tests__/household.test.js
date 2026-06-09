import { describe, it, expect } from 'vitest'
import { generateCode } from '../lib/household'

describe('generateCode', () => {
  it('genera un código con formato XXXX-XXXX', () => {
    const code = generateCode()
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  })

  it('genera códigos únicos en llamadas sucesivas', () => {
    const codes = new Set(Array.from({ length: 100 }, generateCode))
    expect(codes.size).toBeGreaterThan(95)
  })

  it('no incluye caracteres ambiguos (0, O, I, 1)', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCode().replace('-', '')
      expect(code).not.toMatch(/[01IO]/)
    }
  })
})
