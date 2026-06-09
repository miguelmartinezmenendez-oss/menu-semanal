import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useShoppingList } from '../hooks/useShoppingList'
import { getWeekStart } from '../hooks/useWeeklyMenu'

const CATEGORY_ORDER = ['Verduras', 'Proteínas', 'Lácteos', 'Otros']

export default function ShoppingList() {
  const { householdId } = useHousehold()
  const weekStart = getWeekStart()
  const { items, loading, addItem, toggleItem, clearChecked } = useShoppingList(
    householdId,
    weekStart
  )
  const [newItem, setNewItem] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!newItem.trim()) return
    await addItem(newItem.trim())
    setNewItem('')
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-400 pt-16 text-sm">Cargando...</div>
  }

  const unchecked = items.filter((i) => !i.checked)
  const checked = items.filter((i) => i.checked)

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catItems = unchecked.filter((i) => i.category === cat)
    if (catItems.length) acc[cat] = catItems
    return acc
  }, {})

  return (
    <div className="p-4 pb-32">
      {items.length === 0 ? (
        <div className="text-center text-gray-400 pt-16 space-y-2">
          <p className="text-sm">La lista está vacía.</p>
          <p className="text-xs text-gray-300">
            Genera la lista desde el menú semanal o añade ítems abajo.
          </p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="mb-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                {cat}
              </h3>
              <div className="space-y-1.5">
                {catItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-200 cursor-pointer active:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => toggleItem(item.id, true)}
                      className="w-5 h-5 rounded-full accent-emerald-600 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-gray-800">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {checked.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Comprado ({checked.length})
                </h3>
                <button
                  onClick={clearChecked}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500"
                >
                  <Trash2 size={12} /> Limpiar
                </button>
              </div>
              <div className="space-y-1.5">
                {checked.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 opacity-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() => toggleItem(item.id, false)}
                      className="w-5 h-5 rounded-full accent-emerald-600 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-gray-500 line-through">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <form
        onSubmit={handleAdd}
        className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 pb-2"
      >
        <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden px-3 py-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Añadir ítem manualmente..."
            className="flex-1 text-sm outline-none py-1"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white p-2 rounded-xl active:bg-emerald-700"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
