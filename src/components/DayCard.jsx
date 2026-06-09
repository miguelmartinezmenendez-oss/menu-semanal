import { Plus, X, Dices } from 'lucide-react'

export default function DayCard({ label, dish, onAdd, onRandom, onClear }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-3">
      <span className="text-xs font-semibold text-gray-400 w-8 shrink-0 uppercase">
        {label.slice(0, 3)}
      </span>

      {dish ? (
        <div className="flex-1 flex items-center justify-between gap-2">
          <button
            onClick={onAdd}
            className="flex-1 text-left text-sm font-medium text-gray-800 truncate"
          >
            {dish.name}
          </button>
          <button
            onClick={onClear}
            className="p-1 text-gray-300 hover:text-red-400 shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between gap-2">
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600"
          >
            <Plus size={15} />
            <span>Añadir cena</span>
          </button>
          <button
            onClick={onRandom}
            className="p-1 text-gray-300 hover:text-emerald-500 shrink-0"
            title="Sugiéreme algo"
          >
            <Dices size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
