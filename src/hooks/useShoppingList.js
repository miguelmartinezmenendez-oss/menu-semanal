import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { categorizeIngredient } from '../lib/categories'
import { DAYS, MAX_DISHES_PER_DAY, dishCol } from './useWeeklyMenu'

export function useShoppingList(householdId, weekStart) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!householdId || !weekStart) return
    setLoading(true)
    const { data } = await supabase
      .from('shopping_list_items')
      .select('*')
      .eq('household_id', householdId)
      .eq('week_start', weekStart)
      .order('created_at')
    setItems(data || [])
    setLoading(false)
  }, [householdId, weekStart])

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`shopping:${householdId}:${weekStart}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shopping_list_items', filter: `household_id=eq.${householdId}` },
        load
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [householdId, weekStart, load])

  async function generateFromMenu(dishes, menu) {
    if (!menu) return
    await supabase
      .from('shopping_list_items')
      .delete()
      .eq('household_id', householdId)
      .eq('week_start', weekStart)
      .eq('source', 'auto')

    const dishMap = Object.fromEntries(dishes.map((d) => [d.id, d]))
    const allIngredients = []
    for (const day of DAYS) {
      for (let s = 1; s <= MAX_DISHES_PER_DAY; s++) {
        const dishId = menu[dishCol(day, s)]
        if (dishId && dishMap[dishId]) {
          allIngredients.push(...(dishMap[dishId].ingredients || []))
        }
      }
    }

    const unique = [...new Set(allIngredients.map((i) => i.trim()).filter(Boolean))]
    if (!unique.length) return

    const rows = unique.map((name) => ({
      household_id: householdId,
      week_start: weekStart,
      name,
      category: categorizeIngredient(name),
      checked: false,
      source: 'auto',
    }))
    await supabase.from('shopping_list_items').insert(rows)
  }

  async function addItem(name) {
    await supabase.from('shopping_list_items').insert({
      household_id: householdId,
      week_start: weekStart,
      name,
      category: categorizeIngredient(name),
      checked: false,
      source: 'manual',
    })
  }

  async function toggleItem(id, checked) {
    await supabase.from('shopping_list_items').update({ checked }).eq('id', id)
  }

  async function clearChecked() {
    await supabase
      .from('shopping_list_items')
      .delete()
      .eq('household_id', householdId)
      .eq('week_start', weekStart)
      .eq('checked', true)
  }

  return { items, loading, generateFromMenu, addItem, toggleItem, clearChecked }
}
