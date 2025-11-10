"use client"
import React, { useState } from 'react'
import { FiFolder, FiPlus, FiStar, FiBookOpen } from 'react-icons/fi'
import { TopNav } from '@/folderly/components/Nav'
import { Button } from '@/folderly/components/Button'
import { TextInput, Select, Checkbox, Toggle, Textarea } from '@/folderly/components/Input'
import { Card, CardHeader } from '@/folderly/components/Card'
import { FolderCard } from '@/folderly/components/FolderCard'
import { Badge } from '@/folderly/components/Badge'
import { ListItem } from '@/folderly/components/ListItem'
import { Tabs, Segmented } from '@/folderly/components/Tabs'
import { Modal } from '@/folderly/components/Modal'
import { Toast } from '@/folderly/components/Toast'

export default function FolderlyDemo() {
  const [tab, setTab] = useState('overview')
  const [seg, setSeg] = useState('all')
  const [checked, setChecked] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <div>
      <TopNav
        left={<div className="flex items-center gap-2"><FiFolder /><span className="text-2xl font-serif">Folderly</span><span className="folderly-oval text-xs">Design System</span></div>}
        right={<div className="flex items-center gap-2"><Button variant="ghost"><FiBookOpen /> Docs</Button><Button variant="primary"><FiStar /> Get Started</Button></div>}
      />

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="folderly-oval">Tokens & Components</div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Buttons" subtitle="Primary, Secondary, Ghost, Icon, Floating" />
              <div className="flex items-center flex-wrap gap-3">
                <Button><FiPlus /> Primary</Button>
                <Button variant="secondary"><FiStar /> Secondary</Button>
                <Button variant="ghost"><FiBookOpen /> Ghost</Button>
                <Button variant="icon" aria-label="star"><FiStar /></Button>
                <Button variant="floating"><FiPlus /></Button>
              </div>
            </Card>
            <Card>
              <CardHeader title="Outline Buttons" subtitle="Neutral and Danger (as in image)" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full text-lg">Edit</Button>
                <Button variant="dangerOutline" className="w-full text-lg">Delete</Button>
              </div>
            </Card>
            <Card>
              <CardHeader title="Inputs" subtitle="Text, Select, Checkbox, Toggle, Textarea" />
              <div className="grid gap-3">
                <TextInput placeholder="Search..." />
                <Select defaultValue="opt1"><option value="opt1">Option One</option><option value="opt2">Option Two</option></Select>
                <div className="flex items-center gap-2"><Checkbox id="cb" /><label htmlFor="cb">I agree</label></div>
                <div className="flex items-center gap-2"><Toggle checked={checked} onChange={setChecked} /><span>Toggle me</span></div>
                <Textarea placeholder="Write something..." />
              </div>
            </Card>
            <Card>
              <CardHeader title="Folder Cards" subtitle="Pastel folders with tab" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <FolderCard title="Projects" count={12} color="pink" />
                <FolderCard title="Notes" count={8} color="blue" />
                <FolderCard title="Tasks" count={22} color="lavender" />
                <FolderCard title="Finance" count={5} color="butter" />
                <FolderCard title="Archive" count={42} color="mint" />
              </div>
            </Card>
            <Card>
              <CardHeader title="List & Badges" subtitle="List item with status pill" />
              <div className="space-y-2">
                <ListItem title="Wireframe homepage" subtitle="Updated 2h ago" right={<Badge kind="ongoing">Ongoing</Badge>} />
                <ListItem title="Write docs" subtitle="Today" right={<Badge kind="done">Done</Badge>} />
                <ListItem title="Migrate data" subtitle="Tomorrow" right={<Badge kind="warning">Pending</Badge>} />
              </div>
            </Card>

            <Card>
              <CardHeader title="Tabs & Segmented" />
              <div className="space-y-4">
                <Tabs value={tab} onChange={setTab} tabs={[{ value: 'overview', label: 'Overview' }, { value: 'items', label: 'Items' }, { value: 'settings', label: 'Settings' }]} />
                <Segmented value={seg} onChange={setSeg} items={[{ value: 'all', label: 'All' }, { value: 'pinned', label: 'Pinned' }, { value: 'archived', label: 'Archived' }]} />
              </div>
            </Card>

            <Card>
              <CardHeader title="Modal & Toast" />
              <div className="flex items-center gap-3">
                <Button onClick={() => setOpen(true)}>Open Modal</Button>
                <Toast>Saved successfully</Toast>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title="Folderly Modal">
        <p className="text-sm text-black/70">This is a soft, pastel modal dialog.</p>
      </Modal>
    </div>
  )
}
