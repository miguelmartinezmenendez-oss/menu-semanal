import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useDishes } from '../hooks/useDishes'
import { useWeeklyMenu, DAYS, formatWeekRange } from '../hooks/useWeeklyMenu'
import { useShoppingList } from '../hooks/useShoppingList'
import DayCard from '../components/DayCard'
import DishSelector from '../components/DishSelector'

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
    const slot = menu?.[`${dayKey}_dish_id`] ? 2 : 1
    if (slot === 2 && menu?.[`${dayKey}_dish2_id`]) return
    const usedIds = DAYS.flatMap((d) => [
      menu?.[`${d}_dish_id`],
      menu?.[`${d}_dish2_id`],
    ]).filter(Boolean)
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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevWeek}
          className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <span className="text-xs font-medium text-gray-600 text-center">
          {formatWeekRange(weekStart)}
        </span>
        <button
          onClick={nextWeek}
          className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {menuChanged && (
        <div className="mb-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700">
          El menú ha cambiado. Vuelve a generar la lista de la compra cuando termines.
        </div>
      )}

      <div className="space-y-2">
        {DAYS.map((day) => {
          const dish1 = dishMap[menu?.[`${day}_dish_id`]] ?? null
          const dish2 = dishMap[menu?.[`${day}_dish2_id`]] ?? null
          return (
            <DayCard
              key={day}
              label={DAY_LABELS[day]}
              dish1={dish1}
              dish2={dish2}
              onAdd1={() => setSelector({ day, slot: 1 })}
              onAdd2={() => setSelector({ day, slot: 2 })}
              onRandom={() => handleRandom(day)}
              onClear1={() => { clearDishForDay(day, 1); setMenuChanged(true) }}
              onClear2={() => { clearDishForDay(day, 2); setMenuChanged(true) }}
            />
          )
        })}
      </div>

      {hasAnyDish() && (
        <button
          onClick={handleGenerate}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-7 py-3.5 rounded-full shadow-lg text-sm font-semibold whitespace-nowrap active:bg-emerald-700"
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
  )
}
