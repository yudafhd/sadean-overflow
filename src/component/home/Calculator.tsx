"use client"

import React, { useMemo, useState } from 'react'
import { useApp } from '@/state'
import type { AdditionalCost } from '@/types'
import { Button } from '@/folderly/components/Button'
import { Select } from '@/folderly/components/Input'
import { NumericInput } from '@/folderly/components/NumericInput'
import { useLocalStorageState } from '@/hooks/useLocalStorage'
import { H4, P } from '@/folderly/components/Typography'
import CalculationReportPDF from '@/component/home/CalculationReportPDF'
import type { CalculationItem } from '@/component/home/CalculationReportPDF'

export default function Calculator() {
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
            const pricePerUnit = ing.pricePerUnit
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

    const recipeItems = useMemo(() => {
        return recipe.map((r) => {
            const ing = ingredients.find((i) => i.id === r.ingredientId)
            if (!ing) return null
            const pricePerUnit = ing.pricePerUnit
            const qtyTotal = r.qtyPerProduct * (safeQty || 0)
            const subtotal = qtyTotal * pricePerUnit
            return {
                name: ing.name,
                unit: ing.unit,
                qtyPerProduct: r.qtyPerProduct,
                qtyTotal,
                pricePerUnit,
                subtotal,
            }
        }).filter(Boolean) as CalculationItem[]
    }, [recipe, ingredients, safeQty])

    const [downloading, setDownloading] = useState(false)
    const handleDownloadPdf = async () => {
        if (!product) return
        try {
            setDownloading(true)
            const { pdf } = await import('@react-pdf/renderer')
            const doc = (
                <CalculationReportPDF
                    productName={product?.name || ''}
                    qty={safeQty}
                    usedMargin={usedMargin}
                    materialCostPerProduct={materialCostPerProduct}
                    additionalCostPerProduct={additionalCostPerProduct}
                    productionCostPerProduct={productionCostPerProduct}
                    sellingPricePerProduct={sellingPricePerProduct}
                    profitPerProduct={profitPerProduct}
                    totalProfit={totalProfit}
                    costs={costs}
                    items={recipeItems}
                />
            )
            const blob = await pdf(doc).toBlob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `sadean-report-${product?.name || 'produk'}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        } catch (e) {
            console.error('Gagal membuat PDF', e)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-2">
                    <label className="block label-md mb-2">Pilih Produk</label>
                    <Select value={productId} onChange={(e) => setProductId((e.target as HTMLSelectElement).value)}>
                        <option value="">-- pilih --</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </Select>
                </div>
                <div>
                    <label className="block label-md mb-2">Jumlah yang mau dibuat</label>
                    <NumericInput value={qtyToProduce} onChange={setQtyToProduce} allowDecimals allowEmpty placeholder="contoh: 20" />
                </div>
                <div>
                    <label className="block label-md mb-2">Custom Margin (%)</label>
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
                    <H4 className="m-0">Biaya Lain</H4>
                    <Button onClick={addCostRow} className="text-sm bg-gray-800 text-white rounded px-3 py-1">Tambah Biaya</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full body-sm border">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 border">Nama</th>
                                <th className="p-2 border">Jumlah</th>
                                <th className="p-2 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {costs.length === 0 && (
                                <tr><td colSpan={3} className="p-3 text-center muted">Belum ada biaya lain.</td></tr>
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
                    <H4 className="m-0">Perhitungan</H4>
                    <P>Harga pokok per produk: <span className="font-semibold">{productionCostPerProduct.toLocaleString('id-ID')}</span></P>
                    <P>Harga jual per produk: <span className="font-semibold">{sellingPricePerProduct.toLocaleString('id-ID')}</span></P>
                    <P>Laba per produk: <span className="font-semibold">{profitPerProduct.toLocaleString('id-ID')}</span></P>
                </div>

                <div className="space-y-1">
                    <H4 className="m-0">Ringkasan</H4>
                    <P>Margin dipakai: <span className="font-semibold">{usedMargin}%</span></P>
                    <P>Total biaya lain: <span className="font-semibold">{totalAdditionalCost.toLocaleString('id-ID')}</span></P>
                    <P>Total biaya bahan: <span className="font-semibold">{((materialCostPerProduct * qtyToProduce) || 0).toLocaleString('id-ID')}</span></P>
                    <P>Total Modal awal: <span className="font-semibold">{initialCapital.toLocaleString('id-ID')}</span></P>
                    <P>Total Profit: <span className="font-semibold">{totalProfit.toLocaleString('id-ID')}</span></P>
                </div>
            </div>

            <div>
                <H4 className="mb-2">Ringkasan Bahan yang Harus Dibeli</H4>
                <div className="overflow-x-auto">
                    <table className="w-full body-sm border">
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
                                    <td colSpan={5} className="p-3 text-center muted">Belum ada resep untuk produk dipilih.</td>
                                </tr>
                            )}
                            {recipe.map((r) => {
                                const ing = ingredients.find((i) => i.id === r.ingredientId)
                                if (!ing) return null
                                const pricePerUnit = ing.pricePerUnit
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
                <P className="body-xs muted">Isi produk, resep, jumlah produksi, dan biaya lain (opsional) untuk melihat hasil.</P>
            )}

            <div className="mt-4 flex justify-end">
                <Button onClick={handleDownloadPdf} disabled={!product || downloading} className="text-sm bg-gray-800 text-white rounded px-4 py-2">
                    {downloading ? 'Menyiapkan PDF…' : 'Download PDF'}
                </Button>
            </div>
        </div>
    )
}
