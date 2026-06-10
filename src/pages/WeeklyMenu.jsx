import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useDishes } from '../hooks/useDishes'
import { useWeeklyMenu, DAYS, MAX_DISHES_PER_DAY, dishCol, formatWeekRange, getWeekStart } from '../hooks/useWeeklyMenu'
import { useShoppingList } from '../hooks/useShoppingList'
import DayCard from '../components/DayCard'
import DishSelector from '../components/DishSelector'

const THIS_WEEK = getWeekStart()

const DAY_LABELS = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

export default function WeeklyMenu() {
  const navigate = useNavigate()
  const { householdId } = useHousehold()
  const { dishes, randomDish } = useDishes(householdId)
  const { menu, weekStart, prevWeek, nextWeek, setDishForDay, clearDishForDay, hasAnyDish } =
    useWeeklyMenu(householdId)
  const { generateFromMenu } = useShoppingList(householdId, weekStart)
  const [selector, setSelector] = useState(null) // { day, slot }
  const [menuChanged, setMenuChanged] = useState(false)

  const dishMap = Object.fromEntries(dishes.map((d) => [d.id, d]))

  async function handleSelectDish(dishId) {
    await setDishForDay(selector.day, dishId, selector.slot)
    setMenuChanged(true)
    setSelector(null)
  }

  async function handleRandom(dayKey) {
    if (dishes.length === 0) {
      alert('Primero añade platos en Mis platos')
      return
    }
    const slot = Array.from({ length: MAX_DISHES_PER_DAY }, (_, i) => i + 1)
      .find((s) => !menu?.[dishCol(dayKey, s)])
    if (!slot) return
    const usedIds = DAYS.flatMap((d) =>
      Array.from({ length: MAX_DISHES_PER_DAY }, (_, i) => menu?.[dishCol(d, i + 1)])
    ).filter(Boolean)
    const dish = randomDish(usedIds)
    if (!dish) return
    await setDishForDay(dayKey, dish.id, slot)
    setMenuChanged(true)
  }

  async function handleGenerate() {
    await generateFromMenu(dishes, menu)
    setMenuChanged(false)
    navigate('/compra')
  }

  return (
    <div>
      <div className="px-4 pt-5 pb-4 bg-gradient-to-b from-white to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={prevWeek}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-stone-100 active:bg-stone-200 cursor-pointer transition-colors"
          >
            <ChevronLeft size={20} className="text-stone-500" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-stone-700">{formatWeekRange(weekStart)}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold ${
              weekStart === THIS_WEEK
                ? 'bg-emerald-100 text-emerald-700'
                : weekStart < THIS_WEEK
                ? 'bg-stone-100 text-stone-400'
                : 'bg-sky-50 text-sky-500'
            }`}>
              {weekStart === THIS_WEEK ? 'Esta semana' : weekStart < THIS_WEEK ? 'Anterior' : 'Siguiente'}
            </span>
          </div>
          <button
            onClick={nextWeek}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-stone-100 active:bg-stone-200 cursor-pointer transition-colors"
          >
            <ChevronRight size={20} className="text-stone-500" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
      {menuChanged && (
        <div className="mb-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-700 font-medium">
          El menú ha cambiado. Vuelve a generar la lista de la compra cuando termines.
        </div>
      )}

      <div className="space-y-2">
        {DAYS.map((day) => {
          const dishes = Array.from({ length: MAX_DISHES_PER_DAY }, (_, i) =>
            dishMap[menu?.[dishCol(day, i + 1)]] ?? null
          )
          return (
            <DayCard
              key={day}
              label={DAY_LABELS[day]}
              dishes={dishes}
              onAdd={(slot) => setSelector({ day, slot })}
              onClear={(slot) => { clearDishForDay(day, slot); setMenuChanged(true) }}
              onRandom={() => handleRandom(day)}
            />
          )
        })}
      </div>

      {hasAnyDish() && (
        <button
          onClick={handleGenerate}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-7 py-3.5 rounded-full shadow-lg shadow-emerald-200 text-sm font-bold whitespace-nowrap active:bg-emerald-700 transition-all cursor-pointer"
        >
          Generar lista de la compra
        </button>
      )}

      {selector && (
        <DishSelector
          dishes={dishes}
          onSelect={handleSelectDish}
          onClose={() => setSelector(null)}
        />
      )}
      </div>
    </div>
  )
}
