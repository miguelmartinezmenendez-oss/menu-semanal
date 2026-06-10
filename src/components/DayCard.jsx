import { Plus, X, Dices } from 'lucide-react'
import { typeStyle } from '../lib/dishTypes'

function DishSlot({ dish, onAdd, onClear, placeholder, showRandom, onRandom }) {
  const ts = typeStyle(dish?.type)
  if (dish) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        {dish.type && <span className={`w-2 h-2 rounded-full shrink-0 ${ts.dot}`} />}
        <button onClick={onAdd} className="flex-1 text-left text-sm font-medium text-gray-800 truncate cursor-pointer">
          {dish.name}
        </button>
        <button onClick={onClear} className="p-1 text-gray-300 hover:text-red-400 shrink-0 cursor-pointer">
          <X size={14} />
        </button>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <button onClick={onAdd} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600 cursor-pointer">
        <Plus size={14} />
        <span>{placeholder}</span>
      </button>
      {showRandom && (
        <button onClick={onRandom} className="p-1 text-gray-300 hover:text-emerald-500 shrink-0 cursor-pointer" title="Sugiéreme algo">
          <Dices size={17} />
        </button>
      )}
    </div>
  )
}

export default function DayCard({ label, dish1, dish2, onAdd1, onAdd2, onRandom, onClear1, onClear2 }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="text-xs font-semibold text-gray-400 w-8 shrink-0 uppercase pt-1">
          {label.slice(0, 3)}
        </span>
        <div className="flex-1 min-w-0 space-y-2">
          <DishSlot
            dish={dish1}
            onAdd={onAdd1}
            onClear={onClear1}
            placeholder="Añadir cena"
            showRandom={!dish1}
            onRandom={onRandom}
          />
          {dish1 && (
            <DishSlot
              dish={dish2}
              onAdd={onAdd2}
              onClear={onClear2}
              placeholder="2º plato (opcional)"
              showRandom={false}
              onRandom={null}
            />
          )}
        </div>
        {dish1 && !dish2 && (
          <button onClick={onRandom} className="p-1 text-gray-300 hover:text-emerald-500 shrink-0 cursor-pointer mt-0.5" title="Sugiéreme algo">
            <Dices size={17} />
          </button>
        )}
      </div>
    </div>
  )
}
