"use client"
import React, { createContext, useContext, useMemo, useState } from 'react'
import type { AppState, Product, Ingredient, ProductRequirement } from './types'

type AppContextType = AppState & {
  addProduct: (p: Omit<Product, 'id'>) => void
  addIngredient: (i: Omit<Ingredient, 'id'>) => void
  upsertRequirementRows: (productId: string, rows: Omit<ProductRequirement, 'productId'>[]) => void
  removeRequirementRow: (productId: string, ingredientId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const genId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [requirements, setRequirements] = useState<ProductRequirement[]>([])

  const addProduct: AppContextType['addProduct'] = (p) => {
    setProducts((prev) => [...prev, { ...p, id: genId('prd') }])
  }

  const addIngredient: AppContextType['addIngredient'] = (i) => {
    setIngredients((prev) => [...prev, { ...i, id: genId('ing') }])
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
    () => ({ products, ingredients, requirements, addProduct, addIngredient, upsertRequirementRows, removeRequirementRow }),
    [products, ingredients, requirements]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
