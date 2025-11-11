"use client"

import { AppProvider } from '@/state'
import { TopNav } from '@/folderly/components/Nav'
import { Tabs } from '@/folderly/components/Tabs'
import Section from '@/component/home/Section'
import CreateProductForm from '@/component/home/CreateProductForm'
import AddIngredientForm from '@/component/home/AddIngredientForm'
import RecipeEditor from '@/component/home/RecipeEditor'
import ProductListSimple from '@/component/home/ProductListSimple'
import IngredientListSimple from '@/component/home/IngredientListSimple'
import Calculator from '@/component/home/Calculator'
import { useLocalStorageState } from '@/hooks/useLocalStorage'
import { H2, Small } from '@/folderly/components/Typography'

export default function Page() {
  const [tab, setTab] = useLocalStorageState<string>('so_ui_tab', 'isi-data')
  return (
    <AppProvider>
      <TopNav
        left={
          <div className="flex gap-2">
            <H2 className="!text-2xl md:!text-3xl">Sadean Overflow</H2>
          </div>
        }
      />
      <main className="max-w-5xl mx-auto py-6 space-y-6">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'data', label: 'Data' },
            { value: 'produk', label: 'Produk' },
            { value: 'perhitungan', label: 'Perhitungan' },
          ]}
        />

        {tab === 'data' && (
          <div className="space-y-6">
            <Section title="Data Produk">
              <CreateProductForm />
            </Section>
            <Section title="Data Bahan Baku">
              <AddIngredientForm />
            </Section>
            <Section title="Produksi">
              <RecipeEditor />
            </Section>
          </div>
        )}

        {tab === 'produk' && (
          <div className="space-y-6">
            <Section title="Produk & Resep">
              <ProductListSimple />
            </Section>
            <Section title="Bahan Baku">
              <IngredientListSimple />
            </Section>
          </div>
        )}

        {tab === 'perhitungan' && (
          <Section title="Hitung Harga & Laba">
            <Calculator />
          </Section>
        )}
      </main>
    </AppProvider>
  )
}
