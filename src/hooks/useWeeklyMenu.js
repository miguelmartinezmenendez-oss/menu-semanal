import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export function formatWeekRange(weekStart) {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const fmt = (d) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
  return `${fmt(start)} – ${fmt(end)}`
}

export function useWeeklyMenu(householdId) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart())
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!householdId) return
    setLoading(true)
    const { data } = await supabase
      .from('weekly_menu')
      .select('*')
      .eq('household_id', householdId)
      .eq('week_start', weekStart)
      .maybeSingle()
    setMenu(data)
    setLoading(false)
  }, [householdId, weekStart])

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`weekly_menu:${householdId}:${weekStart}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weekly_menu', filter: `household_id=eq.${householdId}` },
        load
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [householdId, weekStart, load])

  function prevWeek() {
    const d = new Date(weekStart + 'T00:00:00')
    d.setDate(d.getDate() - 7)
    setWeekStart(d.toISOString().split('T')[0])
  }

  function nextWeek() {
    const d = new Date(weekStart + 'T00:00:00')
    d.setDate(d.getDate() + 7)
    setWeekStart(d.toISOString().split('T')[0])
  }

  async function setDishForDay(dayKey, dishId) {
    const col = `${dayKey}_dish_id`
    if (menu) {
      await supabase.from('weekly_menu').update({ [col]: dishId }).eq('id', menu.id)
    } else {
      await supabase.from('weekly_menu').insert({
        household_id: householdId,
        week_start: weekStart,
        [col]: dishId,
      })
    }
  }

  async function clearDishForDay(dayKey) {
    if (!menu) return
    await supabase
      .from('weekly_menu')
      .update({ [`${dayKey}_dish_id`]: null })
      .eq('id', menu.id)
  }

  function hasAnyDish() {
    if (!menu) return false
    return DAYS.some((d) => menu[`${d}_dish_id`])
  }

  return { menu, weekStart, loading, prevWeek, nextWeek, setDishForDay, clearDishForDay, hasAnyDish }
}
