"use client"

import React, { useMemo, useState } from 'react'
import { useApp } from '@/state'
import { Badge } from '@/folderly/components/Badge'
import { Button } from '@/folderly/components/Button'
import { FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi'

export default function ProductListSimple() {
  const { products, requirements, ingredients, removeProduct } = useApp()
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected])
  const allSelected = products.length > 0 && selectedIds.length === products.length
  const toggleAll = () => {
    if (allSelected) setSelected({})
    else setSelected(Object.fromEntries(products.map((p) => [p.id, true])))
  }
  const bulkDelete = () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Hapus ${selectedIds.length} produk beserta resepnya?`)) return
    selectedIds.forEach((id) => removeProduct(id))
    setSelected({})
  }
  if (products.length === 0) return <div className="body-sm text-gray-500">Belum ada produk.</div>
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="body-sm text-black/70">Dipilih: {selectedIds.length}</div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {allSelected ? <FiCheckSquare /> : <FiSquare />} {allSelected ? 'Batalkan Semua' : 'Pilih Semua'}
          </Button>
          <Button variant="dangerOutline" size="sm" onClick={bulkDelete} disabled={selectedIds.length === 0}>
            <FiTrash2 /> Hapus Terpilih
          </Button>
        </div>
      </div>
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
              <div className="min-w-0 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={!!selected[p.id]}
                  onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.checked }))}
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="heading-sm truncate">{p.name}</h3>
                  <Badge>{p.type || '—'}</Badge>
                  <Badge kind="ongoing">Margin {p.defaultMarginPercent}%</Badge>
                  <Badge kind="archived">{recipeLines.length} bahan</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {recipeLines.length === 0 ? (
                <div className="body-sm italic text-gray-500">Belum ada resep.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 border text-left label-md">Bahan</th>
                        <th className="p-3 border text-right label-md">Qty</th>
                        <th className="p-3 border text-left label-md">Satuan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipeLines.map((r) => (
                        <tr key={`${r.productId}-${r.ingredientId}`}>
                          <td className="p-3 border body-sm">{r.ingredient!.name}</td>
                          <td className="p-3 border text-right body-sm">{r.qtyPerProduct.toLocaleString('id-ID')}</td>
                          <td className="p-3 border body-sm">{r.ingredient!.unit}</td>
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
