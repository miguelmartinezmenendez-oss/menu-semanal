import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { generateCode, setStoredHouseholdId } from '../lib/household'
import { useHousehold } from '../contexts/HouseholdContext'

export default function Welcome() {
  const { setHouseholdId } = useHousehold()
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    setError('')
    const code = generateCode()
    const { data, error } = await supabase
      .from('households')
      .insert({ code })
      .select()
      .single()
    if (error) {
      setError('Error al crear el hogar. Inténtalo de nuevo.')
      setLoading(false)
      return
    }
    setStoredHouseholdId(data.id)
    setHouseholdId(data.id)
  }

  async function handleJoin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('households')
      .select()
      .eq('code', joinCode.trim().toUpperCase())
      .single()
    if (error || !data) {
      setError('Código no encontrado. Comprueba que es correcto.')
      setLoading(false)
      return
    }
    setStoredHouseholdId(data.id)
    setHouseholdId(data.id)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-4xl mb-3">🍽️</div>
      <h1 className="text-2xl font-bold mb-1 text-gray-900">Menú Semanal</h1>
      <p className="text-gray-500 mb-10 text-center text-sm">
        Planifica las cenas de la semana juntos
      </p>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-semibold mb-4 disabled:opacity-50 active:bg-emerald-700"
      >
        Crear nuevo hogar
      </button>

      <div className="w-full flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">o únete a uno</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleJoin} className="w-full space-y-3">
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Código del hogar (ej. ABCD-1234)"
          className="w-full border border-gray-300 rounded-2xl px-4 py-3.5 text-center tracking-widest uppercase text-sm focus:outline-none focus:border-emerald-500"
          maxLength={9}
        />
        <button
          type="submit"
          disabled={loading || !joinCode.trim()}
          className="w-full bg-gray-800 text-white py-3.5 rounded-2xl font-semibold disabled:opacity-40 active:bg-gray-900"
        >
          Unirse
        </button>
      </form>

      {error && (
        <p className="mt-5 text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  )
}
