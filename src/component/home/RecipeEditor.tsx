"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/state'
import type { ProductRequirement } from '@/types'
import { Button } from '@/folderly/components/Button'
import { Select } from '@/folderly/components/Input'
import { NumericInput } from '@/folderly/components/NumericInput'
import { useLocalStorageState } from '@/hooks/useLocalStorage'

export default function RecipeEditor() {
  const { products, ingredients, requirements, upsertRequirementRows, removeRequirementRow } = useApp()
  const [selectedProductId, setSelectedProductId] = useLocalStorageState<string>('so_recipe_selected_product', '')
  const [drafts, setDrafts] = useLocalStorageState<Record<string, Omit<ProductRequirement, 'productId'>[]>>('so_recipe_drafts', {})

  const rowsForSelected = useMemo(() => requirements.filter((r) => r.productId === selectedProductId), [requirements, selectedProductId])
  const [localRows, setLocalRows] = useState<Omit<ProductRequirement, 'productId'>[]>([])

  const syncFromState = (productId: string) => {
    const draft = drafts[productId]
    if (draft && Array.isArray(draft)) {
      setLocalRows(draft)
      return
    }
    const base = requirements
      .filter((r) => r.productId === productId)
      .map(({ ingredientId, qtyPerProduct }) => ({ ingredientId, qtyPerProduct }))
    setLocalRows(base)
  }

  const onSelectProduct = (pid: string) => {
    setSelectedProductId(pid)
    syncFromState(pid)
  }

  // When product changes (or requirements update), load rows so inputs appear
  useEffect(() => {
    if (selectedProductId) {
      syncFromState(selectedProductId)
    } else {
      setLocalRows([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId, requirements])

  const addRow = () => {
    setLocalRows((r) => {
      const next = [...r, { ingredientId: '', qtyPerProduct: NaN as unknown as number }]
      if (selectedProductId) setDrafts((d) => ({ ...d, [selectedProductId]: next }))
      return next
    })
  }
  const updateRow = (idx: number, patch: Partial<Omit<ProductRequirement, 'productId'>>) => {
    setLocalRows((rows) => {
      const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r))
      if (selectedProductId) setDrafts((d) => ({ ...d, [selectedProductId]: next }))
      return next
    })
  }
  const deleteRow = (idx: number) => {
    const ingId = localRows[idx]?.ingredientId
    setLocalRows((rows) => {
      const next = rows.filter((_, i) => i !== idx)
      if (selectedProductId) setDrafts((d) => ({ ...d, [selectedProductId]: next }))
      return next
    })
    if (selectedProductId && ingId) removeRequirementRow(selectedProductId, ingId)
  }

  const save = () => {
    if (!selectedProductId) return
    const filtered = localRows.filter((r) => r.ingredientId && r.qtyPerProduct > 0)
    upsertRequirementRows(selectedProductId, filtered)
    // clear draft for this product
    setDrafts((d) => {
      const { [selectedProductId]: _omit, ...rest } = d
      return rest
    })
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-left">Bahan</th>
              <th className="p-2 border text-right">Qty/Produk</th>
              <th className="p-2 border text-left">Satuan</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {localRows.length === 0 && (
              <tr><td className="p-3 text-center text-gray-500" colSpan={4}>Belum ada baris.</td></tr>
            )}
            {localRows.map((row, idx) => {
              const usedIds = new Set(
                localRows
                  .map((r, i) => (i === idx ? null : r.ingredientId))
                  .filter((v): v is string => Boolean(v))
              )
              const availableIngredients = ingredients.filter((i) => !usedIds.has(i.id) || i.id === row.ingredientId)
              return (
              <tr key={idx}>
                <td className="p-2 border">
                  <Select
                    value={row.ingredientId}
                    onChange={(e) => updateRow(idx, { ingredientId: (e.target as HTMLSelectElement).value })}
                  >
                    <option value="">-- pilih bahan --</option>
                    {availableIngredients.map((i) => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </Select>
                </td>
                <td className="p-2 border text-right">
                  <NumericInput
                    value={row.qtyPerProduct}
                    onChange={(val) => updateRow(idx, { qtyPerProduct: val })}
                    allowDecimals
                    allowEmpty
                    placeholder="0"
                    className="h-9 px-2 text-right"
                  />
                </td>
                <td className="p-2 border">
                  {ingredients.find((i) => i.id === row.ingredientId)?.unit || '-'}
                </td>
                <td className="p-2 border text-center">
                  <button onClick={() => deleteRow(idx)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {selectedProductId && rowsForSelected.length > 0 && (
        <p className="text-xs text-gray-500">Tersimpan {rowsForSelected.length} baris resep untuk produk ini.</p>
      )}

      <div className="flex gap-2 justify-end">
        <Button onClick={save} disabled={!selectedProductId}>Simpan Semua </Button>
        <Button onClick={addRow} disabled={!selectedProductId}>Tambah Bahan</Button>
      </div>
    </div>
  )
}
