import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useDishes } from '../hooks/useDishes'
import DishCard from '../components/DishCard'
import DishForm from '../components/DishForm'

export default function MyDishes() {
  const { householdId } = useHousehold()
  const { dishes, loading, addDish, updateDish, deleteDish } = useDishes(householdId)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)

  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  )

  async function handleSave(data) {
    if (editing === 'new') await addDish(data)
    else await updateDish(editing.id, data)
    setEditing(null)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este plato?')) return
    await deleteDish(id)
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-400 pt-16 text-sm">Cargando...</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 mb-4">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar plato..."
          className="bg-transparent flex-1 text-sm outline-none"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">
          {dishes.length === 0
            ? '¡Añadid vuestro primer plato!'
            : 'Sin resultados para esa búsqueda'}
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onEdit={() => setEditing(dish)}
            onDelete={() => handleDelete(dish.id)}
          />
        ))}
      </div>

      <button
        onClick={() => setEditing('new')}
        className="fixed bottom-20 right-4 bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:bg-emerald-700"
      >
        <Plus size={26} />
      </button>

      {editing && (
        <DishForm
          initial={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
