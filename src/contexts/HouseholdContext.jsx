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
