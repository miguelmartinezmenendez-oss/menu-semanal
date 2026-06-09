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
  const [selectorDay, setSelectorDay] = useState(null)
  const [menuChanged, setMenuChanged] = useState(false)

  const dishMap = Object.fromEntries(dishes.map((d) => [d.id, d]))

  async function handleSelectDish(dishId) {
    await setDishForDay(selectorDay, dishId)
    setMenuChanged(true)
    setSelectorDay(null)
  }

  async function handleRandom(dayKey) {
    if (dishes.length === 0) {
      alert('Primero añade platos en Mis platos')
      return
    }
    const usedIds = DAYS.map((d) => menu?.[`${d}_dish_id`]).filter(Boolean)
    const dish = randomDish(usedIds)
    if (!dish) return
    await setDishForDay(dayKey, dish.id)
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
          const dishId = menu?.[`${day}_dish_id`]
          const dish = dishId ? dishMap[dishId] : null
          return (
            <DayCard
              key={day}
              label={DAY_LABELS[day]}
              dish={dish}
              onAdd={() => setSelectorDay(day)}
              onRandom={() => handleRandom(day)}
              onClear={() => {
                clearDishForDay(day)
                setMenuChanged(true)
              }}
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

      {selectorDay && (
        <DishSelector
          dishes={dishes}
          onSelect={handleSelectDish}
          onClose={() => setSelectorDay(null)}
        />
      )}
    </div>
  )
}
