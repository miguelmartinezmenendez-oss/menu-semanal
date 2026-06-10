import { Plus, X, Dices } from 'lucide-react'
import { typeStyle } from '../lib/dishTypes'

const ADD_LABELS = ['Añadir cena', '2º plato', '3er plato', '4º plato']

export default function DayCard({ label, dishes, onAdd, onClear, onRandom }) {
  // dishes = array of 4, nulls for empty slots
  const filledCount = dishes.filter(Boolean).length
  const hasAny = filledCount > 0
  const canAddMore = filledCount < 4

  return (
    <div className={`bg-white rounded-2xl px-4 py-3.5 transition-shadow ${
      hasAny
        ? 'shadow-[0_3px_16px_rgba(120,113,108,0.11)]'
        : 'shadow-[0_2px_12px_rgba(120,113,108,0.08)]'
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-9 shrink-0 pt-0.5">
          <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wide">
            {label.slice(0, 3)}
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {dishes.map((dish, i) => {
            if (!dish) return null
            const ts = typeStyle(dish.type)
            return (
              <div key={i} className="flex items-center gap-2 min-w-0">
                {dish.type
                  ? <span className={`w-2 h-2 rounded-full shrink-0 ${ts.dot}`} />
                  : <span className="w-2 h-2 rounded-full shrink-0 bg-stone-200" />
                }
                <button
                  onClick={() => onAdd(i + 1)}
                  className="flex-1 text-left text-sm font-semibold text-stone-800 truncate cursor-pointer leading-snug"
                >
                  {dish.name}
                </button>
                <button
                  onClick={() => onClear(i + 1)}
                  className="p-1 text-stone-300 hover:text-red-400 shrink-0 cursor-pointer transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            )
          })}

          {canAddMore && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAdd(filledCount + 1)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  filledCount === 0
                    ? 'text-sm text-stone-400 hover:text-emerald-600'
                    : 'text-[11px] text-stone-300 hover:text-emerald-500'
                }`}
              >
                <Plus size={filledCount === 0 ? 14 : 12} />
                <span>{ADD_LABELS[filledCount]}</span>
              </button>
              {filledCount === 0 && (
                <button
                  onClick={onRandom}
                  className="p-1 text-stone-300 hover:text-emerald-500 shrink-0 cursor-pointer transition-colors"
                  title="Sugiéreme algo"
                >
                  <Dices size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {hasAny && canAddMore && (
          <button
            onClick={onRandom}
            className="p-1 text-stone-300 hover:text-emerald-500 shrink-0 cursor-pointer mt-0.5 transition-colors"
            title="Sugiéreme algo"
          >
            <Dices size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
