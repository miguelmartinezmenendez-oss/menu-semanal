import { Pencil, Trash2 } from 'lucide-react'
import { typeStyle } from '../lib/dishTypes'

export default function DishCard({ dish, onEdit, onDelete }) {
  const ts = typeStyle(dish.type)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-800">{dish.name}</p>
          {dish.type && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ts.badge}`}>
              {dish.type}
            </span>
          )}
        </div>
        {dish.ingredients?.length > 0 && (
          <p className="text-xs text-gray-400 mt-1 truncate">
            {dish.ingredients.join(', ')}
          </p>
        )}
        {dish.notes && (
          <p className="text-xs text-emerald-600 mt-1 italic">{dish.notes}</p>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg active:bg-gray-100 cursor-pointer"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-400 rounded-lg active:bg-gray-100 cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
