import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDishes(householdId) {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!householdId) return
    const { data } = await supabase
      .from('dishes')
      .select('*')
      .eq('household_id', householdId)
      .order('name')
    setDishes(data || [])
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`dishes:${householdId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dishes', filter: `household_id=eq.${householdId}` },
        load
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [householdId, load])

  async function addDish({ name, ingredients, notes }) {
    await supabase.from('dishes').insert({ household_id: householdId, name, ingredients, notes })
  }

  async function updateDish(id, { name, ingredients, notes }) {
    await supabase.from('dishes').update({ name, ingredients, notes }).eq('id', id)
  }

  async function deleteDish(id) {
    await supabase.from('dishes').delete().eq('id', id)
  }

  function randomDish(excludeIds = []) {
    const available = dishes.filter((d) => !excludeIds.includes(d.id))
    if (!available.length) return null
    return available[Math.floor(Math.random() * available.length)]
  }

  return { dishes, loading, addDish, updateDish, deleteDish, randomDish }
}
