import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HouseholdProvider, useHousehold } from './contexts/HouseholdContext'
import Welcome from './pages/Welcome'
import WeeklyMenu from './pages/WeeklyMenu'
import MyDishes from './pages/MyDishes'
import ShoppingList from './pages/ShoppingList'
import Settings from './pages/Settings'
import BottomNav from './components/BottomNav'

function AppRoutes() {
  const { householdId } = useHousehold()

  if (!householdId) return <Welcome />

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<WeeklyMenu />} />
          <Route path="/platos" element={<MyDishes />} />
          <Route path="/compra" element={<ShoppingList />} />
          <Route path="/ajustes" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <HouseholdProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HouseholdProvider>
  )
}
