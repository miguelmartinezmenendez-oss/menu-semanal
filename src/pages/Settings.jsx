import { useEffect, useState } from 'react'
import { Copy, Check, LogOut, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useHousehold } from '../contexts/HouseholdContext'
import { clearStoredHouseholdId } from '../lib/household'
import { useDishes } from '../hooks/useDishes'

export default function Settings() {
  const { householdId, setHouseholdId } = useHousehold()
  const { dishes, categorizeAll } = useDishes(householdId)
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [categorizing, setCategorizing] = useState(false)
  const [categorized, setCategorized] = useState(false)

  const untypedCount = dishes.filter((d) => !d.type).length

  useEffect(() => {
    supabase
      .from('households')
      .select('code')
      .eq('id', householdId)
      .single()
      .then(({ data }) => data && setCode(data.code))
  }, [householdId])

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCategorizeAll() {
    setCategorizing(true)
    await categorizeAll()
    setCategorizing(false)
    setCategorized(true)
    setTimeout(() => setCategorized(false), 3000)
  }

  function handleLeave() {
    if (!confirm('¿Salir del hogar? Tendrás que volver a introducir el código para reconectarte.')) return
    clearStoredHouseholdId()
    setHouseholdId(null)
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold text-gray-900 mb-6">Ajustes</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          Código del hogar
        </p>
        <p className="text-sm text-gray-500 mb-3">
          Comparte este código con tu pareja para que pueda unirse y ver el mismo menú.
        </p>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <span className="flex-1 font-mono font-bold text-lg text-gray-800 tracking-widest">
            {code || '...'}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-emerald-600"
          >
            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {untypedCount > 0 && (
        <button
          onClick={handleCategorizeAll}
          disabled={categorizing}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-medium mb-3 active:bg-emerald-100 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles size={16} />
          {categorized
            ? 'Tipos aplicados'
            : categorizing
            ? 'Detectando...'
            : `Detectar tipo en ${untypedCount} plato${untypedCount !== 1 ? 's' : ''}`}
        </button>
      )}

      <button
        onClick={handleLeave}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-400 text-sm font-medium active:bg-red-50 cursor-pointer"
      >
        <LogOut size={16} /> Salir del hogar
      </button>
    </div>
  )
}
