"use client"

import React, { useMemo, useState } from 'react'
import { useApp } from '@/state'
import { Button } from '@/folderly/components/Button'
import { FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi'

export default function IngredientListSimple() {
  const { ingredients, removeIngredient } = useApp()
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected])
  const allSelected = ingredients.length > 0 && selectedIds.length === ingredients.length
  const toggleAll = () => {
    if (allSelected) setSelected({})
    else setSelected(Object.fromEntries(ingredients.map((i) => [i.id, true])))
  }
  const bulkDelete = () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Hapus ${selectedIds.length} bahan? Resep yang memakai bahan tersebut juga akan dihapus.`)) return
    selectedIds.forEach((id) => removeIngredient(id))
    setSelected({})
  }
  if (ingredients.length === 0) return <div className="body-sm text-gray-500">Belum ada bahan baku.</div>
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
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
      <table className="w-full text-sm border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 border text-left label-md">Pilih</th>
            <th className="p-3 border text-left label-md">Nama</th>
            <th className="p-3 border text-left label-md">Satuan</th>
            <th className="p-3 border text-right label-md">Harga/Unit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((i) => (
            <tr key={i.id} className="hover:bg-gray-50">
              <td className="p-3 border body-sm"><input type="checkbox" className="w-4 h-4" checked={!!selected[i.id]} onChange={(e) => setSelected((s) => ({ ...s, [i.id]: e.target.checked }))} /></td>
              <td className="p-3 border body-sm">{i.name}</td>
              <td className="p-3 border body-sm">{i.unit}</td>
              <td className="p-3 border text-right body-sm">{i.pricePerUnit.toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
