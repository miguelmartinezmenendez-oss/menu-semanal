import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useDishes } from '../hooks/useDishes'
import { DISH_TYPES } from '../lib/dishTypes'
import DishCard from '../components/DishCard'
import DishForm from '../components/DishForm'

function groupByType(dishes) {
  const groups = {}
  const withType = dishes.filter((d) => d.type)
  const withoutType = dishes.filter((d) => !d.type)
  for (const t of DISH_TYPES) {
    const group = withType.filter((d) => d.type === t)
    if (group.length) groups[t] = group
  }
  if (withoutType.length) groups['Sin categoría'] = withoutType
  return groups
}

export default function MyDishes() {
  const { householdId } = useHousehold()
  const { dishes, loading, addDish, updateDish, deleteDish } = useDishes(householdId)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)

  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  )
  const grouped = query ? null : groupByType(dishes)

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
    <div className="pb-24">
      <div className="px-4 pt-5 pb-3 bg-gradient-to-b from-white to-transparent">
        <h1 className="text-xl font-bold text-stone-800 mb-3">Mis platos</h1>
        <div className="flex items-center gap-2 bg-white shadow-[0_2px_12px_rgba(120,113,108,0.08)] rounded-2xl px-3 py-2.5">
          <Search size={16} className="text-stone-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar plato..."
            className="bg-transparent flex-1 text-sm outline-none text-stone-800 placeholder:text-stone-400"
          />
        </div>
      </div>
      <div className="px-4">

      {dishes.length === 0 && (
        <p className="text-center text-stone-400 py-12 text-sm">¡Añadid vuestro primer plato!</p>
      )}

      {query ? (
        filtered.length === 0 ? (
          <p className="text-center text-stone-400 py-12 text-sm">Sin resultados para esa búsqueda</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((dish) => (
              <DishCard key={dish.id} dish={dish} onEdit={() => setEditing(dish)} onDelete={() => handleDelete(dish.id)} />
            ))}
          </div>
        )
      ) : (
        Object.entries(grouped).map(([groupName, groupDishes]) => (
          <div key={groupName} className="mb-5">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest px-1 mb-2">
              {groupName} · {groupDishes.length}
            </p>
            <div className="space-y-2">
              {groupDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} onEdit={() => setEditing(dish)} onDelete={() => handleDelete(dish.id)} />
              ))}
            </div>
          </div>
        ))
      )}
      </div>

      <button
        onClick={() => setEditing('new')}
        className="fixed bottom-20 right-4 bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 active:bg-emerald-700 cursor-pointer transition-all"
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
