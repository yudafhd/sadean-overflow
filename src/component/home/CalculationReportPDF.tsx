import React from 'react'
import { Document, Page as PDFPage, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { AdditionalCost } from '@/types'

const pdfStyles = StyleSheet.create({
  page: { padding: 28, fontSize: 11 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 11, color: '#555', marginBottom: 12 },
  sectionHeader: { backgroundColor: '#f2f4f7', padding: 6, borderRadius: 6, fontSize: 11, fontWeight: 700, marginTop: 10, marginBottom: 6 },
  row: { flexDirection: 'row' },
  col: { flex: 1 },
  kv: { fontSize: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  table: { borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#d1d5db' },
  cell: { padding: 6, borderRightWidth: 1, borderBottomWidth: 1, fontSize: 10, borderColor: '#d1d5db' },
  headCell: { padding: 6, borderRightWidth: 1, borderBottomWidth: 1, fontSize: 10, fontWeight: 700, backgroundColor: '#f8fafc', borderColor: '#d1d5db' },
  muted: { color: '#6b7280' },
})

export type CalculationItem = {
    name: string
    unit: string
    qtyPerProduct: number
    qtyTotal: number
    pricePerUnit: number
    subtotal: number
}

export default function CalculationReportPDF({
    productName,
    qty,
    usedMargin,
    materialCostPerProduct,
    additionalCostPerProduct,
    productionCostPerProduct,
    sellingPricePerProduct,
    profitPerProduct,
    totalProfit,
    costs,
    items,
}: {
    productName: string
    qty: number
    usedMargin: number
    materialCostPerProduct: number
    additionalCostPerProduct: number
    productionCostPerProduct: number
    sellingPricePerProduct: number
    profitPerProduct: number
    totalProfit: number
    costs: AdditionalCost[]
    items: CalculationItem[]
}) {
    return (
        <Document>
            <PDFPage size="A4" style={pdfStyles.page}>
              <Text style={pdfStyles.title}>Laporan Produksi</Text>
              <Text style={pdfStyles.subtitle}>Produk: {productName || '-'} • Qty: {qty}</Text>

              <Text style={pdfStyles.sectionHeader}>Ringkasan</Text>
              <View style={[pdfStyles.row, { marginBottom: 8 }]}> 
                <View style={[pdfStyles.col, { paddingRight: 8 }]}> 
                  <View style={pdfStyles.kv}><Text>HPP</Text><Text>{productionCostPerProduct.toLocaleString('id-ID')}</Text></View>
                  <View style={pdfStyles.kv}><Text>Harga jual/produk</Text><Text>{sellingPricePerProduct.toLocaleString('id-ID')}</Text></View>
                  <View style={pdfStyles.kv}><Text>Laba/produk</Text><Text>{profitPerProduct.toLocaleString('id-ID')}</Text></View>
                </View>
                <View style={[pdfStyles.col, { paddingLeft: 8 }]}>
                  <View style={pdfStyles.kv}><Text>Margin</Text><Text>{usedMargin}%</Text></View>
                  <View style={pdfStyles.kv}><Text>Total biaya lain</Text><Text>{(additionalCostPerProduct * (qty || 0)).toLocaleString('id-ID')}</Text></View>
                  <View style={pdfStyles.kv}><Text>Modal awal</Text><Text>{(productionCostPerProduct * (qty || 0)).toLocaleString('id-ID')}</Text></View>
                  <View style={pdfStyles.kv}><Text>Total profit</Text><Text>{totalProfit.toLocaleString('id-ID')}</Text></View>
                </View>
              </View>

              <Text style={pdfStyles.sectionHeader}>Biaya Lain</Text>
              {costs.length === 0 ? (
                <Text style={pdfStyles.muted}>Tidak ada biaya lain</Text>
              ) : (
                <View style={[pdfStyles.table, { marginBottom: 8 }]}>
                  <View style={pdfStyles.row}>
                    <Text style={[pdfStyles.headCell, { width: '65%' }]}>Nama</Text>
                    <Text style={[pdfStyles.headCell, { width: '35%', textAlign: 'right' }]}>Jumlah</Text>
                  </View>
                  {costs.map((c) => (
                    <View key={c.id} style={pdfStyles.row}>
                      <Text style={[pdfStyles.cell, { width: '65%' }]}>{c.name}</Text>
                      <Text style={[pdfStyles.cell, { width: '35%', textAlign: 'right' }]}>{Number(c.amount || 0).toLocaleString('id-ID')}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={pdfStyles.sectionHeader}>Ringkasan Bahan</Text>
              <View style={[pdfStyles.table]}> 
                <View style={pdfStyles.row}>
                  <Text style={[pdfStyles.headCell, { width: '45%' }]}>Bahan</Text>
                  <Text style={[pdfStyles.headCell, { width: '20%', textAlign: 'right' }]}>Qty Total</Text>
                  <Text style={[pdfStyles.headCell, { width: '17.5%', textAlign: 'right' }]}>Harga/Unit</Text>
                  <Text style={[pdfStyles.headCell, { width: '17.5%', textAlign: 'right' }]}>Subtotal</Text>
                </View>
                {items.map((it, idx) => (
                  <View key={idx} style={pdfStyles.row}>
                    <View style={[pdfStyles.cell, { width: '45%' }]}>
                      <Text>{it.name}</Text>
                      <Text style={[pdfStyles.muted, { marginTop: 2 }]}>Qty/Produk: {it.qtyPerProduct.toLocaleString('id-ID')} {it.unit}</Text>
                    </View>
                    <Text style={[pdfStyles.cell, { width: '20%', textAlign: 'right' }]}>{it.qtyTotal.toLocaleString('id-ID')} {it.unit}</Text>
                    <Text style={[pdfStyles.cell, { width: '17.5%', textAlign: 'right' }]}>{it.pricePerUnit.toLocaleString('id-ID')}</Text>
                    <Text style={[pdfStyles.cell, { width: '17.5%', textAlign: 'right' }]}>{it.subtotal.toLocaleString('id-ID')}</Text>
                  </View>
                ))}
              </View>
            </PDFPage>
        </Document>
    )
}
