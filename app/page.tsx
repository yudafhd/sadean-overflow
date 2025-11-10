"use client"

import React, { useMemo, useState } from 'react'
import { AppProvider, useApp } from './state'
import type { AdditionalCost, Ingredient, Product, ProductRequirement } from './types'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="p-4 rounded-lg border border-gray-200 bg-white">{children}</div>
    </section>
  )
}

function CreateProductForm() {
  const { addProduct, products } = useApp()
  const [form, setForm] = useState<Omit<Product, 'id'>>({ name: '', type: '', defaultMarginPercent: 30 })

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
          <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="Roti Cokelat" />
        </div>
        <div>
          <label className="block text-sm mb-1">Tipe</label>
          <input value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="frozen / offline / online" />
        </div>
        <div>
          <label className="block text-sm mb-1">Margin Default (%)</label>
          <input type="number" value={form.defaultMarginPercent} onChange={(e) => setForm((s) => ({ ...s, defaultMarginPercent: Number(e.target.value) }))} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 h-10">Tambah Produk</button>
      </form>

      {products.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Daftar Produk</h4>
          <ul className="space-y-1 text-sm">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between border rounded px-3 py-2">
                <span>{p.name} — {p.type} — Margin: {p.defaultMarginPercent}%</span>
                {/* <code className="text-gray-400">{p.id}</code> */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function AddIngredientForm() {
  const { ingredients, addIngredient, updateIngredient } = useApp()
  const [form, setForm] = useState<Omit<Ingredient, 'id'>>({ name: '', unit: 'kg', pricePerUnit: 0 })
  const [totalUnitQty, setTotalUnitQty] = useState<number>(0)
  const [totalUnitPrice, setTotalUnitPrice] = useState<number>(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<{ name: string; unit: Ingredient['unit']; pricePerUnit: number } | null>(null)

  const computedPricePerUnit = useMemo(() => {
    if (totalUnitQty > 0 && totalUnitPrice > 0) return totalUnitPrice / totalUnitQty
    return 0
  }, [totalUnitQty, totalUnitPrice])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const pricePerUnit = computedPricePerUnit > 0 ? computedPricePerUnit : Number(form.pricePerUnit || 0)
    addIngredient({ name: form.name, unit: form.unit, pricePerUnit })
    setForm({ name: '', unit: 'kg', pricePerUnit: 0 })
    setTotalUnitQty(0)
    setTotalUnitPrice(0)
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">Nama Bahan</label>
          <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="Tepung Terigu" />
        </div>
        <div>
          <label className="block text-sm mb-1">Satuan</label>
          <select value={form.unit} onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value as any }))} className="w-full border rounded px-3 py-2">
            <option value="gr">gr</option>
            <option value="kg">kg</option>
            <option value="pcs">pcs</option>
            <option value="liter">liter</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Total Satuan</label>
          <input
            type="number"
            value={totalUnitQty}
            onChange={(e) => setTotalUnitQty(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            placeholder="contoh: 100 (gr, pcs, dll)"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Harga Total Satuan</label>
          <input
            type="number"
            value={totalUnitPrice}
            onChange={(e) => setTotalUnitPrice(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            placeholder="contoh: 10000"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Harga per Unit (otomatis)</label>
          <div className="w-full border rounded px-3 py-2 bg-gray-50">
            {computedPricePerUnit > 0 ? Number(computedPricePerUnit.toFixed(6)).toLocaleString('id-ID') : '—'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Dihitung dari Total Satuan dan Harga Total Satuan.</p>
        </div>
        <button type="submit" className="bg-emerald-600 text-white rounded px-4 py-2 h-10">Tambah Bahan</button>
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
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setEditingId(i.id)
                            setEdit({ name: i.name, unit: i.unit, pricePerUnit: i.pricePerUnit })
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-sm mb-1">Nama</label>
                        <input
                          value={edit?.name || ''}
                          onChange={(e) => setEdit((s) => (s ? { ...s, name: e.target.value } : s))}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Satuan</label>
                        <select
                          value={edit?.unit || 'kg'}
                          onChange={(e) => setEdit((s) => (s ? { ...s, unit: e.target.value as any } : s))}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="gr">gr</option>
                          <option value="kg">kg</option>
                          <option value="pcs">pcs</option>
                          <option value="liter">liter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Harga per Unit</label>
                        <input
                          type="number"
                          value={edit?.pricePerUnit ?? 0}
                          onChange={(e) => setEdit((s) => (s ? { ...s, pricePerUnit: Number(e.target.value) } : s))}
                          className="w-full border rounded px-3 py-2"
                          placeholder="contoh: 150"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          className="bg-blue-600 text-white rounded px-4 py-2 h-10"
                          onClick={() => {
                            if (!edit) return
                            updateIngredient(i.id, { name: edit.name, unit: edit.unit, pricePerUnit: Number(edit.pricePerUnit || 0) })
                            setEditingId(null)
                            setEdit(null)
                          }}
                        >
                          Simpan
                        </button>
                        <button
                          className="bg-gray-200 text-gray-800 rounded px-4 py-2 h-10"
                          onClick={() => {
                            setEditingId(null)
                            setEdit(null)
                          }}
                        >
                          Batal
                        </button>
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

function RecipeEditor() {
  const { products, ingredients, requirements, upsertRequirementRows, removeRequirementRow } = useApp()
  const [selectedProductId, setSelectedProductId] = useState<string>('')

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

  const addRow = () => setLocalRows((r) => [...r, { ingredientId: '', qtyPerProduct: 0 }])
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
          <select value={selectedProductId} onChange={(e) => onSelectProduct(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- pilih --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <button onClick={addRow} className="bg-gray-800 text-white rounded px-4 py-2 h-10" disabled={!selectedProductId}>Tambah Baris</button>
        <button onClick={save} className="bg-blue-600 text-white rounded px-4 py-2 h-10" disabled={!selectedProductId}>Simpan Resep</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">Ingredient</th>
              <th className="p-2 border">Qty (unit)</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {localRows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">Belum ada baris. Pilih produk dan klik "Tambah Baris".</td>
              </tr>
            )}
            {localRows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">
                  <select value={row.ingredientId} onChange={(e) => updateRow(idx, { ingredientId: e.target.value })} className="w-full border rounded px-2 py-1">
                    <option value="">-- pilih bahan --</option>
                    {ingredients.map((i) => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={row.qtyPerProduct ?? 0}
                      onChange={(e) => updateRow(idx, { qtyPerProduct: Number(e.target.value) })}
                      className="w-full border rounded px-2 py-1"
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
  // price per ingredient's own unit (kg, gr, pcs, liter)
  return ingredient.pricePerUnit
}

function Calculator() {
  const { products, ingredients, requirements } = useApp()
  const [productId, setProductId] = useState('')
  const [qtyToProduce, setQtyToProduce] = useState<number>(0)
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
  const additionalCostPerProduct = qtyToProduce > 0 ? totalAdditionalCost / qtyToProduce : 0

  const productionCostPerProduct = materialCostPerProduct + additionalCostPerProduct
  const initialCapital = productionCostPerProduct * qtyToProduce

  const usedMargin = customMarginPercent !== '' ? Number(customMarginPercent) : (product?.defaultMarginPercent ?? 0)
  const sellingPricePerProduct = productionCostPerProduct * (1 + (usedMargin || 0) / 100)
  const profitPerProduct = sellingPricePerProduct - productionCostPerProduct
  const totalProfit = profitPerProduct * qtyToProduce

  const addCostRow = () => setCosts((c) => [...c, { id: Math.random().toString(36).slice(2), name: '', amount: 0 }])
  const updateCostRow = (idx: number, patch: Partial<AdditionalCost>) => setCosts((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  const deleteCostRow = (idx: number) => setCosts((rows) => rows.filter((_, i) => i !== idx))

  const disabled = !product || qtyToProduce <= 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Pilih Produk</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- pilih --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Jumlah yang mau dibuat</label>
          <input type="number" value={qtyToProduce} onChange={(e) => setQtyToProduce(Number(e.target.value))} className="w-full border rounded px-3 py-2" placeholder="contoh: 20" />
        </div>
        <div>
          <label className="block text-sm mb-1">Custom Margin (%)</label>
          <input type="number" value={customMarginPercent} onChange={(e) => setCustomMarginPercent(e.target.value)} className="w-full border rounded px-3 py-2" placeholder={`default: ${product?.defaultMarginPercent ?? 0}`} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Biaya Lain</h4>
          <button onClick={addCostRow} className="text-sm bg-gray-800 text-white rounded px-3 py-1">Tambah Biaya</button>
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
                    <input type="number" value={c.amount} onChange={(e) => updateCostRow(idx, { amount: Number(e.target.value) })} className="w-full border rounded px-2 py-1" placeholder="0" />
                  </td>
                  <td className="p-2 border text-center">
                    <button onClick={() => deleteCostRow(idx)} className="text-red-600 hover:underline">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <h4 className="font-medium">Ringkasan</h4>
          <div className="text-sm">Margin dipakai: <span className="font-semibold">{usedMargin}%</span></div>
          <div className="text-sm">Total biaya lain: <span className="font-semibold">{totalAdditionalCost.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Total biaya bahan: <span className="font-semibold">{(materialCostPerProduct * qtyToProduce).toLocaleString('id-ID')}</span></div>
        </div>
        <div className="space-y-1">
          <h4 className="font-medium">Hasil</h4>
          <div className="text-sm">Harga pokok produksi per produk: <span className="font-semibold">{productionCostPerProduct.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Harga jual per produk: <span className="font-semibold">{sellingPricePerProduct.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Laba per produk: <span className="font-semibold">{profitPerProduct.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Modal awal (total batch): <span className="font-semibold">{initialCapital.toLocaleString('id-ID')}</span></div>
          <div className="text-sm">Total laba: <span className="font-semibold">{totalProfit.toLocaleString('id-ID')}</span></div>
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
  return (
    <AppProvider>
      <div className="space-y-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">sadean-overflow</h1>
          <p className="text-sm text-gray-600">Hitung modal, harga, dan laba produk makanan berbasis resep.</p>
        </header>

        <Section title="1) Data Produk">
          <CreateProductForm />
        </Section>

        <Section title="2) Data Bahan Baku">
          <AddIngredientForm />
        </Section>

        <Section title="3) Resep per Produk">
          <RecipeEditor />
        </Section>

        <Section title="4) Hitung Harga & Laba">
          <Calculator />
        </Section>
      </div>
    </AppProvider>
  )
}
