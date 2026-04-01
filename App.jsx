import React, { useState, useMemo } from 'react'
import VehicleCard from './components/VehicleCard'
import { useInventory } from './useInventory'

const FILTERS = ['All', 'Cars', 'SUVs', 'Trucks', 'Vans', 'Under $10K', '4×4 / AWD']

const TYPE_MAP = {
  Cars: 'Car',
  SUVs: 'SUV',
  Trucks: 'Truck',
  Vans: 'Van',
}

export default function App() {
  const { vehicles, loading, error } = useInventory()
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return vehicles
    if (activeFilter === 'Under $10K') return vehicles.filter(v => parseInt(v.Price) < 10000)
    if (activeFilter === '4×4 / AWD') return vehicles.filter(v =>
      v.Drivetrain === '4x4' || v.Drivetrain === 'AWD'
    )
    return vehicles.filter(v => v.Type === TYPE_MAP[activeFilter])
  }, [vehicles, activeFilter])

  const available = vehicles.filter(v => v.Status === 'Available').length

  return (
    <>
      <header>
        <div className="logo">Silverado Ranch <span>LLC</span></div>
        <nav>
          <a href="#">Home</a>
          <a href="#" className="active">Inventory</a>
          <a href="#financing">Financing</a>
          <a href="tel:5079953567">Contact</a>
        </nav>
        <a href="tel:5079953567" className="header-cta">📞 507-995-3567</a>
      </header>

      <div className="hero-strip">
        <h1>Our <em>Inventory</em></h1>
        <div className="hero-meta">
          <strong>{available} Available</strong>
          <p>Family-owned · Wells, Minnesota<br />Every vehicle mechanically inspected</p>
        </div>
      </div>

      <div className="trust-row">
        {['Mechanically Inspected', 'Financing Available', 'Warranty on Financed Vehicles', 'Cards, Check & Cash Accepted', 'Family Owned'].map(t => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <div className="filter-chips">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="inventory-count">
          <strong>{filtered.length}</strong> vehicles shown
        </div>
      </div>

      {loading && (
        <div className="state-msg">Loading inventory…</div>
      )}

      {error && (
        <div className="state-msg state-error">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="state-msg">No vehicles match that filter.</div>
      )}

      {!loading && !error && (
        <div className="inventory-grid">
          {filtered.map((v, i) => (
            <VehicleCard key={v.VIN || i} vehicle={v} />
          ))}
        </div>
      )}

      <div className="financing-section" id="financing">
        <div>
          <h2>New <span>Financing</span><br />Now Available</h2>
          <p>
            Turned down before? Come back and try again — we now have a new
            finance company that can work with most people. Warranty included
            on all financed vehicles.
          </p>
        </div>
        <div className="financing-cta">
          <p>Call us today</p>
          <a href="tel:5079953567" className="big-phone">507-995-3567</a>
          <p>or 507-327-5878</p>
          <a href="tel:5079953567" className="header-cta" style={{ marginTop: '8px', display: 'inline-block' }}>
            Get Pre-Qualified
          </a>
        </div>
      </div>

      <footer>
        <div className="footer-logo">Silverado Ranch <span>LLC</span></div>
        <p>Small family-owned dealership · Wells, Minnesota<br />All vehicles mechanically inspected · Credit Cards, Checks, and Cash accepted</p>
        <p className="footer-dim">© {new Date().getFullYear()} Silverado Ranch LLC</p>
      </footer>
    </>
  )
}
