"use client"

import React, { useState } from 'react'
import { useApp } from '@/state'
import type { Product } from '@/types'
import { Button } from '@/folderly/components/Button'
import { TextInput } from '@/folderly/components/Input'
import { NumericInput } from '@/folderly/components/NumericInput'
import { useLocalStorageState } from '@/hooks/useLocalStorage'

export default function CreateProductForm() {
  const { addProduct, updateProduct, removeProduct, products, requirements, ingredients } = useApp()
  const [form, setForm] = useLocalStorageState<Omit<Product, 'id'>>('so_form_product', { name: '', type: '', defaultMarginPercent: 30 })
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
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block label-md mb-2">Nama Produk</label>
          <TextInput value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Roti Cokelat" />
        </div>
        <div>
          <label className="block label-md mb-2">Tipe</label>
          <TextInput value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} placeholder="frozen / offline / online" />
        </div>
        <div>
          <label className="block label-md mb-2">Margin Default (%)</label>
          <NumericInput value={form.defaultMarginPercent} onChange={(v) => setForm((s) => ({ ...s, defaultMarginPercent: Number(v) }))} allowDecimals />
        </div>
        <Button type="submit">Tambah Produk</Button>
      </form>

      {products.length > 0 && (
        <div className="mt-6">
          <h4 className="heading-xs mb-4">Daftar Produk</h4>
          <div className="space-y-3">
            {products.map((p) => {
              const recipeLines = requirements.filter((r) => r.productId === p.id)
              return (
                <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                  {editingId !== p.id ? (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span className="body-sm">{p.name} — {p.type} — Margin: {p.defaultMarginPercent}%</span>
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
                      <div className="mt-3">
                        <div className="font-medium mb-2 body-sm">Daftar Resep:</div>
                        {recipeLines.length === 0 ? (
                          <div className="body-sm italic text-gray-500">Belum ada resep.</div>
                        ) : (
                          <ul className="list-disc pl-5 space-y-1">
                            {recipeLines.map((r) => {
                              const ing = ingredients.find((i) => i.id === r.ingredientId)
                              return (
                                <li key={`${r.productId}-${r.ingredientId}`} className="body-sm">
                                  {ing ? (
                                    <>
                                      {ing.name} — {r.qtyPerProduct} {ing.unit}
                                    </>
                                  ) : (
                                    <span className="text-gray-500">Bahan tidak ditemukan</span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block label-md mb-2">Nama Produk</label>
                        <TextInput value={edit?.name || ''} onChange={(e) => setEdit((s) => (s ? { ...s, name: e.target.value } : s))} />
                      </div>
                      <div>
                        <label className="block label-md mb-2">Tipe</label>
                        <TextInput value={edit?.type || ''} onChange={(e) => setEdit((s) => (s ? { ...s, type: e.target.value } : s))} />
                      </div>
                      <div>
                        <label className="block label-md mb-2">Margin Default (%)</label>
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
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

