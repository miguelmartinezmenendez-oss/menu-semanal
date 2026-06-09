import { describe, it, expect } from 'vitest'
import { categorizeIngredient } from '../lib/categories'

describe('categorizeIngredient', () => {
  it('clasifica verduras correctamente', () => {
    expect(categorizeIngredient('tomate cherry')).toBe('Verduras')
    expect(categorizeIngredient('Cebolla morada')).toBe('Verduras')
    expect(categorizeIngredient('zanahoria rallada')).toBe('Verduras')
  })

  it('clasifica proteínas correctamente', () => {
    expect(categorizeIngredient('pechuga de pollo')).toBe('Proteínas')
    expect(categorizeIngredient('salmón fresco')).toBe('Proteínas')
    expect(categorizeIngredient('huevo campero')).toBe('Proteínas')
  })

  it('clasifica lácteos correctamente', () => {
    expect(categorizeIngredient('queso parmesano')).toBe('Lácteos')
    expect(categorizeIngredient('nata para cocinar')).toBe('Lácteos')
    expect(categorizeIngredient('mantequilla')).toBe('Lácteos')
  })

  it('devuelve Otros para ingredientes no reconocidos', () => {
    expect(categorizeIngredient('pasta')).toBe('Otros')
    expect(categorizeIngredient('aceite de oliva')).toBe('Otros')
    expect(categorizeIngredient('sal')).toBe('Otros')
  })
})
