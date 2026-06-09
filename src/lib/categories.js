const KEYWORDS = {
  Verduras: [
    'tomate', 'cebolla', 'ajo', 'zanahoria', 'pimiento', 'lechuga',
    'espinaca', 'calabacín', 'berenjena', 'patata', 'brócoli', 'coliflor',
    'puerro', 'apio', 'pepino', 'champiñón', 'seta', 'acelga', 'guisante',
    'judía verde', 'rúcula', 'endivía',
  ],
  Proteínas: [
    'pollo', 'carne', 'ternera', 'cerdo', 'jamón', 'bacalao', 'salmón',
    'atún', 'gamba', 'huevo', 'tofu', 'lenteja', 'garbanzo', 'pescado',
    'merluza', 'sepia', 'calamar', 'mejillón', 'chorizo', 'morcilla',
    'pavo', 'cordero', 'conejo',
  ],
  Lácteos: [
    'leche', 'queso', 'mantequilla', 'nata', 'yogur', 'mozzarella',
    'parmesano', 'crema', 'requesón', 'ricotta',
  ],
}

export function categorizeIngredient(ingredient) {
  const lower = ingredient.toLowerCase()
  for (const [cat, kws] of Object.entries(KEYWORDS)) {
    if (kws.some((kw) => lower.includes(kw))) return cat
  }
  return 'Otros'
}
