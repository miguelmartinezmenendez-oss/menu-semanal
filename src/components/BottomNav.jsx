import { NavLink } from 'react-router-dom'
import { CalendarDays, UtensilsCrossed, ShoppingCart, Settings } from 'lucide-react'

export default function BottomNav() {
  const base = 'flex flex-col items-center gap-1 py-2 px-4 text-xs transition-colors'
  const active = 'text-emerald-600'
  const inactive = 'text-gray-400'

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around z-10">
      <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <CalendarDays size={22} />
        <span>Menú</span>
      </NavLink>
      <NavLink to="/platos" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <UtensilsCrossed size={22} />
        <span>Mis platos</span>
      </NavLink>
      <NavLink to="/compra" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <ShoppingCart size={22} />
        <span>Compra</span>
      </NavLink>
      <NavLink to="/ajustes" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <Settings size={22} />
        <span>Ajustes</span>
      </NavLink>
    </nav>
  )
}
