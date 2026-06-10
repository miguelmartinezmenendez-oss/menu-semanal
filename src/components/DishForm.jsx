import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { DISH_TYPES } from '../lib/dishTypes'

export default function DishForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState(initial?.type ?? '')
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.length ? initial.ingredients : ['']
  )
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [saving, setSaving] = useState(false)

  function updateIngredient(i, value) {
    setIngredients((prev) => prev.map((ing, idx) => (idx === i ? value : ing)))
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, ''])
  }

  function removeIngredient(i) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || saving) return
    setSaving(true)
    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean)
    await onSave({
      name: name.trim(),
      type: type || null,
      ingredients: cleanIngredients,
      notes: notes.trim() || null,
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="font-semibold text-gray-900">
            {initial ? 'Editar plato' : 'Nuevo plato'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Pollo al horno con patatas"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Tipo <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DISH_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(type === t ? '' : t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    type === t
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Ingredientes</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={ing}
                    onChange={(e) => updateIngredient(i, e.target.value)}
                    placeholder={`Ingrediente ${i + 1}`}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="p-1 text-gray-400 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 flex items-center gap-1.5 text-sm text-emerald-600 font-medium"
            >
              <Plus size={16} /> Añadir ingrediente
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Notas <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ej. Sin gluten, favorita de verano..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-50 active:bg-emerald-700"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}
