export type Product = {
  id: string
  name: string
  type: string // e.g., 'frozen' | 'offline' | 'online'
  defaultMarginPercent: number
}

export type Ingredient = {
  id: string
  name: string
  unit: 'gr' | 'kg' | 'pcs' | 'liter'
  pricePerUnit: number // price per unit (per gr, per kg, per pcs, per liter)
}

export type ProductRequirement = {
  productId: string
  ingredientId: string
  // qty per product, in the ingredient's own unit
  qtyPerProduct: number
}

export type AdditionalCost = {
  id: string
  name: string
  amount: number
}

export type AppState = {
  products: Product[]
  ingredients: Ingredient[]
  requirements: ProductRequirement[]
}
