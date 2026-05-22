import React, { useState } from 'react'

const STATUS_COLORS = {
  Available: null,
  Pending: 'pending',
  Sold: 'sold',
}

function VehicleModal({ vehicle, onClose }) {
  const price = parseInt(vehicle.Price, 10)
  const features = vehicle.Features
    ? vehicle.Features.split(',').map(f => f.trim()).filter(Boolean)
    : []

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)',
        zIndex: 1000, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--charcoal, #141414)', border: '1px solid var(--border, #2a2a2a)',
        maxWidth: '720px', width: '100%', maxHeight: '90vh',
        overflowY: 'auto', position: 'relative',
        animation: 'modalIn .25s ease',
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 16,
          background: 'rgba(0,0,0,.6)', border: 'none', color: '#fff',
          fontSize: 24, lineHeight: 1, cursor: 'pointer',
          width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 10,
        }}>✕</button>

        {/* Photo */}
        <img
          src={vehicle.Photos}
          alt={`${vehicle.Year} ${vehicle.Make} ${vehicle.Model}`}
          style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
        />

        <div style={{ padding: '28px 32px 32px' }}>
          {/* Title */}
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
            fontSize: 32, textTransform: 'uppercase', lineHeight: 1, marginBottom: 4,
            color: 'var(--text, #e8e4dc)',
          }}>
            {vehicle.Year} {vehicle.Make} {vehicle.Model}
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15,
            color: 'var(--gold, #c8922a)', letterSpacing: '.06em',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            {vehicle.Trim}{vehicle.Engine ? ` · ${vehicle.Engine}` : ''}
          </div>

          {/* Specs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {vehicle.Mileage && <ModalSpec>{vehicle.Mileage} mi</ModalSpec>}
            {vehicle.Type && <ModalSpec>{vehicle.Type}</ModalSpec>}
            {vehicle.Drivetrain && <ModalSpec>{vehicle.Drivetrain}</ModalSpec>}
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase',
                color: 'var(--dim, #888)', marginBottom: 10,
              }}>Features &amp; Options</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {features.map((f, i) => (
                  <span key={i} style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13,
                    color: 'var(--text-soft, #b0a89a)',
                    background: 'var(--steel, #1e1e1e)',
                    padding: '4px 12px', borderLeft: '2px solid var(--gold, #c8922a)',
                  }}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid var(--border, #2a2a2a)', paddingTop: 20,
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                fontSize: 42, color: 'var(--gold-light, #e0a93a)',
              }}>
                ${price.toLocaleString()}
              </div>
              {vehicle.VIN && (
                <div style={{ fontSize: 11, color: 'var(--muted, #555)', marginTop: 4 }}>
                  VIN: {vehicle.VIN}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="tel:5079953567" className="btn-primary" style={{
                padding: '12px 24px', fontSize: 14, textDecoration: 'none',
              }}>📞 507-995-3567</a>
              <a href="tel:5073275878" className="btn-ghost" style={{
                padding: '12px 24px', fontSize: 14, textDecoration: 'none',
              }}>📞 507-327-5878</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalSpec({ children }) {
  return (
    <span style={{
      background: 'var(--steel, #1e1e1e)', border: '1px solid var(--border, #2a2a2a)',
      color: 'var(--text-soft, #b0a89a)',
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12,
      fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase',
      padding: '5px 12px',
    }}>{children}</span>
  )
}

export default function VehicleCard({ vehicle }) {
  const [imgError, setImgError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const status = vehicle.Status || 'Available'
  const isSold = status === 'Sold'
  const isPending = status === 'Pending'
  const price = parseInt(vehicle.Price, 10)
  const features = vehicle.Features
    ? vehicle.Features.split(',').map(f => f.trim()).filter(Boolean)
    : []

  return (
    <>
      <div className={`card ${isSold ? 'card--sold' : ''}`}>
        {(isSold || isPending) && (
          <div className={`card-badge badge-${status.toLowerCase()}`}>{status}</div>
        )}

        <div className="card-img-wrapper">
          <div className="card-img" style={{ opacity: isSold ? 0.4 : 1 }}>
            {!imgError ? (
              <img
                src={vehicle.Photos}
                alt={`${vehicle.Year} ${vehicle.Make} ${vehicle.Model}`}
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="img-placeholder">No Photo</div>
            )}
          </div>
          {vehicle.PhotoCount && !isSold && (
            <div className="photo-count">📷 {vehicle.PhotoCount} photos</div>
          )}
        </div>

        <div className="card-body">
          <div className={`card-year-make ${isSold ? 'text-muted' : ''}`}>
            {vehicle.Year} {vehicle.Make} {vehicle.Model}
          </div>
          <div className={`card-trim ${isSold ? 'text-muted' : ''}`}>
            {vehicle.Trim}
            {vehicle.Engine ? ` · ${vehicle.Engine}` : ''}
          </div>

          <div className="card-specs">
            {vehicle.Mileage && (
              <span className="spec-pill">{vehicle.Mileage} mi</span>
            )}
            {vehicle.Type && (
              <span className="spec-pill">{vehicle.Type}</span>
            )}
            {vehicle.Drivetrain && vehicle.Drivetrain !== 'FWD' && (
              <span className="spec-pill">{vehicle.Drivetrain}</span>
            )}
          </div>

          {features.length > 0 && !isSold && (
            <div className="card-features">
              {features.slice(0, 5).map((f, i) => (
                <span key={i} className="feature-tag">{f}</span>
              ))}
            </div>
          )}

          <div className="card-footer">
            {isSold ? (
              <>
                <div className="card-price price-sold">
                  ${price.toLocaleString()}
                </div>
                <div className="sold-label">Found a home.</div>
              </>
            ) : (
              <>
                <div className={`card-price ${isPending ? 'price-pending' : ''}`}>
                  ${price.toLocaleString()}
                </div>
                <div className="card-actions">
                  {isPending ? (
                    <button className="btn-ghost" disabled>Pending</button>
                  ) : (
                    <>
                      <button
                        className="btn-ghost"
                        onClick={() => setModalOpen(true)}
                      >Details</button>
                      <a href="tel:5079953567" className="btn-primary">Call Now</a>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {vehicle.VIN && (
            <div className="card-vin">VIN: {vehicle.VIN}</div>
          )}
        </div>
      </div>

      {modalOpen && (
        <VehicleModal vehicle={vehicle} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
