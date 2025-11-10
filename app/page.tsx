"use client"

import React, { useMemo, useState } from 'react'
import { TbCalculator } from 'react-icons/tb'
import { AppProvider, useApp } from '@/state'
import type { AdditionalCost, Ingredient, Product, ProductRequirement } from '@/types'
import { TopNav } from '@/folderly/components/Nav'
import { Tabs } from '@/folderly/components/Tabs'
import { Badge } from '@/folderly/components/Badge'
import { Card } from '@/folderly/components/Card'
import { Button } from '@/folderly/components/Button'
import { TextInput, Select } from '@/folderly/components/Input'
import { NumericInput } from '@/folderly/components/NumericInput'
import { useLocalStorageState } from '@/hooks/useLocalStorage'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-3"><span className="folderly-oval text-lg font-bold">{title}</span></div>
      <div className="folderly-card p-4">{children}</div>
    </section>
  )
}

function CreateProductForm() {
  const { addProduct, updateProduct, removeProduct, products, requirements, ingredients } = useApp()
  const [form, setForm] = useState<Omit<Product, 'id'>>({ name: '', type: '', defaultMarginPercent: 30 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<{ name: string; type: string; defaultMarginPercent: number } | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addProduct({ ...form, defaultMarginPercent: Number(form.defaultMarginPercent || 0) })
    setForm({ name: '', type: '', defaultMarginPercent: 30 })
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">Nama Produk</label>
          <TextInput value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Roti Cokelat" />
        </div>
        <div>
          <label className="block text-sm mb-1">Tipe</label>
          <TextInput value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} placeholder="frozen / offline / online" />
        </div>
        <div>
          <label className="block text-sm mb-1">Margin Default (%)</label>
          <NumericInput value={form.defaultMarginPercent} onChange={(v) => setForm((s) => ({ ...s, defaultMarginPercent: Number(v) }))} allowDecimals />
        </div>
        <Button type="submit">Tambah Produk</Button>
      </form>

      {products.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Daftar Produk</h4>
          <ul className="space-y-2 text-sm">
            {products.map((p) => {
              const recipeLines = requirements.filter((r) => r.productId === p.id)
              return (
                <li key={p.id} className="border rounded px-3 py-2">
                  {editingId !== p.id ? (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span>{p.name} — {p.type} — Margin: {p.defaultMarginPercent}%</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingId(p.id)
                              setEdit({ name: p.name, type: p.type, defaultMarginPercent: p.defaultMarginPercent })
                            }}
                          >
                            Edit
                          </Button>
                          <Button variant="dangerOutline" size="sm" onClick={() => removeProduct(p.id)}>Hapus</Button>
                        </div>
                      </div>
                      <div className="mt-2 text-[13px] text-black/70">
                        <div className="font-medium mb-1">Daftar Resep:</div>
                        {recipeLines.length === 0 ? (
                          <div className="italic text-black/50">Belum ada resep.</div>
                        ) : (
                          <ul className="list-disc pl-5 space-y-0.5">
                            {recipeLines.map((r) => {
                              const ing = ingredients.find((i) => i.id === r.ingredientId)
                              return (
                                <li key={`${r.productId}-${r.ingredientId}`}>
                                  {ing ? (
                                    <>
                                      {ing.name} — {r.qtyPerProduct} {ing.unit}
                                    </>
                                  ) : (
                                    <span className="text-black/50">Bahan tidak ditemukan</span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-sm mb-1">Nama Produk</label>
                        <TextInput value={edit?.name || ''} onChange={(e) => setEdit((s) => (s ? { ...s, name: e.target.value } : s))} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Tipe</label>
                        <TextInput value={edit?.type || ''} onChange={(e) => setEdit((s) => (s ? { ...s, type: e.target.value } : s))} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Margin Default (%)</label>
                        <NumericInput
                          value={edit?.defaultMarginPercent ?? 0}
                          onChange={(v) => setEdit((s) => (s ? { ...s, defaultMarginPercent: Number(v) } : s))}
                          allowDecimals
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button
                          onClick={() => {
                            if (!edit) return
                            updateProduct(p.id, { name: edit.name, type: edit.type, defaultMarginPercent: Number(edit.defaultMarginPercent || 0) })
                            setEditingId(null)
                            setEdit(null)
                          }}
                        >
                          Simpan
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null)
                            setEdit(null)
                          }}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function AddIngredientForm() {
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useApp()
  const [form, setForm] = useState<{ name: string; unit: Ingredient['unit'] | ''; pricePerUnit: number }>({ name: '', unit: '', pricePerUnit: NaN as unknown as number })
  const [totalUnitQty, setTotalUnitQty] = useState<number>(NaN as unknown as number)
  const [totalUnitPrice, setTotalUnitPrice] = useState<number>(NaN as unknown as number)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<{ name: string; unit: Ingredient['unit']; pricePerUnit: number } | null>(null)
  const [editTotalUnitQty, setEditTotalUnitQty] = useState<number>(NaN as unknown as number)
  const [editTotalUnitPrice, setEditTotalUnitPrice] = useState<number>(NaN as unknown as number)

  const computedPricePerUnit = useMemo(() => {
    if (totalUnitQty > 0 && totalUnitPrice > 0) return totalUnitPrice / totalUnitQty
    return 0
  }, [totalUnitQty, totalUnitPrice])

  const editComputedPricePerUnit = useMemo(() => {
    if (editTotalUnitQty > 0 && editTotalUnitPrice > 0) return editTotalUnitPrice / editTotalUnitQty
    return 0
  }, [editTotalUnitQty, editTotalUnitPrice])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const pricePerUnit = computedPricePerUnit > 0 ? computedPricePerUnit : Number(form.pricePerUnit || 0)
    addIngredient({ name: form.name, unit: form.unit as any, pricePerUnit })
    setForm({ name: '', unit: '', pricePerUnit: NaN as unknown as number })
    setTotalUnitQty(NaN as unknown as number)
    setTotalUnitPrice(NaN as unknown as number)
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">Nama Bahan</label>
          <TextInput value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Tepung Terigu" />
        </div>
        <div>
          <label className="block text-sm mb-1">Satuan</label>
          <div className="flex">
            <NumericInput
              value={totalUnitQty}
              onChange={setTotalUnitQty}
              allowDecimals
              allowEmpty
              placeholder="10"
              className="rounded-r-none border-r-0"
            />
            <Select
              value={form.unit}
              onChange={(e) => setForm((s) => ({ ...s, unit: (e.target as HTMLSelectElement).value as any }))}
              className="rounded-l-none"
            >
              <option value="">pilih satuan</option>
              <option value="gram">gram</option>
              <option value="kg">kg</option>
              <option value="pcs">pcs</option>
              <option value="liter">liter</option>
            </Select>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Harga Satuan</label>
          <NumericInput
            value={totalUnitPrice}
            onChange={setTotalUnitPrice}
            allowEmpty
            placeholder="1.000"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Harga per Unit (otomatis)</label>
          <div className="w-full border rounded-2xl px-3 py-2 bg-gray-50">
            {computedPricePerUnit > 0 ? Number(computedPricePerUnit.toFixed(6)).toLocaleString('id-ID') : '—'}
          </div>
        </div>
        <Button type="submit" variant="secondary">Tambah Bahan</Button>
      </form>

      {ingredients.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Daftar Bahan</h4>
          <ul className="space-y-1 text-sm">
            {ingredients.map((i) => {
              const isEditing = editingId === i.id
              return (
                <li key={i.id} className="border rounded px-3 py-2">
                  {!isEditing ? (
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        {i.name} — Unit: {i.unit} — Harga/unit: {i.pricePerUnit.toLocaleString('id-ID')}
                      </span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(i.id)
                            setEdit({ name: i.name, unit: i.unit, pricePerUnit: i.pricePerUnit })
                            setEditTotalUnitQty(NaN as unknown as number)
                            setEditTotalUnitPrice(NaN as unknown as number)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="dangerOutline"
                          size="sm"
                          onClick={() => {
                            removeIngredient(i.id)
                            if (editingId === i.id) {
                              setEditingId(null)
                              setEdit(null)
                            }
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-sm mb-1">Nama</label>
                        <TextInput
                          value={edit?.name || ''}
                          onChange={(e) => setEdit((s) => (s ? { ...s, name: e.target.value } : s))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Satuan</label>
                        <div className="flex">
                          <NumericInput
                            value={editTotalUnitQty}
                            onChange={setEditTotalUnitQty}
                            allowDecimals
                            allowEmpty
                            placeholder="contoh: 100"
                            className="rounded-r-none border-r-0"
                          />
                          <Select
                            value={edit?.unit || 'kg'}
                            onChange={(e) => setEdit((s) => (s ? { ...s, unit: (e.target as HTMLSelectElement).value as any } : s))}
                            className="rounded-l-none"
                          >
                            <option value="gram">gram</option>
                            <option value="kg">kg</option>
                            <option value="pcs">pcs</option>
                            <option value="liter">liter</option>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Harga Satuan</label>
                        <NumericInput
                          value={editTotalUnitPrice}
                          onChange={setEditTotalUnitPrice}
                          allowEmpty
                          placeholder="contoh: 10.000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Harga per Unit (otomatis)</label>
                        <div className="w-full border rounded-2xl px-3 py-2 bg-gray-50">
                          {editComputedPricePerUnit > 0
                            ? Number(editComputedPricePerUnit.toFixed(6)).toLocaleString('id-ID')
                            : (edit?.pricePerUnit ? edit.pricePerUnit.toLocaleString('id-ID') : '—')}
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button
                          onClick={() => {
                            if (!edit) return
                            const computed = editComputedPricePerUnit > 0 ? editComputedPricePerUnit : Number(edit.pricePerUnit || 0)
                            updateIngredient(i.id, { name: edit.name, unit: edit.unit, pricePerUnit: computed })
                            setEditingId(null)
                            setEdit(null)
                          }}
                        >
                          Simpan
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null)
                            setEdit(null)
                          }}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function ProductListSimple() {
  const { products, requirements, ingredients } = useApp()
  if (products.length === 0) return <div className="text-sm text-black/50">Belum ada produk.</div>
  return (
    <div className="space-y-3">
      {products.map((p) => {
        const recipeLines = requirements
          .filter((r) => r.productId === p.id)
          .map((r) => ({
            ...r,
            ingredient: ingredients.find((i) => i.id === r.ingredientId),
          }))
          .filter((r) => !!r.ingredient)
          .sort((a, b) => (a.ingredient!.name.localeCompare(b.ingredient!.name)))

        return (
          <div key={p.id}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <Badge>{p.type || '—'}</Badge>
                  <Badge kind="ongoing">Margin {p.defaultMarginPercent}%</Badge>
                  <Badge kind="archived">{recipeLines.length} bahan</Badge>
                </div>
              </div>
            </div>

            <div className="mt-3">
              {recipeLines.length === 0 ? (
                <div className="text-sm italic text-black/50">Belum ada resep.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 border text-left">Bahan</th>
                        <th className="p-2 border text-right">Qty</th>
                        <th className="p-2 border text-left">Satuan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipeLines.map((r) => (
                        <tr key={`${r.productId}-${r.ingredientId}`}>
                          <td className="p-2 border">{r.ingredient!.name}</td>
                          <td className="p-2 border text-right">{r.qtyPerProduct.toLocaleString('id-ID')}</td>
                          <td className="p-2 border">{r.ingredient!.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function IngredientListSimple() {
  const { ingredients } = useApp()
  if (ingredients.length === 0) return <div className="text-sm text-black/50">Belum ada bahan baku.</div>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 border text-left">Nama</th>
            <th className="p-2 border text-left">Satuan</th>
            <th className="p-2 border text-right">Harga/Unit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((i) => (
            <tr key={i.id}>
              <td className="p-2 border">{i.name}</td>
              <td className="p-2 border">{i.unit}</td>
              <td className="p-2 border text-right">{i.pricePerUnit.toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RecipeEditor() {
  const { products, ingredients, requirements, upsertRequirementRows, removeRequirementRow } = useApp()
  const [selectedProductId, setSelectedProductId] = useLocalStorageState<string>('so_recipe_selected_product', '')

  const rowsForSelected = useMemo(() => requirements.filter((r) => r.productId === selectedProductId), [requirements, selectedProductId])
  const [localRows, setLocalRows] = useState<Omit<ProductRequirement, 'productId'>[]>([])

  const syncFromState = (productId: string) => {
    const base = requirements
      .filter((r) => r.productId === productId)
      .map(({ ingredientId, qtyPerProduct }) => ({ ingredientId, qtyPerProduct }))
    setLocalRows(base)
  }

  const onSelectProduct = (pid: string) => {
    setSelectedProductId(pid)
    syncFromState(pid)
  }

  const addRow = () => setLocalRows((r) => [...r, { ingredientId: '', qtyPerProduct: NaN as unknown as number }])
  const updateRow = (idx: number, patch: Partial<Omit<ProductRequirement, 'productId'>>) => {
    setLocalRows((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }
  const deleteRow = (idx: number) => {
    const ingId = localRows[idx]?.ingredientId
    setLocalRows((rows) => rows.filter((_, i) => i !== idx))
    if (selectedProductId && ingId) removeRequirementRow(selectedProductId, ingId)
  }

  const save = () => {
    if (!selectedProductId) return
    const filtered = localRows.filter((r) => r.ingredientId && r.qtyPerProduct > 0)
    upsertRequirementRows(selectedProductId, filtered)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1">Pilih Produk</label>
          <Select value={selectedProductId} onChange={(e) => onSelectProduct((e.target as HTMLSelectElement).value)}>
            <option value="">-- pilih --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <Button onClick={addRow} disabled={!selectedProductId}>Tambah</Button>
        <Button onClick={save} disabled={!selectedProductId}>Simpan</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">Bahan</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {localRows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">Belum ada produksi.</td>
              </tr>
            )}
            {localRows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">
                  <Select value={row.ingredientId} onChange={(e) => updateRow(idx, { ingredientId: (e.target as HTMLSelectElement).value })}>
                    <option value="">-- pilih bahan --</option>
                    {ingredients.map((i) => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </Select>
                </td>
                <td className="p-2 border">
                  <div className="flex items-center gap-2">
                    <NumericInput
                      value={row.qtyPerProduct as number}
                      onChange={(val) => updateRow(idx, { qtyPerProduct: val })}
                      allowDecimals
                      allowEmpty
                      className="h-9 px-2"
                    />
                    <span className="text-xs text-gray-600">{ingredients.find((i) => i.id === row.ingredientId)?.unit || '-'}</span>
                  </div>
                </td>
                <td className="p-2 border text-center">
                  <button onClick={() => deleteRow(idx)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProductId && rowsForSelected.length > 0 && (
        <p className="text-xs text-gray-500">Tersimpan {rowsForSelected.length} baris resep untuk produk ini.</p>
      )}
    </div>
  )
}

function calculatePricePerBaseUnit(ingredient: Ingredient): number {
  return ingredient.pricePerUnit
}

function Calculator() {
  const { products, ingredients, requirements } = useApp()
  const [productId, setProductId] = useState('')
  const [qtyToProduce, setQtyToProduce] = useState<number>(NaN as unknown as number)
  const [customMarginPercent, setCustomMarginPercent] = useState<string>('')
  const [costs, setCosts] = useState<AdditionalCost[]>([])

  const product = useMemo(() => products.find((p) => p.id === productId), [products, productId])
  const recipe = useMemo(() => requirements.filter((r) => r.productId === productId), [requirements, productId])

  const materialCostPerProduct = useMemo(() => {
    return recipe.reduce((sum, r) => {
      const ing = ingredients.find((i) => i.id === r.ingredientId)
      if (!ing) return sum
      const pricePerUnit = calculatePricePerBaseUnit(ing)
      return sum + r.qtyPerProduct * pricePerUnit
    }, 0)
  }, [recipe, ingredients])

  const totalAdditionalCost = useMemo(() => costs.reduce((s, c) => s + (Number(c.amount) || 0), 0), [costs])
  const safeQty = Number.isFinite(qtyToProduce) ? qtyToProduce : 0
  const additionalCostPerProduct = safeQty > 0 ? totalAdditionalCost / safeQty : 0

  const productionCostPerProduct = materialCostPerProduct + additionalCostPerProduct
  const initialCapital = productionCostPerProduct * safeQty

  const usedMargin = customMarginPercent !== '' ? Number(customMarginPercent) : (product?.defaultMarginPercent ?? 0)
  const sellingPricePerProduct = productionCostPerProduct * (1 + (usedMargin || 0) / 100)
  const profitPerProduct = sellingPricePerProduct - productionCostPerProduct
  const totalProfit = profitPerProduct * safeQty

  const addCostRow = () => setCosts((c) => [...c, { id: Math.random().toString(36).slice(2), name: '', amount: 0 }])
  const updateCostRow = (idx: number, patch: Partial<AdditionalCost>) => setCosts((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  const deleteCostRow = (idx: number) => setCosts((rows) => rows.filter((_, i) => i !== idx))

  const disabled = !product || safeQty <= 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Pilih Produk</label>
          <Select value={productId} onChange={(e) => setProductId((e.target as HTMLSelectElement).value)}>
            <option value="">-- pilih --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm mb-1">Jumlah yang mau dibuat</label>
          <NumericInput value={qtyToProduce} onChange={setQtyToProduce} allowDecimals allowEmpty placeholder="contoh: 20" />
        </div>
        <div>
          <label className="block text-sm mb-1">Custom Margin (%)</label>
          <NumericInput
            value={customMarginPercent === '' ? (NaN as unknown as number) : Number(customMarginPercent)}
            onChange={(v) => setCustomMarginPercent(Number.isFinite(v) ? String(v) : '')}
            allowDecimals
            allowEmpty
            placeholder={`default: ${product?.defaultMarginPercent ?? 0}`}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Biaya Lain</h4>
          <Button onClick={addCostRow} className="text-sm bg-gray-800 text-white rounded px-3 py-1">Tambah Biaya</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Jumlah</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {costs.length === 0 && (
                <tr><td colSpan={3} className="p-3 text-center text-gray-500">Belum ada biaya lain.</td></tr>
              )}
              {costs.map((c, idx) => (
                <tr key={c.id}>
                  <td className="p-2 border">
                    <input value={c.name} onChange={(e) => updateCostRow(idx, { name: e.target.value })} className="w-full border rounded px-2 py-1" placeholder="Gas / Listrik / Kemasan" />
                  </td>
                  <td className="p-2 border">
                    <NumericInput value={c.amount} onChange={(val) => updateCostRow(idx, { amount: val })} className="h-9 px-2" placeholder="0" />
                  </td>
                  <td className="p-2 border text-center">
                    <Button variant="dangerOutline" size="sm" onClick={() => deleteCostRow(idx)}>Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <h4 className="font-medium">Perhitungan</h4>
          <div className="text-sm">Harga pokok per produk: <span className="font-semibold">{productionCostPerProduct.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Harga jual per produk: <span className="font-semibold">{sellingPricePerProduct.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Laba per produk: <span className="font-semibold">{profitPerProduct.toLocaleString('id-ID')}</span></div>
        </div>

        <div className="space-y-1">
          <h4 className="font-medium">Ringkasan</h4>
          <div className="text-sm">Margin dipakai: <span className="font-semibold">{usedMargin}%</span></div>
          <div className="text-sm">Total biaya lain: <span className="font-semibold">{totalAdditionalCost.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Total biaya bahan: <span className="font-semibold">{((materialCostPerProduct * qtyToProduce) || 0).toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Total Modal awal: <span className="font-semibold">{initialCapital.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Total Profit: <span className="font-semibold">{totalProfit.toLocaleString('id-ID')}</span></div>
        </div>
      </div>

      {/* Purchase summary per ingredient */}
      <div>
        <h4 className="font-medium mb-2">Ringkasan Bahan yang Harus Dibeli</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-left">Bahan</th>
                <th className="p-2 border text-right">Qty Total</th>
                <th className="p-2 border text-left">Satuan</th>
                <th className="p-2 border text-right">Harga/Unit</th>
                <th className="p-2 border text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {recipe.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">Belum ada resep untuk produk dipilih.</td>
                </tr>
              )}
              {recipe.map((r) => {
                const ing = ingredients.find((i) => i.id === r.ingredientId)
                if (!ing) return null
                const pricePerUnit = calculatePricePerBaseUnit(ing)
                const qtyTotal = r.qtyPerProduct * (qtyToProduce || 0)
                const subtotal = qtyTotal * pricePerUnit
                return (
                  <tr key={`${r.productId}-${r.ingredientId}`}>
                    <td className="p-2 border">{ing.name}</td>
                    <td className="p-2 border text-right">{qtyTotal.toLocaleString('id-ID')}</td>
                    <td className="p-2 border">{ing.unit}</td>
                    <td className="p-2 border text-right">{pricePerUnit.toLocaleString('id-ID')}</td>
                    <td className="p-2 border text-right">{subtotal.toLocaleString('id-ID')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {disabled && (
        <p className="text-xs text-gray-500">Isi produk, resep, jumlah produksi, dan biaya lain (opsional) untuk melihat hasil.</p>
      )}
    </div>
  )
}

export default function Page() {
  const [tab, setTab] = useLocalStorageState<string>('so_ui_tab', 'isi-data')
  return (
    <AppProvider>
      <TopNav
        left={<div className="flex items-center gap-2"><TbCalculator /><span className="text-xl font-serif">Sadean Overflow</span></div>}
      />
      <main className="max-w-5xl mx-auto py-6 space-y-6">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'isi-data', label: 'Data' },
            { value: 'produk', label: 'Produk' },
            { value: 'perhitungan', label: 'Perhitungan' },
          ]}
        />

        {tab === 'isi-data' && (
          <div className="space-y-6">
            <Section title="1) Data Produk">
              <CreateProductForm />
            </Section>
            <Section title="2) Data Bahan Baku">
              <AddIngredientForm />
            </Section>
            <Section title="3) Produksi">
              <RecipeEditor />
            </Section>
          </div>
        )}

        {tab === 'produk' && (
          <div className="space-y-6">
            <Section title="Produk & Resep">
              <ProductListSimple />
            </Section>
            <Section title="Bahan Baku">
              <IngredientListSimple />
            </Section>
          </div>
        )}

        {tab === 'perhitungan' && (
          <Section title="4) Hitung Harga & Laba">
            <Calculator />
          </Section>
        )}
      </main>
    </AppProvider>
  )
}
