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
    <div className="pb-8">
      <div className="px-4 pt-5 pb-4 bg-gradient-to-b from-white to-transparent">
        <h1 className="text-xl font-bold text-stone-800">Ajustes</h1>
      </div>

      <div className="px-4 space-y-3">
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(120,113,108,0.08)] p-4">
        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-1">
          Código del hogar
        </p>
        <p className="text-sm text-stone-500 mb-3">
          Comparte este código con tu pareja para que pueda unirse y ver el mismo menú.
        </p>
        <div className="flex items-center gap-3 bg-stone-50 rounded-xl px-4 py-3">
          <span className="flex-1 font-mono font-bold text-lg text-stone-800 tracking-widest">
            {code || '···'}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 text-stone-400 hover:text-emerald-600 cursor-pointer transition-colors"
          >
            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {untypedCount > 0 && (
        <button
          onClick={handleCategorizeAll}
          disabled={categorizing}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-semibold active:bg-emerald-100 disabled:opacity-50 cursor-pointer transition-colors"
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
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-100 text-red-400 text-sm font-semibold active:bg-red-50 cursor-pointer transition-colors"
      >
        <LogOut size={16} /> Salir del hogar
      </button>
      </div>
    </div>
  )
}
