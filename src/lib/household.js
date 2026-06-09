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
