# Menu Semanal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicación web PWA mobile-first para planificar cenas semanales en pareja con sincronización en tiempo real via Supabase.

**Architecture:** React SPA con Vite y Tailwind, Supabase como backend (PostgreSQL + Realtime). Acceso por código de hogar sin cuentas. Cuatro pantallas: bienvenida, menú semanal, mis platos, lista de la compra.

**Tech Stack:** React 18, Vite, Tailwind CSS, Supabase JS v2, react-router-dom v6, lucide-react, vite-plugin-pwa, Vitest

---

## Estructura de archivos

```
menu-semanal/
├── public/
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── household.js
│   │   └── categories.js
│   ├── contexts/
│   │   └── HouseholdContext.jsx
│   ├── hooks/
│   │   ├── useDishes.js
│   │   ├── useWeeklyMenu.js
│   │   └── useShoppingList.js
│   ├── pages/
│   │   ├── Welcome.jsx
│   │   ├── WeeklyMenu.jsx
│   │   ├── MyDishes.jsx
│   │   └── ShoppingList.jsx
│   └── components/
│       ├── BottomNav.jsx
│       ├── DayCard.jsx
│       ├── DishSelector.jsx
│       ├── DishCard.jsx
│       └── DishForm.jsx
├── src/__tests__/
│   ├── household.test.js
│   ├── categories.test.js
│   └── weeklyMenu.test.js
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── package.json
```

---

## Task 1: Inicialización del proyecto

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/index.css`, `.env.example`

- [ ] **Step 1: Crear proyecto Vite**

```bash
cd ~/proyectos/menu-semanal
npm create vite@latest . -- --template react
```

- [ ] **Step 2: Instalar dependencias**

```bash
npm install
npm install @supabase/supabase-js react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer vite-plugin-pwa vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom
npx tailwindcss init -p
```

- [ ] **Step 3: Configurar Tailwind**

Reemplazar `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 4: Configurar vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Menú Semanal',
        short_name: 'Menú',
        description: 'Planifica las cenas de la semana juntos',
        theme_color: '#059669',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
  },
})
```

- [ ] **Step 5: Configurar Tailwind en index.css**

Reemplazar `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { -webkit-tap-highlight-color: transparent; }
body { font-family: system-ui, sans-serif; background: #f9fafb; }
```

- [ ] **Step 6: Crear .env.example**

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

Copiar como `.env.local` (se llenará en Task 2):

```bash
cp .env.example .env.local
```

- [ ] **Step 7: Crear archivo de setup de tests**

Crear `src/__tests__/setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Crear iconos PWA mínimos**

```bash
# Generar un icono verde esmeralda de 512x512 con canvas (script node)
node -e "
const { createCanvas } = require('canvas');
" 2>/dev/null || echo 'canvas no disponible'
```

Si el comando falla (canvas no instalado), crear los iconos manualmente:
- Usar cualquier imagen cuadrada 192x192 y 512x512 en `public/`
- O usar este one-liner con Python:

```bash
python3 -c "
import struct, zlib, base64

def make_png(size, r, g, b):
    def chunk(name, data):
        c = zlib.crc32(name + data) & 0xffffffff
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    row = b'\x00' + bytes([r, g, b] * size)
    idat = zlib.compress(row * size)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

open('public/icon-192.png','wb').write(make_png(192,5,150,105))
open('public/icon-512.png','wb').write(make_png(512,5,150,105))
print('Iconos creados')
"
```

- [ ] **Step 9: Verificar que el proyecto arranca**

```bash
npm run dev
```

Esperado: servidor en `http://localhost:5173` sin errores.

- [ ] **Step 10: Commit inicial**

```bash
git init
git add .
git commit -m "feat: inicializar proyecto React+Vite+Tailwind+PWA"
```

---

## Task 2: Schema de Supabase

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Crear cuenta Supabase y proyecto**

1. Ir a https://supabase.com
2. Crear cuenta gratuita (o usar una existente)
3. "New project" → nombre: `menu-semanal` → contraseña para BD → región: West EU (Ireland)
4. Esperar ~2 minutos a que el proyecto se inicialice

- [ ] **Step 2: Copiar credenciales**

En el dashboard de Supabase: Settings → API
- Copiar "Project URL" → `VITE_SUPABASE_URL` en `.env.local`
- Copiar "anon public" key → `VITE_SUPABASE_ANON_KEY` en `.env.local`

- [ ] **Step 3: Crear archivo de schema**

Crear `supabase/schema.sql`:

```sql
-- households
create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_at timestamptz default now()
);

-- dishes
create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null,
  ingredients text[] not null default '{}',
  notes text,
  created_at timestamptz default now()
);

-- weekly_menu
create table if not exists weekly_menu (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  week_start date not null,
  monday_dish_id uuid references dishes(id) on delete set null,
  tuesday_dish_id uuid references dishes(id) on delete set null,
  wednesday_dish_id uuid references dishes(id) on delete set null,
  thursday_dish_id uuid references dishes(id) on delete set null,
  friday_dish_id uuid references dishes(id) on delete set null,
  saturday_dish_id uuid references dishes(id) on delete set null,
  sunday_dish_id uuid references dishes(id) on delete set null,
  unique(household_id, week_start)
);

-- shopping_list_items
create table if not exists shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  week_start date not null,
  name text not null,
  category text not null default 'Otros',
  checked boolean not null default false,
  source text not null default 'manual',
  created_at timestamptz default now()
);

-- Row Level Security: permitir acceso anónimo (acceso controlado por código de hogar)
alter table households enable row level security;
alter table dishes enable row level security;
alter table weekly_menu enable row level security;
alter table shopping_list_items enable row level security;

create policy "anon_all_households" on households for all to anon using (true) with check (true);
create policy "anon_all_dishes" on dishes for all to anon using (true) with check (true);
create policy "anon_all_weekly_menu" on weekly_menu for all to anon using (true) with check (true);
create policy "anon_all_shopping" on shopping_list_items for all to anon using (true) with check (true);

-- Habilitar Realtime para las tablas
alter publication supabase_realtime add table dishes;
alter publication supabase_realtime add table weekly_menu;
alter publication supabase_realtime add table shopping_list_items;
```

- [ ] **Step 4: Ejecutar schema en Supabase**

En el dashboard: SQL Editor → New query → pegar el contenido de `supabase/schema.sql` → Run

Verificar: Table Editor muestra las 4 tablas.

- [ ] **Step 5: Commit**

```bash
git add supabase/schema.sql .env.example
git commit -m "feat: schema de base de datos en Supabase"
```

---

## Task 3: Utilidades base

**Files:**
- Create: `src/lib/supabase.js`, `src/lib/household.js`, `src/lib/categories.js`
- Create: `src/__tests__/household.test.js`, `src/__tests__/categories.test.js`

- [ ] **Step 1: Escribir tests de household**

Crear `src/__tests__/household.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { generateCode } from '../lib/household'

describe('generateCode', () => {
  it('genera un código con formato XXXX-XXXX', () => {
    const code = generateCode()
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  })

  it('genera códigos únicos en llamadas sucesivas', () => {
    const codes = new Set(Array.from({ length: 100 }, generateCode))
    expect(codes.size).toBeGreaterThan(95)
  })

  it('no incluye caracteres ambiguos (0, O, I, 1)', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCode().replace('-', '')
      expect(code).not.toMatch(/[01IO]/)
    }
  })
})
```

- [ ] **Step 2: Ejecutar tests — deben fallar**

```bash
npx vitest run src/__tests__/household.test.js
```

Esperado: FAIL — "Cannot find module '../lib/household'"

- [ ] **Step 3: Crear src/lib/household.js**

```js
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const STORAGE_KEY = 'menu_household_id'

export function generateCode() {
  const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)]
  const part = (n) => Array.from({ length: n }, rand).join('')
  return `${part(4)}-${part(4)}`
}

export function getStoredHouseholdId() {
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredHouseholdId(id) {
  localStorage.setItem(STORAGE_KEY, id)
}

export function clearStoredHouseholdId() {
  localStorage.removeItem(STORAGE_KEY)
}
```

- [ ] **Step 4: Ejecutar tests — deben pasar**

```bash
npx vitest run src/__tests__/household.test.js
```

Esperado: PASS (3 tests)

- [ ] **Step 5: Escribir tests de categories**

Crear `src/__tests__/categories.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { categorizeIngredient } from '../lib/categories'

describe('categorizeIngredient', () => {
  it('clasifica verduras correctamente', () => {
    expect(categorizeIngredient('tomate cherry')).toBe('Verduras')
    expect(categorizeIngredient('Cebolla morada')).toBe('Verduras')
    expect(categorizeIngredient('zanahoria rallada')).toBe('Verduras')
  })

  it('clasifica proteínas correctamente', () => {
    expect(categorizeIngredient('pechuga de pollo')).toBe('Proteínas')
    expect(categorizeIngredient('salmón fresco')).toBe('Proteínas')
    expect(categorizeIngredient('huevo campero')).toBe('Proteínas')
  })

  it('clasifica lácteos correctamente', () => {
    expect(categorizeIngredient('queso parmesano')).toBe('Lácteos')
    expect(categorizeIngredient('nata para cocinar')).toBe('Lácteos')
    expect(categorizeIngredient('mantequilla')).toBe('Lácteos')
  })

  it('devuelve Otros para ingredientes no reconocidos', () => {
    expect(categorizeIngredient('pasta')).toBe('Otros')
    expect(categorizeIngredient('aceite de oliva')).toBe('Otros')
    expect(categorizeIngredient('sal')).toBe('Otros')
  })
})
```

- [ ] **Step 6: Ejecutar tests — deben fallar**

```bash
npx vitest run src/__tests__/categories.test.js
```

Esperado: FAIL

- [ ] **Step 7: Crear src/lib/categories.js**

```js
const KEYWORDS = {
  Verduras: [
    'tomate', 'cebolla', 'ajo', 'zanahoria', 'pimiento', 'lechuga',
    'espinaca', 'calabacín', 'berenjena', 'patata', 'brócoli', 'coliflor',
    'puerro', 'apio', 'pepino', 'champiñón', 'seta', 'acelga', 'guisante',
    'judía verde', 'rúcula', 'endivía',
  ],
  Proteínas: [
    'pollo', 'carne', 'ternera', 'cerdo', 'jamón', 'bacalao', 'salmón',
    'atún', 'gamba', 'huevo', 'tofu', 'lenteja', 'garbanzo', 'pescado',
    'merluza', 'sepia', 'calamar', 'mejillón', 'chorizo', 'morcilla',
    'pavo', 'cordero', 'conejo',
  ],
  Lácteos: [
    'leche', 'queso', 'mantequilla', 'nata', 'yogur', 'mozzarella',
    'parmesano', 'crema', 'requesón', 'ricotta',
  ],
}

export function categorizeIngredient(ingredient) {
  const lower = ingredient.toLowerCase()
  for (const [cat, kws] of Object.entries(KEYWORDS)) {
    if (kws.some((kw) => lower.includes(kw))) return cat
  }
  return 'Otros'
}
```

- [ ] **Step 8: Ejecutar tests — deben pasar**

```bash
npx vitest run src/__tests__/categories.test.js
```

Esperado: PASS (4 tests)

- [ ] **Step 9: Crear src/lib/supabase.js**

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

- [ ] **Step 10: Commit**

```bash
git add src/lib/ src/__tests__/
git commit -m "feat: utilidades base (household, categories, supabase)"
```

---

## Task 4: App shell, contexto y navegación

**Files:**
- Create: `src/contexts/HouseholdContext.jsx`, `src/App.jsx`, `src/components/BottomNav.jsx`, `src/main.jsx`
- Create: `src/pages/Welcome.jsx`, `src/pages/WeeklyMenu.jsx`, `src/pages/MyDishes.jsx`, `src/pages/ShoppingList.jsx` (stubs)

- [ ] **Step 1: Crear HouseholdContext**

Crear `src/contexts/HouseholdContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'
import { getStoredHouseholdId } from '../lib/household'

const HouseholdContext = createContext(null)

export function HouseholdProvider({ children }) {
  const [householdId, setHouseholdId] = useState(() => getStoredHouseholdId())
  return (
    <HouseholdContext.Provider value={{ householdId, setHouseholdId }}>
      {children}
    </HouseholdContext.Provider>
  )
}

export function useHousehold() {
  return useContext(HouseholdContext)
}
```

- [ ] **Step 2: Crear stubs de páginas**

Crear `src/pages/Welcome.jsx`:
```jsx
export default function Welcome() {
  return <div className="p-4">Bienvenida (próximamente)</div>
}
```

Crear `src/pages/WeeklyMenu.jsx`:
```jsx
export default function WeeklyMenu() {
  return <div className="p-4">Menú semanal (próximamente)</div>
}
```

Crear `src/pages/MyDishes.jsx`:
```jsx
export default function MyDishes() {
  return <div className="p-4">Mis platos (próximamente)</div>
}
```

Crear `src/pages/ShoppingList.jsx`:
```jsx
export default function ShoppingList() {
  return <div className="p-4">Lista de la compra (próximamente)</div>
}
```

- [ ] **Step 3: Crear BottomNav**

Crear `src/components/BottomNav.jsx`:

```jsx
import { NavLink } from 'react-router-dom'
import { CalendarDays, UtensilsCrossed, ShoppingCart } from 'lucide-react'

export default function BottomNav() {
  const base = 'flex flex-col items-center gap-1 py-2 px-5 text-xs transition-colors'
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
    </nav>
  )
}
```

- [ ] **Step 4: Crear App.jsx**

Crear `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HouseholdProvider, useHousehold } from './contexts/HouseholdContext'
import Welcome from './pages/Welcome'
import WeeklyMenu from './pages/WeeklyMenu'
import MyDishes from './pages/MyDishes'
import ShoppingList from './pages/ShoppingList'
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
```

- [ ] **Step 5: Actualizar main.jsx**

Reemplazar `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 6: Verificar en navegador**

```bash
npm run dev
```

Esperado: pantalla en blanco con el stub "Bienvenida (próximamente)" porque no hay householdId aún.

- [ ] **Step 7: Commit**

```bash
git add src/
git commit -m "feat: app shell con routing y navegación inferior"
```

---

## Task 5: Pantalla de bienvenida

**Files:**
- Modify: `src/pages/Welcome.jsx`

- [ ] **Step 1: Implementar Welcome.jsx**

Reemplazar `src/pages/Welcome.jsx`:

```jsx
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
```

- [ ] **Step 2: Probar en navegador**

```bash
npm run dev
```

1. Abrir http://localhost:5173
2. Pulsar "Crear nuevo hogar" → debe navegar al menú semanal (stub)
3. Borrar `menu_household_id` de localStorage (DevTools → Application → Local Storage) → refrescar → volver a la bienvenida
4. Probar unirse con un código inexistente → debe mostrar error

- [ ] **Step 3: Commit**

```bash
git add src/pages/Welcome.jsx
git commit -m "feat: pantalla de bienvenida con creación y unión de hogar"
```

---

## Task 6: Hook useDishes + pantalla Mis Platos

**Files:**
- Create: `src/hooks/useDishes.js`, `src/components/DishCard.jsx`, `src/components/DishForm.jsx`
- Modify: `src/pages/MyDishes.jsx`

- [ ] **Step 1: Crear src/hooks/useDishes.js**

```js
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
```

- [ ] **Step 2: Crear src/components/DishCard.jsx**

```jsx
import { Pencil, Trash2 } from 'lucide-react'

export default function DishCard({ dish, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800">{dish.name}</p>
        {dish.ingredients?.length > 0 && (
          <p className="text-xs text-gray-400 mt-1 truncate">
            {dish.ingredients.join(', ')}
          </p>
        )}
        {dish.notes && (
          <p className="text-xs text-emerald-600 mt-1 italic">{dish.notes}</p>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg active:bg-gray-100"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-400 rounded-lg active:bg-gray-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Crear src/components/DishForm.jsx**

```jsx
import { useState } from 'react'
import { X, Plus } from 'lucide-react'

export default function DishForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.length ? initial.ingredients : ['']
  )
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [saving, setSaving] = useState(false)

  function updateIngredient(i, value) {
    setIngredients((prev) => prev.map((ing, idx) => (idx === i ? value : ing)))
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, ''])
  }

  function removeIngredient(i) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || saving) return
    setSaving(true)
    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean)
    await onSave({ name: name.trim(), ingredients: cleanIngredients, notes: notes.trim() || null })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="font-semibold text-gray-900">
            {initial ? 'Editar plato' : 'Nuevo plato'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Pollo al horno con patatas"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Ingredientes</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={ing}
                    onChange={(e) => updateIngredient(i, e.target.value)}
                    placeholder={`Ingrediente ${i + 1}`}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="p-1 text-gray-400 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 flex items-center gap-1.5 text-sm text-emerald-600 font-medium"
            >
              <Plus size={16} /> Añadir ingrediente
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Notas <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ej. Sin gluten, favorita de verano..."
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-50 active:bg-emerald-700"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implementar MyDishes.jsx**

Reemplazar `src/pages/MyDishes.jsx`:

```jsx
import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useDishes } from '../hooks/useDishes'
import DishCard from '../components/DishCard'
import DishForm from '../components/DishForm'

export default function MyDishes() {
  const { householdId } = useHousehold()
  const { dishes, loading, addDish, updateDish, deleteDish } = useDishes(householdId)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)

  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  )

  async function handleSave(data) {
    if (editing === 'new') await addDish(data)
    else await updateDish(editing.id, data)
    setEditing(null)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este plato?')) return
    await deleteDish(id)
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-400 pt-16 text-sm">Cargando...</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 mb-4">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar plato..."
          className="bg-transparent flex-1 text-sm outline-none"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">
          {dishes.length === 0
            ? '¡Añadid vuestro primer plato!'
            : 'Sin resultados para esa búsqueda'}
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onEdit={() => setEditing(dish)}
            onDelete={() => handleDelete(dish.id)}
          />
        ))}
      </div>

      <button
        onClick={() => setEditing('new')}
        className="fixed bottom-20 right-4 bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:bg-emerald-700"
      >
        <Plus size={26} />
      </button>

      {editing && (
        <DishForm
          initial={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 5: Probar en navegador**

```bash
npm run dev
```

1. Navegar a "Mis platos"
2. Pulsar "+" → añadir un plato con ingredientes → guardar
3. El plato aparece en la lista en tiempo real
4. Editar el plato → cambiar nombre → guardar
5. Eliminar el plato

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useDishes.js src/components/DishCard.jsx src/components/DishForm.jsx src/pages/MyDishes.jsx
git commit -m "feat: gestión de platos (CRUD + realtime)"
```

---

## Task 7: Hook useWeeklyMenu + pantalla Menú de la semana

**Files:**
- Create: `src/hooks/useWeeklyMenu.js`, `src/components/DayCard.jsx`, `src/components/DishSelector.jsx`
- Create: `src/__tests__/weeklyMenu.test.js`
- Modify: `src/pages/WeeklyMenu.jsx`

- [ ] **Step 1: Escribir tests de useWeeklyMenu utils**

Crear `src/__tests__/weeklyMenu.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { getWeekStart, formatWeekRange } from '../hooks/useWeeklyMenu'

describe('getWeekStart', () => {
  it('devuelve el lunes de la semana para un miércoles', () => {
    const result = getWeekStart(new Date('2026-06-10'))
    expect(result).toBe('2026-06-08')
  })

  it('devuelve el mismo lunes cuando la fecha es lunes', () => {
    const result = getWeekStart(new Date('2026-06-08'))
    expect(result).toBe('2026-06-08')
  })

  it('devuelve el lunes anterior cuando la fecha es domingo', () => {
    const result = getWeekStart(new Date('2026-06-14'))
    expect(result).toBe('2026-06-08')
  })
})

describe('formatWeekRange', () => {
  it('formatea el rango de semana en español', () => {
    const result = formatWeekRange('2026-06-08')
    expect(result).toContain('8')
    expect(result).toContain('14')
    expect(result.toLowerCase()).toContain('junio')
  })
})
```

- [ ] **Step 2: Ejecutar tests — deben fallar**

```bash
npx vitest run src/__tests__/weeklyMenu.test.js
```

Esperado: FAIL

- [ ] **Step 3: Crear src/hooks/useWeeklyMenu.js**

```js
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
```

- [ ] **Step 4: Ejecutar tests — deben pasar**

```bash
npx vitest run src/__tests__/weeklyMenu.test.js
```

Esperado: PASS (4 tests)

- [ ] **Step 5: Crear src/components/DayCard.jsx**

```jsx
import { Plus, X, Dices } from 'lucide-react'

export default function DayCard({ label, dish, onAdd, onRandom, onClear }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-3">
      <span className="text-xs font-semibold text-gray-400 w-8 shrink-0 uppercase">
        {label.slice(0, 3)}
      </span>

      {dish ? (
        <div className="flex-1 flex items-center justify-between gap-2">
          <button
            onClick={onAdd}
            className="flex-1 text-left text-sm font-medium text-gray-800 truncate"
          >
            {dish.name}
          </button>
          <button
            onClick={onClear}
            className="p-1 text-gray-300 hover:text-red-400 shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between gap-2">
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600"
          >
            <Plus size={15} />
            <span>Añadir cena</span>
          </button>
          <button
            onClick={onRandom}
            className="p-1 text-gray-300 hover:text-emerald-500 shrink-0"
            title="Sugiéreme algo"
          >
            <Dices size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Crear src/components/DishSelector.jsx**

```jsx
import { useState } from 'react'
import { X, Search } from 'lucide-react'

export default function DishSelector({ dishes, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[75vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Elige un plato</h2>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="bg-transparent flex-1 text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">Sin resultados</p>
          ) : (
            filtered.map((dish) => (
              <button
                key={dish.id}
                onClick={() => onSelect(dish.id)}
                className="w-full text-left px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100 last:border-0"
              >
                <p className="text-sm font-medium text-gray-800">{dish.name}</p>
                {dish.ingredients?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {dish.ingredients.join(', ')}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Implementar WeeklyMenu.jsx**

Reemplazar `src/pages/WeeklyMenu.jsx`:

```jsx
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
```

- [ ] **Step 8: Probar en navegador**

```bash
npm run dev
```

1. Añadir algunos platos en "Mis platos"
2. Ir al menú semanal → asignar platos a varios días
3. Probar el dado (sugerencia aleatoria)
4. Probar navegar a semana anterior/siguiente
5. Aparece el botón "Generar lista de la compra" cuando hay al menos un plato

- [ ] **Step 9: Commit**

```bash
git add src/hooks/useWeeklyMenu.js src/components/DayCard.jsx src/components/DishSelector.jsx src/pages/WeeklyMenu.jsx src/__tests__/weeklyMenu.test.js
git commit -m "feat: menú semanal con selección manual y sugerencia aleatoria"
```

---

## Task 8: Hook useShoppingList + pantalla Lista de la compra

**Files:**
- Create: `src/hooks/useShoppingList.js`
- Modify: `src/pages/ShoppingList.jsx`

- [ ] **Step 1: Crear src/hooks/useShoppingList.js**

```js
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { categorizeIngredient } from '../lib/categories'
import { DAYS } from './useWeeklyMenu'

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
      const dishId = menu[`${day}_dish_id`]
      if (dishId && dishMap[dishId]) {
        allIngredients.push(...(dishMap[dishId].ingredients || []))
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
```

- [ ] **Step 2: Implementar ShoppingList.jsx**

Reemplazar `src/pages/ShoppingList.jsx`:

```jsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useShoppingList } from '../hooks/useShoppingList'
import { useWeeklyMenu, getWeekStart } from '../hooks/useWeeklyMenu'

const CATEGORY_ORDER = ['Verduras', 'Proteínas', 'Lácteos', 'Otros']

export default function ShoppingList() {
  const { householdId } = useHousehold()
  const weekStart = getWeekStart()
  const { items, loading, addItem, toggleItem, clearChecked } = useShoppingList(
    householdId,
    weekStart
  )
  const [newItem, setNewItem] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!newItem.trim()) return
    await addItem(newItem.trim())
    setNewItem('')
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-400 pt-16 text-sm">Cargando...</div>
  }

  const unchecked = items.filter((i) => !i.checked)
  const checked = items.filter((i) => i.checked)

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catItems = unchecked.filter((i) => i.category === cat)
    if (catItems.length) acc[cat] = catItems
    return acc
  }, {})

  return (
    <div className="p-4 pb-32">
      {items.length === 0 ? (
        <div className="text-center text-gray-400 pt-16 space-y-2">
          <p className="text-sm">La lista está vacía.</p>
          <p className="text-xs text-gray-300">
            Genera la lista desde el menú semanal o añade ítems abajo.
          </p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="mb-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                {cat}
              </h3>
              <div className="space-y-1.5">
                {catItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-200 cursor-pointer active:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => toggleItem(item.id, true)}
                      className="w-5 h-5 rounded-full accent-emerald-600 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-gray-800">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {checked.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Comprado ({checked.length})
                </h3>
                <button
                  onClick={clearChecked}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500"
                >
                  <Trash2 size={12} /> Limpiar
                </button>
              </div>
              <div className="space-y-1.5">
                {checked.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 opacity-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() => toggleItem(item.id, false)}
                      className="w-5 h-5 rounded-full accent-emerald-600 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-gray-500 line-through">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <form
        onSubmit={handleAdd}
        className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 pb-2"
      >
        <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden px-3 py-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Añadir ítem manualmente..."
            className="flex-1 text-sm outline-none py-1"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white p-2 rounded-xl active:bg-emerald-700"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Probar el flujo completo**

```bash
npm run dev
```

1. Ir al menú semanal → asignar platos con ingredientes a varios días
2. Pulsar "Generar lista de la compra" → navega a /compra
3. Verificar que los ingredientes aparecen agrupados por categoría
4. Marcar varios ítems como comprados → bajan al final tachados
5. Añadir un ítem manual
6. Pulsar "Limpiar" → elimina los marcados

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useShoppingList.js src/pages/ShoppingList.jsx
git commit -m "feat: lista de la compra con categorías y sincronización en tiempo real"
```

---

## Task 9: Prueba de sincronización en tiempo real

**Files:** ninguno nuevo

- [ ] **Step 1: Abrir la app en dos pestañas**

```bash
npm run dev
```

Abrir `http://localhost:5173` en dos pestañas del mismo navegador. Las dos comparten el mismo `householdId` en localStorage.

- [ ] **Step 2: Verificar sincronización de platos**

En la pestaña 1: añadir un plato nuevo.
Esperado: el plato aparece en la pestaña 2 sin recargar.

- [ ] **Step 3: Verificar sincronización del menú**

En la pestaña 1: asignar un plato a un día.
Esperado: la pestaña 2 muestra el plato en ese día.

- [ ] **Step 4: Verificar sincronización de la lista**

En la pestaña 1: generar lista y marcar un ítem.
Esperado: la pestaña 2 muestra el ítem marcado.

- [ ] **Step 5: Probar con dispositivo móvil real**

1. Obtener la IP local de tu ordenador:
   ```bash
   ipconfig getifaddr en0
   # o: ip addr show | grep 'inet '
   ```
2. Abrir `http://<IP-LOCAL>:5173` en el móvil (mismo WiFi)
3. Repetir los pasos anteriores entre móvil y ordenador

---

## Task 10: Despliegue en Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Crear vercel.json para SPA routing**

Crear `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Crear repositorio en GitHub**

```bash
# Si no tienes git configurado globalmente:
git config user.email "miguelmartinez@geotelecom.es"
git config user.name "Miguel Martinez"
```

Ir a https://github.com/new → nombre: `menu-semanal` → privado → crear

```bash
git remote add origin https://github.com/miguelmartinez-glitch/menu-semanal.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Importar en Vercel**

1. Ir a https://vercel.com → "Add New Project"
2. Importar el repositorio `menu-semanal` desde GitHub
3. Framework Preset: Vite (se detecta automáticamente)
4. En "Environment Variables" añadir:
   - `VITE_SUPABASE_URL` → valor de `.env.local`
   - `VITE_SUPABASE_ANON_KEY` → valor de `.env.local`
5. Pulsar "Deploy"
6. Esperar ~1 minuto → obtener URL (ej. `menu-semanal-xxxx.vercel.app`)

- [ ] **Step 4: Verificar despliegue**

Abrir la URL de Vercel en el navegador:
- Crear un hogar nuevo
- Añadir un plato
- Verificar que funciona como en local

- [ ] **Step 5: Instalar como PWA en iOS**

1. Abrir la URL de Vercel en Safari del iPhone
2. Pulsar el botón compartir (cuadrado con flecha arriba)
3. "Añadir a pantalla de inicio" → "Añadir"
4. Abrir desde el icono creado → debe abrirse a pantalla completa sin barra del navegador

- [ ] **Step 6: Instalar como PWA en Android**

1. Abrir la URL en Chrome del Android
2. Chrome mostrará un banner "Añadir a pantalla de inicio" o
3. Menú (tres puntos) → "Añadir a pantalla de inicio"

- [ ] **Step 7: Compartir código de hogar con la pareja**

1. En tu móvil: abrir la app → anotar el código del hogar (está en localStorage, acceder via DevTools o añadir una pantalla de configuración temporal)

> **Nota:** Para ver tu código de hogar, en el navegador de escritorio: DevTools → Application → Local Storage → `menu_household_id` te da el UUID. Buscar ese UUID en Supabase → Table Editor → households → copiar el campo `code`.

2. Compartir el código con tu pareja
3. En el móvil de tu pareja: abrir la URL → "Unirse a un hogar" → introducir el código

- [ ] **Step 8: Commit final**

```bash
git add vercel.json
git commit -m "feat: configuración de despliegue en Vercel"
git push
```

---

## Task 11: Mostrar código de hogar en la app

**Files:**
- Create: `src/pages/Settings.jsx`
- Modify: `src/App.jsx`, `src/components/BottomNav.jsx`

> Esta tarea añade una pantalla mínima de ajustes para que los usuarios puedan ver y copiar su código de hogar sin necesidad de DevTools.

- [ ] **Step 1: Crear Settings.jsx**

Crear `src/pages/Settings.jsx`:

```jsx
import { useEffect, useState } from 'react'
import { Copy, Check, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useHousehold } from '../contexts/HouseholdContext'
import { clearStoredHouseholdId } from '../lib/household'

export default function Settings() {
  const { householdId, setHouseholdId } = useHousehold()
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase
      .from('households')
      .select('code')
      .eq('id', householdId)
      .single()
      .then(({ data }) => data && setCode(data.code))
  }, [householdId])

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleLeave() {
    if (!confirm('¿Salir del hogar? Tendrás que volver a introducir el código para reconectarte.')) return
    clearStoredHouseholdId()
    setHouseholdId(null)
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold text-gray-900 mb-6">Ajustes</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          Código del hogar
        </p>
        <p className="text-sm text-gray-500 mb-3">
          Comparte este código con tu pareja para que pueda unirse y ver el mismo menú.
        </p>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <span className="flex-1 font-mono font-bold text-lg text-gray-800 tracking-widest">
            {code || '...'}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-emerald-600"
          >
            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <button
        onClick={handleLeave}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-400 text-sm font-medium active:bg-red-50"
      >
        <LogOut size={16} /> Salir del hogar
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Añadir ruta y nav a Settings**

Modificar `src/App.jsx` — añadir import y ruta:

```jsx
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
```

Modificar `src/components/BottomNav.jsx` — añadir icono de ajustes:

```jsx
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
```

- [ ] **Step 3: Verificar**

```bash
npm run dev
```

Ir a "Ajustes" → ver el código del hogar → pulsar copiar → pegar en el móvil de la pareja.

- [ ] **Step 4: Commit y push**

```bash
git add src/pages/Settings.jsx src/App.jsx src/components/BottomNav.jsx
git commit -m "feat: pantalla de ajustes con código de hogar y opción de salir"
git push
```

Vercel desplegará automáticamente al detectar el push.

---

## Tests finales

- [ ] **Ejecutar todos los tests**

```bash
npx vitest run
```

Esperado: PASS en `household.test.js` (3), `categories.test.js` (4), `weeklyMenu.test.js` (4). Total: 11 tests.
