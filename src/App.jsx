import React, { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// ── DATA ─────────────────────────────────────────────────────────────────────
const WEEKLY_REVENUE = [
  { minggu: 'Minggu 1', revenue: 218000,  hpp: 166893,  profit: 51107,  orders: 8,  qty: 16 },
  { minggu: 'Minggu 2', revenue: 1425000, hpp: 1023157, profit: 401843, orders: 74, qty: 95 },
  { minggu: 'Minggu 3', revenue: 132000,  hpp: 98950,   profit: 33050,  orders: 5,  qty: 10 },
  { minggu: 'Minggu 4', revenue: 248000,  hpp: 188010,  profit: 59990,  orders: 8,  qty: 18 },
]

const PRODUCT_DATA = [
  { produk: 'Kentang Goreng', qty: 80, revenue: 1031000, hpp: 9600,  harga: 13000, margin: 26.2 },
  { produk: 'Onion Ring',     qty: 38, revenue: 608000,  hpp: 13100, harga: 16000, margin: 18.1 },
  { produk: 'Makaroni Mix',   qty: 21, revenue: 315000,  hpp: 11350, harga: 15000, margin: 24.3 },
  { produk: 'Add On',         qty: 0,  revenue: 69000,   hpp: 0,     harga: 0,     margin: 0    },
]

const PAYMENT_DATA = [
  { name: 'QRIS',  value: 1789000, pct: 88.4 },
  { name: 'Tunai', value: 234000,  pct: 11.6 },
]

const WEEKLY_PRODUCT = [
  { minggu: 'M1', 'Kentang Goreng': 12, 'Onion Ring': 2,  'Makaroni Mix': 2  },
  { minggu: 'M2', 'Kentang Goreng': 48, 'Onion Ring': 30, 'Makaroni Mix': 17 },
  { minggu: 'M3', 'Kentang Goreng': 9,  'Onion Ring': 0,  'Makaroni Mix': 1  },
  { minggu: 'M4', 'Kentang Goreng': 11, 'Onion Ring': 6,  'Makaroni Mix': 1  },
]

const PROJECTION = [
  { bulan: 'Bulan 1 (400 pcs)', revenue: 5639000, hpp: 4318000, profit: 1321000 },
  { bulan: 'Bulan 2 (420 pcs)', revenue: 5921000, hpp: 4534000, profit: 1387000 },
  { bulan: 'Bulan 3 (441 pcs)', revenue: 6217000, hpp: 4761000, profit: 1457000 },
]

const FUNDING = [
  { nama: 'Bahan Baku',        value: 448000, pct: 51.6 },
  { nama: 'Peralatan & Dekor', value: 288000, pct: 33.1 },
  { nama: 'Packaging',         value: 161000, pct: 18.5 },
  { nama: 'Operasional',       value: 70000,  pct: 8.1  },
  { nama: 'Lain-lain',         value: 40000,  pct: 4.6  },
]

// ── PALETTE — dari logo: merah #D62B2B, oranye #F5A623 ──────────────────────
const C = {
  red:    '#D62B2B',
  orange: '#F5A623',
  dark:   '#1A1A1A',
  slate:  '#3D3D3D',
  smoke:  '#7A7A7A',
  mist:   '#D8D8D8',
  paper:  '#FAFAF8',
  white:  '#FFFFFF',
}

const CHART_COLORS = [C.red, C.orange, C.slate, C.mist]
const FUND_COLORS  = [C.red, C.slate, C.orange, C.smoke, C.mist]

// ── HELPERS ──────────────────────────────────────────────────────────────────
const rp  = (v) => 'Rp' + v.toLocaleString('id-ID')
const rpK = (v) => {
  if (v >= 1_000_000) return 'Rp' + (v / 1_000_000).toFixed(1) + 'Jt'
  if (v >= 1_000)     return 'Rp' + (v / 1_000).toFixed(0) + 'Rb'
  return 'Rp' + v
}

// ── CUSTOM TOOLTIP ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: C.dark, color: '#F5F5F5',
      padding: '10px 14px', borderRadius: 8,
      fontSize: 12, fontFamily: 'inherit',
      border: '1px solid ' + C.slate, minWidth: 160,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 3 }}>
          <span style={{ color: '#bbb' }}>{p.name}</span>
          <span style={{ fontWeight: 700, color: p.color || '#fff' }}>
            {typeof p.value === 'number' && p.value > 999 ? rpK(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, highlight }) => (
  <div style={{
    background: highlight ? C.red : C.white,
    color: highlight ? C.white : C.dark,
    border: '1px solid ' + (highlight ? C.red : '#E8E8E8'),
    borderRadius: 12, padding: '18px 20px',
    display: 'flex', flexDirection: 'column', gap: 2,
    boxShadow: highlight ? '0 4px 16px rgba(214,43,43,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
  }}>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.55 }}>{label}</span>
    <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</span>
    {sub && <span style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>{sub}</span>}
  </div>
)

const ChartCard = ({ title, height = 280, children }) => (
  <div style={{
    background: C.white, borderRadius: 12, padding: '20px 16px 12px',
    border: '1px solid #E8E8E8', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  }}>
    {title && (
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.smoke, marginBottom: 16 }}>
        {title}
      </div>
    )}
    <div style={{ height }}>{children}</div>
  </div>
)

const SectionTitle = ({ tag, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, marginTop: 8 }}>
    <span style={{
      background: C.red, color: C.white,
      fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
      textTransform: 'uppercase', padding: '3px 7px', borderRadius: 3,
    }}>{tag}</span>
    <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{title}</h2>
  </div>
)

const Divider = () => <div style={{ height: 1, background: '#EFEFEF', margin: '28px 0' }} />

const TABS = ['Ringkasan', 'Produk', 'Cashflow', 'Proyeksi', 'Modal']

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('Ringkasan')

  const totalRevenue = WEEKLY_REVENUE.reduce((s, r) => s + r.revenue, 0)
  const totalProfit  = WEEKLY_REVENUE.reduce((s, r) => s + r.profit, 0)
  const totalQty     = WEEKLY_REVENUE.reduce((s, r) => s + r.qty, 0)
  const totalOrders  = WEEKLY_REVENUE.reduce((s, r) => s + r.orders, 0)
  const marginPct    = ((totalProfit / totalRevenue) * 100).toFixed(1)

  return (
    <div style={{ minHeight: '100vh', background: C.paper, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{
        background: C.white,
        borderBottom: '1px solid #E8E8E8',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="Mandi Saos" style={{ height: 40, width: 'auto' }} />
            <div style={{ width: 1, height: 28, background: '#E8E8E8' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, letterSpacing: '-0.01em' }}>Dashboard Keuangan</div>
              <div style={{ fontSize: 10, color: C.smoke }}>Periode Mei – Juni 2026</div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 2 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? C.red : 'transparent',
                color: tab === t ? C.white : C.smoke,
                border: 'none', borderRadius: 6,
                padding: '7px 14px', cursor: 'pointer',
                fontSize: 12, fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>{t}</button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* ══ RINGKASAN ══ */}
        {tab === 'Ringkasan' && (
          <>
            {/* Hero */}
            <div style={{
              background: C.dark, color: C.white,
              borderRadius: 16, padding: '28px 32px', marginBottom: 24,
              borderLeft: '5px solid ' + C.red,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.orange, marginBottom: 8 }}>
                Realisasi 4 Minggu Operasional
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
                Total Pemasukan: <span style={{ color: C.orange }}>Rp2.023.000</span>
              </div>
              <div style={{ fontSize: 13, color: '#999' }}>
                142 porsi terjual &nbsp;·&nbsp; 95 transaksi berhasil &nbsp;·&nbsp; 3 refund
              </div>
            </div>

            {/* KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              <StatCard label="Total Revenue"   value={rpK(totalRevenue)}  sub="Semua produk" highlight />
              <StatCard label="Profit Kotor"    value={rpK(totalProfit)}   sub={`Margin ${marginPct}%`} />
              <StatCard label="Total Porsi"     value={totalQty + ' pcs'}  sub={totalOrders + ' transaksi'} />
              <StatCard label="Avg. Order"      value={rpK(Math.round(totalRevenue / totalOrders))} sub="per transaksi" />
              <StatCard label="Modal Kembali"   value="62.8%"              sub="dari Rp869.000" />
              <StatCard label="BEP"             value="±263 pcs"           sub="±2.6 minggu" />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 24 }}>
              <ChartCard title="Revenue & Profit per Minggu" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_REVENUE} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="minggu" tick={{ fontSize: 11, fill: C.smoke }} />
                    <YAxis tickFormatter={rpK} tick={{ fontSize: 10, fill: C.smoke }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="revenue" name="Revenue" fill={C.red}    radius={[4,4,0,0]} />
                    <Bar dataKey="profit"  name="Profit"  fill={C.orange} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Metode Pembayaran" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PAYMENT_DATA} dataKey="value" nameKey="name"
                      cx="50%" cy="45%" outerRadius={85} innerRadius={45}
                      label={({ name, pct }) => `${name} ${pct}%`}
                      labelLine={{ stroke: C.smoke }}
                    >
                      {PAYMENT_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => rp(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Insight rows — tanpa icon */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { label: 'Minggu 2 Dominan',      desc: 'Minggu 2 menyumbang 70% total revenue. Frekuensi kehadiran berjualan sangat menentukan hasil akhir.' },
                { label: 'Kentang Goreng Terkuat', desc: 'Margin tertinggi 26.2% dan qty terbanyak 80 pcs. Produk ini wajib dijaga ketersediaan stoknya.' },
                { label: 'QRIS Pilihan Utama',     desc: '88.4% transaksi via QRIS. Pelanggan Mandi Saos sudah terbiasa cashless — pastikan QR selalu tersedia.' },
                { label: 'Payback Period Cepat',   desc: 'Modal Rp869.000 diperkirakan kembali dalam ±2.6 minggu jika konsisten menjual 100 pcs per minggu.' },
              ].map((c, i) => (
                <div key={i} style={{
                  background: C.white, border: '1px solid #E8E8E8',
                  borderRadius: 10, padding: '16px 18px',
                  borderLeft: '3px solid ' + (i % 2 === 0 ? C.red : C.orange),
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5, color: C.dark }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: C.smoke, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ PRODUK ══ */}
        {tab === 'Produk' && (
          <>
            <SectionTitle tag="Analisis" title="Performa Per Produk" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <ChartCard title="Revenue per Produk" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PRODUCT_DATA.filter(p => p.produk !== 'Add On')} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="produk" tick={{ fontSize: 10, fill: C.smoke }} />
                    <YAxis tickFormatter={rpK} tick={{ fontSize: 10, fill: C.smoke }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" radius={[4,4,0,0]}>
                      {PRODUCT_DATA.filter(p => p.produk !== 'Add On').map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Distribusi Unit Terjual" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PRODUCT_DATA.filter(p => p.qty > 0)} dataKey="qty" nameKey="produk"
                      cx="50%" cy="45%" outerRadius={90} innerRadius={45}
                      label={({ produk, qty }) => `${qty} pcs`} labelLine>
                      {PRODUCT_DATA.filter(p => p.qty > 0).map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <Divider />
            <SectionTitle tag="HPP" title="Margin Kotor per Produk" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {PRODUCT_DATA.filter(p => p.margin > 0).map((p, i) => (
                <div key={i} style={{ background: C.white, border: '1px solid #E8E8E8', borderRadius: 10, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>{p.produk}</div>
                      <div style={{ fontSize: 11, color: C.smoke, marginTop: 2 }}>
                        HPP {rp(p.hpp)} &nbsp;·&nbsp; Jual {rp(p.harga)} &nbsp;·&nbsp; Profit {rp(p.harga - p.hpp)}/porsi
                      </div>
                    </div>
                    <span style={{
                      background: p.margin > 24 ? '#FFF3CD' : '#F5F5F5',
                      color: p.margin > 24 ? '#92600A' : C.slate,
                      fontWeight: 800, fontSize: 15, padding: '4px 12px',
                      borderRadius: 6, letterSpacing: '-0.01em',
                    }}>{p.margin}%</span>
                  </div>
                  <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${p.margin}%`, height: '100%',
                      background: CHART_COLORS[i], borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <Divider />
            <SectionTitle tag="Mix" title="Komposisi Produk per Minggu" />
            <ChartCard height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_PRODUCT} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="minggu" tick={{ fontSize: 12, fill: C.smoke }} />
                  <YAxis tick={{ fontSize: 10, fill: C.smoke }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Kentang Goreng" stackId="a" fill={C.red}    />
                  <Bar dataKey="Onion Ring"     stackId="a" fill={C.slate}  />
                  <Bar dataKey="Makaroni Mix"   stackId="a" fill={C.orange} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {/* ══ CASHFLOW ══ */}
        {tab === 'Cashflow' && (
          <>
            <SectionTitle tag="Realisasi" title="Cashflow 4 Minggu Operasional" />
            <ChartCard title="Pemasukan, HPP & Profit per Minggu" height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_REVENUE} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="minggu" tick={{ fontSize: 11, fill: C.smoke }} />
                  <YAxis tickFormatter={rpK} tick={{ fontSize: 10, fill: C.smoke }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="revenue" name="Pemasukan" fill={C.red}    radius={[4,4,0,0]} />
                  <Bar dataKey="hpp"     name="Est. HPP"  fill={C.mist}   radius={[4,4,0,0]} />
                  <Bar dataKey="profit"  name="Profit"    fill={C.orange} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{ marginTop: 16 }}>
              <ChartCard title="Tren Qty & Transaksi per Minggu" height={240}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={WEEKLY_REVENUE} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="minggu" tick={{ fontSize: 11, fill: C.smoke }} />
                    <YAxis tick={{ fontSize: 10, fill: C.smoke }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="qty"    name="Qty Terjual" stroke={C.red}    strokeWidth={2.5} dot={{ r: 5, fill: C.red }} />
                    <Line type="monotone" dataKey="orders" name="Transaksi"   stroke={C.orange} strokeWidth={2}   dot={{ r: 4, fill: C.orange }} strokeDasharray="5 3" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <Divider />
            <SectionTitle tag="Tabel" title="Rincian Cashflow" />
            <div style={{ background: C.white, borderRadius: 12, border: '1px solid #E8E8E8', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.dark, color: C.white }}>
                    {['Periode', 'Qty', 'Pemasukan', 'Est. HPP', 'Profit', 'Margin', 'Catatan'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', fontWeight: 600, fontSize: 10,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        textAlign: ['Qty', 'Margin'].includes(h) ? 'center' : ['Pemasukan', 'Est. HPP', 'Profit'].includes(h) ? 'right' : 'left',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { p: 'Minggu 1', qty: 16,  rev: 218000,  hpp: 166893,  profit: 51107,  note: 'Hari perdana' },
                    { p: 'Minggu 2', qty: 95,  rev: 1425000, hpp: 1023157, profit: 401843, note: 'Penjualan terbesar' },
                    { p: 'Minggu 3', qty: 10,  rev: 132000,  hpp: 98950,   profit: 33050,  note: 'Volume rendah' },
                    { p: 'Minggu 4', qty: 18,  rev: 248000,  hpp: 188010,  profit: 59990,  note: 'Mulai stabil' },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0F0F0', background: i % 2 === 0 ? C.white : C.paper }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: C.dark }}>{r.p}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: C.smoke }}>{r.qty} pcs</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>{rp(r.rev)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: C.smoke }}>{rp(r.hpp)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: C.red, fontWeight: 700 }}>{rp(r.profit)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: C.smoke }}>{((r.profit / r.rev) * 100).toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px', color: C.smoke, fontSize: 12 }}>{r.note}</td>
                    </tr>
                  ))}
                  <tr style={{ background: C.dark, color: C.white, fontWeight: 700 }}>
                    <td style={{ padding: '12px 16px' }}>TOTAL</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>139 pcs</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{rp(2023000)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#aaa' }}>{rp(1477010)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: C.orange }}>{rp(545990)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>27.0%</td>
                    <td style={{ padding: '12px 16px' }}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ══ PROYEKSI ══ */}
        {tab === 'Proyeksi' && (
          <>
            <SectionTitle tag="Proyeksi" title="Estimasi 3 Bulan ke Depan" />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
              <ChartCard title="Revenue, HPP & Profit Proyeksi" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PROJECTION} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: C.smoke }} />
                    <YAxis tickFormatter={rpK} tick={{ fontSize: 10, fill: C.smoke }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="revenue" name="Revenue"  fill={C.red}    radius={[4,4,0,0]} />
                    <Bar dataKey="hpp"     name="Est. HPP" fill={C.mist}   radius={[4,4,0,0]} />
                    <Bar dataKey="profit"  name="Profit"   fill={C.orange} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <StatCard label="Profit Kumulatif 3 Bln" value="Rp4,16Jt" sub="Target 100 pcs/minggu" highlight />
                <StatCard label="BEP" value="±263 porsi" sub="±2.6 minggu operasional" />
                <StatCard label="Growth Target" value="+5%/bln" sub="Skenario moderat" />
              </div>
            </div>

            <Divider />
            <SectionTitle tag="Asumsi" title="Parameter Proyeksi" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Target/Minggu', val: '100 pcs',  note: 'Konsisten tiap minggu' },
                { label: 'Target/Bulan',  val: '400 pcs',  note: 'Bulan pertama' },
                { label: 'Growth/Bulan',  val: '5%',       note: 'Skenario moderat' },
                { label: 'Mix KG',        val: '58.5%',    note: 'Sesuai pola aktual' },
                { label: 'Mix OR',        val: '26.8%',    note: 'Sesuai pola aktual' },
                { label: 'Mix MM',        val: '14.8%',    note: 'Sesuai pola aktual' },
              ].map((a, i) => (
                <div key={i} style={{ background: C.white, border: '1px solid #E8E8E8', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: C.smoke, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{a.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em' }}>{a.val}</div>
                  <div style={{ fontSize: 11, color: C.smoke, marginTop: 2 }}>{a.note}</div>
                </div>
              ))}
            </div>

            <Divider />
            <SectionTitle tag="Tabel" title="Rincian Proyeksi" />
            <div style={{ background: C.white, borderRadius: 12, border: '1px solid #E8E8E8', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.dark, color: C.white }}>
                    {['Keterangan', 'Bulan 1 (400 pcs)', 'Bulan 2 (420 pcs)', 'Bulan 3 (441 pcs)'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontWeight: 600, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: h === 'Keterangan' ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Estimasi Revenue',      vals: [5639000, 5921000, 6217000], bold: false },
                    { label: 'Estimasi HPP',           vals: [4318000, 4534000, 4761000], bold: false },
                    { label: 'Estimasi Profit Kotor',  vals: [1321000, 1387000, 1457000], bold: true  },
                  ].map(({ label, vals, bold }, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0F0F0', background: i % 2 === 0 ? C.white : C.paper }}>
                      <td style={{ padding: '12px 16px', fontWeight: bold ? 700 : 400, color: C.dark }}>{label}</td>
                      {vals.map((v, j) => (
                        <td key={j} style={{ padding: '12px 16px', textAlign: 'right', color: bold ? C.red : C.dark, fontWeight: bold ? 700 : 400 }}>{rp(v)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: C.paper }}>
                    <td style={{ padding: '12px 16px', color: C.smoke, fontWeight: 600 }}>Margin Kotor</td>
                    {['23.4%', '23.4%', '23.4%'].map((v, j) => (
                      <td key={j} style={{ padding: '12px 16px', textAlign: 'right', color: C.smoke }}>{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ══ MODAL ══ */}
        {tab === 'Modal' && (
          <>
            <SectionTitle tag="Funding" title="Alokasi Modal Awal" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <ChartCard title="Distribusi Penggunaan Dana" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={FUNDING} dataKey="value" nameKey="nama"
                      cx="50%" cy="47%" outerRadius={105} innerRadius={52}
                      label={({ nama, pct }) => `${pct}%`} labelLine>
                      {FUNDING.map((_, i) => <Cell key={i} fill={FUND_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => rp(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FUNDING.map((f, i) => (
                  <div key={i} style={{ background: C.white, border: '1px solid #E8E8E8', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: FUND_COLORS[i], flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: C.dark }}>{f.nama}</div>
                      <div style={{ height: 4, background: '#F0F0F0', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${f.pct}%`, height: '100%', background: FUND_COLORS[i], borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.dark }}>{rp(f.value)}</div>
                      <div style={{ fontSize: 11, color: C.smoke }}>{f.pct}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              <StatCard label="Modal Investor" value="Rp755.000" sub="Sumber utama" highlight />
              <StatCard label="Modal Pribadi"  value="Rp40.000"  sub="Tambahan pendiri" />
              <StatCard label="Total Modal"    value="Rp869.000" sub="Modal resmi tercatat" />
            </div>

            <Divider />
            <SectionTitle tag="BEP" title="Break-Even Analysis" />
            <div style={{ background: C.white, border: '1px solid #E8E8E8', borderRadius: 12, padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 20 }}>
                {[
                  { label: 'Total Modal yang Perlu Kembali',      val: 'Rp869.000',  color: C.red    },
                  { label: 'Rata-rata Profit per Porsi (Weighted)', val: 'Rp3.305',   color: C.red    },
                  { label: 'BEP dalam Unit',                       val: '±263 porsi', color: C.orange },
                  { label: 'BEP dalam Waktu (100 pcs/minggu)',     val: '±2.6 minggu',color: C.orange },
                ].map((b, i) => (
                  <div key={i} style={{ borderLeft: '3px solid ' + b.color, paddingLeft: 16 }}>
                    <div style={{ fontSize: 11, color: C.smoke, marginBottom: 4 }}>{b.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em' }}>{b.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#FFF8EC', borderRadius: 8, padding: '14px 18px', border: '1px solid #F5D78A' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#92600A', marginBottom: 4 }}>Catatan</div>
                <div style={{ fontSize: 12, color: '#6B4A0F', lineHeight: 1.7 }}>
                  Dari 142 porsi yang terjual selama 4 minggu operasional, profit kotor aktual Rp545.990
                  sudah menutup <strong>62.8%</strong> dari modal awal. Konsistensi kehadiran berjualan
                  adalah kunci mencapai BEP secepatnya.
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: 'center', padding: '24px', fontSize: 11, color: C.smoke, borderTop: '1px solid #E8E8E8', marginTop: 24, background: C.white }}>
        Mandi Saos &nbsp;·&nbsp; Dashboard Keuangan Periode Mei–Juni 2026 &nbsp;·&nbsp; Data dari 96 transaksi
      </footer>
    </div>
  )
}
