"use client"
import React, { createContext, useContext, useMemo } from 'react'
import type { AppState, Product, Ingredient, ProductRequirement } from '@/types'
import { useLocalStorageState } from '@/hooks/useLocalStorage'

type AppContextType = AppState & {
  addProduct: (p: Omit<Product, 'id'>) => void
  removeProduct: (id: string) => void
  addIngredient: (i: Omit<Ingredient, 'id'>) => void
  updateIngredient: (id: string, patch: Partial<Omit<Ingredient, 'id'>>) => void
  removeIngredient: (id: string) => void
  upsertRequirementRows: (productId: string, rows: Omit<ProductRequirement, 'productId'>[]) => void
  removeRequirementRow: (productId: string, ingredientId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useLocalStorageState<Product[]>('so_products', [])
  const [ingredients, setIngredients] = useLocalStorageState<Ingredient[]>('so_ingredients', [])
  const [requirements, setRequirements] = useLocalStorageState<ProductRequirement[]>('so_requirements', [])

  const addProduct: AppContextType['addProduct'] = (p) => {
    setProducts((prev) => [...prev, { ...p, id: genId('prd') }])
  }

  const removeProduct: AppContextType['removeProduct'] = (id) => {
    setProducts((prev) => prev.filter((prd) => prd.id !== id))
    // purge requirements for this product
    setRequirements((prev) => prev.filter((r) => r.productId !== id))
  }

  const addIngredient: AppContextType['addIngredient'] = (i) => {
    setIngredients((prev) => [...prev, { ...i, id: genId('ing') }])
  }

  const updateIngredient: AppContextType['updateIngredient'] = (id, patch) => {
    setIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, ...patch } : ing)))
  }

  const removeIngredient: AppContextType['removeIngredient'] = (id) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id))
    // also purge requirements that reference this ingredient
    setRequirements((prev) => prev.filter((r) => r.ingredientId !== id))
  }

  const upsertRequirementRows: AppContextType['upsertRequirementRows'] = (productId, rows) => {
    setRequirements((prev) => {
      const withoutProduct = prev.filter((r) => r.productId !== productId)
      const withNew = rows.map((r) => ({ productId, ...r }))
      return [...withoutProduct, ...withNew]
    })
  }

  const removeRequirementRow: AppContextType['removeRequirementRow'] = (productId, ingredientId) => {
    setRequirements((prev) => prev.filter((r) => !(r.productId === productId && r.ingredientId === ingredientId)))
  }

  const value = useMemo(
    () => ({ products, ingredients, requirements, addProduct, removeProduct, addIngredient, updateIngredient, removeIngredient, upsertRequirementRows, removeRequirementRow }),
    [products, ingredients, requirements]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
