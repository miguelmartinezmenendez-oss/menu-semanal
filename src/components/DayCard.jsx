import { Plus, X, Dices } from 'lucide-react'
import { typeStyle } from '../lib/dishTypes'

function DishSlot({ dish, onAdd, onClear, placeholder, isSecond, showRandom, onRandom }) {
  const ts = typeStyle(dish?.type)
  if (dish) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        {dish.type
          ? <span className={`w-2 h-2 rounded-full shrink-0 ${ts.dot}`} />
          : <span className="w-2 h-2 rounded-full shrink-0 bg-stone-200" />
        }
        <button onClick={onAdd} className="flex-1 text-left text-sm font-semibold text-stone-800 truncate cursor-pointer leading-snug">
          {dish.name}
        </button>
        <button onClick={onClear} className="p-1 text-stone-300 hover:text-red-400 shrink-0 cursor-pointer transition-colors">
          <X size={13} />
        </button>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAdd}
        className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
          isSecond
            ? 'text-[11px] text-stone-300 hover:text-emerald-500'
            : 'text-sm text-stone-400 hover:text-emerald-600'
        }`}
      >
        <Plus size={isSecond ? 12 : 14} />
        <span>{placeholder}</span>
      </button>
      {showRandom && (
        <button onClick={onRandom} className="p-1 text-stone-300 hover:text-emerald-500 shrink-0 cursor-pointer transition-colors" title="Sugiéreme algo">
          <Dices size={16} />
        </button>
      )}
    </div>
  )
}

export default function DayCard({ label, dish1, dish2, onAdd1, onAdd2, onRandom, onClear1, onClear2 }) {
  const hasDish = dish1 || dish2
  return (
    <div className={`bg-white rounded-2xl px-4 py-3.5 shadow-[0_2px_12px_rgba(120,113,108,0.08)] transition-shadow ${hasDish ? 'shadow-[0_3px_16px_rgba(120,113,108,0.11)]' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 shrink-0 pt-0.5">
          <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wide">
            {label.slice(0, 3)}
          </span>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <DishSlot
            dish={dish1}
            onAdd={onAdd1}
            onClear={onClear1}
            placeholder="Añadir cena"
            isSecond={false}
            showRandom={!dish1}
            onRandom={onRandom}
          />
          {dish1 && (
            <DishSlot
              dish={dish2}
              onAdd={onAdd2}
              onClear={onClear2}
              placeholder="2º plato"
              isSecond={true}
              showRandom={false}
              onRandom={null}
            />
          )}
        </div>
        {dish1 && !dish2 && (
          <button onClick={onRandom} className="p-1 text-stone-300 hover:text-emerald-500 shrink-0 cursor-pointer mt-0.5 transition-colors" title="Sugiéreme algo">
            <Dices size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
