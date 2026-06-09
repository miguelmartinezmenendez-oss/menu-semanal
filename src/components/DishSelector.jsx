import { useState } from 'react'
import { X, Search } from 'lucide-react'

export default function DishSelector({ dishes, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[75vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Elige un plato</h2>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="bg-transparent flex-1 text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">Sin resultados</p>
          ) : (
            filtered.map((dish) => (
              <button
                key={dish.id}
                onClick={() => onSelect(dish.id)}
                className="w-full text-left px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100 last:border-0"
              >
                <p className="text-sm font-medium text-gray-800">{dish.name}</p>
                {dish.ingredients?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {dish.ingredients.join(', ')}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
