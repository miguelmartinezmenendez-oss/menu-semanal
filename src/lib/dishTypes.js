export const DISH_TYPES = [
  'Carne', 'Pescado', 'Marisco', 'Verduras', 'Pasta',
  'Legumbres', 'Arroz', 'Ensalada', 'Sopa', 'Huevos', 'Pizza', 'Otros',
]

export const TYPE_STYLES = {
  Carne:     { badge: 'bg-rose-100 text-rose-700',       dot: 'bg-rose-400' },
  Pescado:   { badge: 'bg-sky-100 text-sky-700',         dot: 'bg-sky-400' },
  Marisco:   { badge: 'bg-cyan-100 text-cyan-700',       dot: 'bg-cyan-400' },
  Verduras:  { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  Pasta:     { badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400' },
  Legumbres: { badge: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-400' },
  Arroz:     { badge: 'bg-yellow-100 text-yellow-800',   dot: 'bg-yellow-400' },
  Ensalada:  { badge: 'bg-lime-100 text-lime-700',       dot: 'bg-lime-400' },
  Sopa:      { badge: 'bg-violet-100 text-violet-700',   dot: 'bg-violet-400' },
  Huevos:    { badge: 'bg-yellow-100 text-yellow-800',   dot: 'bg-yellow-400' },
  Pizza:     { badge: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-400' },
  Otros:     { badge: 'bg-slate-100 text-slate-600',     dot: 'bg-slate-400' },
}

export const DEFAULT_STYLE = { badge: 'bg-slate-100 text-slate-500', dot: 'bg-slate-300' }

export function typeStyle(type) {
  return TYPE_STYLES[type] ?? DEFAULT_STYLE
}
