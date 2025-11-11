"use client"

import React, { useMemo, useState } from 'react'
import { useApp } from '@/state'
import type { Ingredient } from '@/types'
import { Button } from '@/folderly/components/Button'
import { TextInput, Select } from '@/folderly/components/Input'
import { NumericInput } from '@/folderly/components/NumericInput'
import { useLocalStorageState } from '@/hooks/useLocalStorage'

export default function AddIngredientForm() {
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useApp()
  const [form, setForm] = useLocalStorageState<{ name: string; unit: Ingredient['unit'] | ''; pricePerUnit: number }>('so_form_ingredient', { name: '', unit: '', pricePerUnit: NaN as unknown as number })
  const [totalUnitQty, setTotalUnitQty] = useLocalStorageState<number>('so_form_ingredient_total_qty', NaN as unknown as number)
  const [totalUnitPrice, setTotalUnitPrice] = useLocalStorageState<number>('so_form_ingredient_total_price', NaN as unknown as number)
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
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block label-md mb-2">Nama Bahan</label>
          <TextInput value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Tepung Terigu" />
        </div>
        <div>
          <label className="block label-md mb-2">Satuan</label>
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
          <label className="block label-md mb-2">Harga Satuan</label>
          <NumericInput
            value={totalUnitPrice}
            onChange={setTotalUnitPrice}
            allowEmpty
            placeholder="1.000"
          />
        </div>
        <div>
          <label className="block label-md mb-2">Harga per Unit (otomatis)</label>
          <div className="w-full border rounded-2xl px-3 py-2 bg-gray-50 body-sm">
            {computedPricePerUnit > 0 ? Number(computedPricePerUnit.toFixed(6)).toLocaleString('id-ID') : '—'}
          </div>
        </div>
        <Button type="submit" variant="secondary">Tambah Bahan</Button>
      </form>

      {ingredients.length > 0 && (
        <div className="mt-6">
          <h4 className="heading-xs mb-4">Daftar Bahan</h4>
          <div className="space-y-3">
            {ingredients.map((i) => {
              const isEditing = editingId === i.id
              return (
                <div key={i.id} className="border border-gray-200 rounded-lg p-4">
                  {!isEditing ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="body-sm">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block label-md mb-2">Nama</label>
                        <TextInput
                          value={edit?.name || ''}
                          onChange={(e) => setEdit((s) => (s ? { ...s, name: e.target.value } : s))}
                        />
                      </div>
                      <div>
                        <label className="block label-md mb-2">Satuan</label>
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
                        <label className="block label-md mb-2">Harga Satuan</label>
                        <NumericInput
                          value={editTotalUnitPrice}
                          onChange={setEditTotalUnitPrice}
                          allowEmpty
                          placeholder="contoh: 10.000"
                        />
                      </div>
                      <div>
                        <label className="block label-md mb-2">Harga per Unit (otomatis)</label>
                        <div className="w-full border rounded-2xl px-3 py-2 bg-gray-50 body-sm">
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
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

