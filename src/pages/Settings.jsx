import { useEffect, useState } from 'react'
import { Copy, Check, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useHousehold } from '../contexts/HouseholdContext'
import { clearStoredHouseholdId } from '../lib/household'

export default function Settings() {
  const { householdId, setHouseholdId } = useHousehold()
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

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

      <button
        onClick={handleLeave}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-400 text-sm font-medium active:bg-red-50"
      >
        <LogOut size={16} /> Salir del hogar
      </button>
    </div>
  )
}
