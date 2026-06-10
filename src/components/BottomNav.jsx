import { NavLink } from 'react-router-dom'
import { CalendarDays, UtensilsCrossed, ShoppingCart, Settings } from 'lucide-react'

const tabs = [
  { to: '/', end: true,  Icon: CalendarDays,    label: 'Menú' },
  { to: '/platos',       Icon: UtensilsCrossed, label: 'Mis platos' },
  { to: '/compra',       Icon: ShoppingCart,    label: 'Compra' },
  { to: '/ajustes',      Icon: Settings,        label: 'Ajustes' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-sm border-t border-stone-100 flex justify-around items-center z-10 px-2 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      {tabs.map(({ to, end, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer ${
              isActive ? 'bg-emerald-50 text-emerald-700' : 'text-stone-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
