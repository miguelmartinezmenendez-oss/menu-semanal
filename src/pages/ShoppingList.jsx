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
    <div className="pb-36">
      <div className="px-4 pt-5 pb-3 bg-gradient-to-b from-white to-transparent">
        <h1 className="text-xl font-bold text-stone-800">Lista de la compra</h1>
      </div>

      <div className="px-4">
      {items.length === 0 ? (
        <div className="text-center text-stone-400 pt-12 space-y-2">
          <p className="text-sm">La lista está vacía.</p>
          <p className="text-xs text-stone-300">
            Genera la lista desde el menú semanal o añade ítems abajo.
          </p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="mb-5">
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">
                {cat}
              </h3>
              <div className="space-y-1.5">
                {catItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-[0_2px_12px_rgba(120,113,108,0.07)] cursor-pointer active:bg-stone-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => toggleItem(item.id, true)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer shrink-0"
                    />
                    <span className="flex-1 text-sm font-medium text-stone-800">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {checked.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-[11px] font-bold text-stone-300 uppercase tracking-widest">
                  En el carro ({checked.length})
                </h3>
                <button
                  onClick={clearChecked}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 size={12} /> Limpiar
                </button>
              </div>
              <div className="space-y-1.5">
                {checked.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 opacity-40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() => toggleItem(item.id, false)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer shrink-0"
                    />
                    <span className="flex-1 text-sm text-stone-500 line-through">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      </div>

      <form
        onSubmit={handleAdd}
        className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 pb-2"
      >
        <div className="flex gap-2 bg-white rounded-2xl shadow-[0_4px_20px_rgba(120,113,108,0.14)] overflow-hidden px-3 py-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Añadir ítem..."
            className="flex-1 text-sm outline-none py-1 text-stone-800 placeholder:text-stone-400"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white p-2 rounded-xl active:bg-emerald-700 cursor-pointer transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
