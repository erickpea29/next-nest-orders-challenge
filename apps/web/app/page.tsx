'use client'
import { useEffect, useState } from 'react'
import { z } from 'zod'

type Order = { id: string; item: string; price: string; status: 'NEW' | 'PAID' | 'CANCELLED' }

const schema = z.object({
  item: z.string().min(1),
  price: z.coerce.number().positive(),
  status: z.enum(['NEW','PAID','CANCELLED'])
})

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({ item: '', price: '', status: 'NEW' })

  async function load() {
    setLoading(true); setError(null)
    try {
      const r = await fetch(`${API}/orders`)
      const j = await r.json()
      setOrders(j.data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function create() {
    setError(null)
    const parsed = schema.safeParse({ item: form.item, price: form.price, status: form.status as any })
    if (!parsed.success) { setError('Invalid input'); return }
    await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify(parsed.data)
    })
    setForm({ item: '', price: '', status: 'NEW' })
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <main>
      <h1>Orders</h1>

      <div style={{ display:'grid', gap:8, maxWidth:360 }}>
        <input placeholder="Item" value={form.item} onChange={e=>setForm(f=>({...f, item: e.target.value}))} />
        <input placeholder="Price" value={form.price} onChange={e=>setForm(f=>({...f, price: e.target.value}))} />
        <select value={form.status} onChange={e=>setForm(f=>({...f, status: e.target.value}))}>
          <option>NEW</option>
          <option>PAID</option>
          <option>CANCELLED</option>
        </select>
        <button onClick={create} disabled={loading}>Create</button>
        {error && <p role="alert" style={{ color:'crimson' }}>{error}</p>}
      </div>

      {loading ? <p>Loading...</p> : (
        <ul style={{ marginTop:24 }}>
          {orders.map(o => (
            <li key={o.id}>{o.item} – ${o.price} – {o.status}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
