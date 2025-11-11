"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '@/state'
import { Button } from '@/folderly/components/Button'
import { FiUpload, FiDownload } from 'react-icons/fi'
import { H4, Small, P } from '@/folderly/components/Typography'

type ImportPayload = {
  products?: Array<{ name: string; type?: string; defaultMarginPercent?: number }>
  ingredients?: Array<{ name: string; unit: string; pricePerUnit: number }>
  requirements?: Array<{ product: string; ingredient: string; qtyPerProduct: number }>
}

export default function DataImportExport() {
  const { products, ingredients, requirements, addProduct, addIngredient, upsertRequirementRows } = useApp()
  const productsRef = useRef(products)
  const ingredientsRef = useRef(ingredients)
  useEffect(() => { productsRef.current = products }, [products])
  useEffect(() => { ingredientsRef.current = ingredients }, [ingredients])
  const jsonInputRef = useRef<HTMLInputElement>(null)
  const excelInputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  
  // Helper: wait next frame so state updates flush
  const nextFrame = () => new Promise<void>((res) => requestAnimationFrame(() => res()))

  // Helper: apply requirements using either id or name mapping
  const applyRequirementsByLookup = (rows: Array<{ product?: string; productId?: string; ingredient?: string; ingredientId?: string; qtyPerProduct: number }>) => {
    const prodByName = new Map(productsRef.current.map((p) => [p.name, p.id]))
    const prodById = new Map(productsRef.current.map((p) => [p.id, p.id]))
    const ingByName = new Map(ingredientsRef.current.map((i) => [i.name, i.id]))
    const ingById = new Map(ingredientsRef.current.map((i) => [i.id, i.id]))
    const byProduct = new Map<string, { ingredientId: string; qtyPerProduct: number }[]>()
    for (const r of rows) {
      const pid = (r.productId && prodById.get(r.productId)) || (r.product && prodByName.get(r.product))
      const iid = (r.ingredientId && ingById.get(r.ingredientId)) || (r.ingredient && ingByName.get(r.ingredient))
      const qty = Number(r.qtyPerProduct || 0)
      if (!pid || !iid || !(qty > 0)) continue
      const list = byProduct.get(pid) || []
      list.push({ ingredientId: iid, qtyPerProduct: qty })
      byProduct.set(pid, list)
    }
    byProduct.forEach((rows, pid) => upsertRequirementRows(pid, rows))
  }

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    const prodMap = new Map(products.map((p) => [p.id, p.name]))
    const ingMap = new Map(ingredients.map((i) => [i.id, i.name]))
    const data = {
      products: products.map(({ id, name, type, defaultMarginPercent }) => ({ id, name, type, defaultMarginPercent })),
      ingredients: ingredients.map(({ id, name, unit, pricePerUnit }) => ({ id, name, unit, pricePerUnit })),
      requirements: requirements.map((r) => ({
        productId: r.productId,
        ingredientId: r.ingredientId,
        product: prodMap.get(r.productId) ?? r.productId,
        ingredient: ingMap.get(r.ingredientId) ?? r.ingredientId,
        qtyPerProduct: r.qtyPerProduct,
      })),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    download(blob, 'sadean-data.json')
  }

  const exportExcel = async () => {
    setBusy(true)
    try {
      const XLSX = await import('xlsx')
      const wb = XLSX.utils.book_new()
      const prodSheet = XLSX.utils.json_to_sheet(
        products.map(({ id, name, type, defaultMarginPercent }) => ({ id, name, type, defaultMarginPercent }))
      )
      const ingSheet = XLSX.utils.json_to_sheet(
        ingredients.map(({ id, name, unit, pricePerUnit }) => ({ id, name, unit, pricePerUnit }))
      )
      // Requirements as friendly names for readability and portability
      const prodMap = new Map(products.map((p) => [p.id, p.name]))
      const ingMap = new Map(ingredients.map((i) => [i.id, i.name]))
      const reqRows = requirements.map((r) => ({
        productId: r.productId,
        product: prodMap.get(r.productId) ?? r.productId,
        ingredientId: r.ingredientId,
        ingredient: ingMap.get(r.ingredientId) ?? r.ingredientId,
        qtyPerProduct: r.qtyPerProduct,
        unit: ingredients.find((i) => i.id === r.ingredientId)?.unit ?? '',
      }))
      const reqSheet = XLSX.utils.json_to_sheet(reqRows)
      XLSX.utils.book_append_sheet(wb, prodSheet, 'products')
      XLSX.utils.book_append_sheet(wb, ingSheet, 'ingredients')
      XLSX.utils.book_append_sheet(wb, reqSheet, 'requirements')
      const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      download(blob, 'sadean-data.xlsx')
    } finally {
      setBusy(false)
    }
  }

  const importFromJSON = async (file: File) => {
    const text = await file.text()
    const parsed = JSON.parse(text) as ImportPayload
    // Upsert products & ingredients by name
    parsed.products?.forEach((p) => {
      const exists = products.find((x) => x.name === p.name)
      if (!exists) addProduct({ name: p.name, type: p.type || '', defaultMarginPercent: Number(p.defaultMarginPercent || 0) })
    })
    parsed.ingredients?.forEach((i) => {
      const exists = ingredients.find((x) => x.name === i.name)
      if (!exists) addIngredient({ name: i.name, unit: i.unit as any, pricePerUnit: Number(i.pricePerUnit || 0) })
    })
    if (parsed.requirements && parsed.requirements.length > 0) {
      // Wait for state to flush then apply
      await nextFrame(); await nextFrame()
      applyRequirementsByLookup(parsed.requirements)
    }
  }

  const importFromExcel = async (file: File) => {
    setBusy(true)
    try {
      const XLSX = await import('xlsx')
      const data = new Uint8Array(await file.arrayBuffer())
      const wb = XLSX.read(data, { type: 'array' })
      const prodWS = wb.Sheets['products']
      const ingWS = wb.Sheets['ingredients']
      const reqWS = wb.Sheets['requirements']
      if (prodWS) {
        const rows = XLSX.utils.sheet_to_json<any>(prodWS)
        rows.forEach((p) => {
          const exists = products.find((x) => x.name === p.name)
          if (!exists) addProduct({ name: p.name || '', type: p.type || '', defaultMarginPercent: Number(p.defaultMarginPercent || 0) })
        })
      }
      if (ingWS) {
        const rows = XLSX.utils.sheet_to_json<any>(ingWS)
        rows.forEach((i) => {
          const exists = ingredients.find((x) => x.name === i.name)
          if (!exists) addIngredient({ name: i.name || '', unit: String(i.unit || '') as any, pricePerUnit: Number(i.pricePerUnit || 0) })
        })
      }
      if (reqWS) {
        const reqRowsRaw = XLSX.utils.sheet_to_json<any>(reqWS)
        const rows = reqRowsRaw.map((r: any) => ({
          productId: r.productId as string | undefined,
          product: r.product as string | undefined,
          ingredientId: r.ingredientId as string | undefined,
          ingredient: r.ingredient as string | undefined,
          qtyPerProduct: Number(r.qtyPerProduct || 0),
        }))
        await nextFrame(); await nextFrame()
        applyRequirementsByLookup(rows)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <H4 className="mb-1">Impor / Ekspor Data</H4>
      <Small>Format: JSON/Excel (.xlsx). Menyertakan Produk, Bahan, dan Resep.</Small>

      <div className="folderly-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <P className="m-0">Ekspor</P>
            <div className="flex gap-2">
              <Button onClick={exportJSON}><FiDownload /> Download JSON</Button>
              <Button onClick={exportExcel} disabled={busy}><FiDownload /> Download Excel</Button>
            </div>
          </div>
          <div className="space-y-2">
            <P className="m-0">Impor</P>
            <div className="flex gap-2 items-center">
              <input ref={jsonInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (f) importFromJSON(f).finally(() => { if (jsonInputRef.current) jsonInputRef.current.value = '' })
              }} />
              <Button onClick={() => jsonInputRef.current?.click()}><FiUpload /> Import JSON</Button>
              <input ref={excelInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (f) importFromExcel(f).finally(() => { if (excelInputRef.current) excelInputRef.current.value = '' })
              }} />
              <Button onClick={() => excelInputRef.current?.click()} disabled={busy}><FiUpload /> Import Excel</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
