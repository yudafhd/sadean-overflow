"use client"

import React from 'react'
import { useApp } from '@/state'

export default function IngredientListSimple() {
  const { ingredients } = useApp()
  if (ingredients.length === 0) return <div className="body-sm text-gray-500">Belum ada bahan baku.</div>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 border text-left label-md">Nama</th>
            <th className="p-3 border text-left label-md">Satuan</th>
            <th className="p-3 border text-right label-md">Harga/Unit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((i) => (
            <tr key={i.id} className="hover:bg-gray-50">
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

