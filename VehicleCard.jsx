import React, { useState } from 'react'

const STATUS_COLORS = {
  Available: null,
  Pending: 'pending',
  Sold: 'sold',
}

export default function VehicleCard({ vehicle }) {
  const [imgError, setImgError] = useState(false)
  const status = vehicle.Status || 'Available'
  const isSold = status === 'Sold'
  const isPending = status === 'Pending'
  const price = parseInt(vehicle.Price, 10)
  const features = vehicle.Features
    ? vehicle.Features.split(',').map(f => f.trim()).filter(Boolean)
    : []

  return (
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
                    <a href={`tel:5079953567`} className="btn-primary">Call Now</a>
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
  )
}
