import { Pencil, Trash2 } from 'lucide-react'
import { typeStyle } from '../lib/dishTypes'

export default function DishCard({ dish, onEdit, onDelete }) {
  const ts = typeStyle(dish.type)

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(120,113,108,0.08)] p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          {dish.type && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ts.badge}`}>
              {dish.type}
            </span>
          )}
        </div>
        <p className="font-semibold text-stone-800 leading-snug">{dish.name}</p>
        {dish.ingredients?.length > 0 && (
          <p className="text-xs text-stone-400 mt-1 truncate">
            {dish.ingredients.join(' · ')}
          </p>
        )}
        {dish.notes && (
          <p className="text-xs text-emerald-600 mt-1 italic">{dish.notes}</p>
        )}
      </div>
      <div className="flex gap-0.5 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 text-stone-300 hover:text-emerald-600 rounded-xl active:bg-stone-50 cursor-pointer transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-stone-300 hover:text-red-400 rounded-xl active:bg-stone-50 cursor-pointer transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}
