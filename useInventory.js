import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────
// CONFIGURATION — update these two values
// ─────────────────────────────────────────────

// 1. Your Google Sheet ID (from the URL):
//    https://docs.google.com/spreadsheets/d/SHEET_ID/edit
const SHEET_ID = 'YOUR_SHEET_ID_HERE'

// 2. The sheet tab name (default is "Sheet1")
const SHEET_TAB = 'Inventory'

// ─────────────────────────────────────────────
// The sheet must be published to the web:
//   File → Share → Publish to web → Sheet1 → CSV → Publish
// Then paste the SHEET_ID above.
// ─────────────────────────────────────────────

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_TAB}`

function parseCSV(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  return lines.slice(1).map(line => {
    // Handle commas inside quoted fields
    const values = []
    let current = ''
    let inQuotes = false
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue }
      if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue }
      current += char
    }
    values.push(current.trim())

    return headers.reduce((obj, header, i) => {
      obj[header] = values[i] || ''
      return obj
    }, {})
  }).filter(row => row.Year && row.Make) // skip empty rows
}

export function useInventory() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (SHEET_ID === 'YOUR_SHEET_ID_HERE') {
      // Dev mode: use sample data
      setVehicles(SAMPLE_DATA)
      setLoading(false)
      return
    }

    fetch(CSV_URL)
      .then(r => r.text())
      .then(text => {
        setVehicles(parseCSV(text))
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load inventory:', err)
        setError('Could not load inventory. Please try again.')
        setLoading(false)
      })
  }, [])

  return { vehicles, loading, error }
}

// ─────────────────────────────────────────────
// SAMPLE DATA — used during development
// Mirrors exact column names from the Google Sheet
// ─────────────────────────────────────────────
const SAMPLE_DATA = [
  {
    Year: '2018', Make: 'GMC', Model: 'Sierra 1500', Trim: 'SLE Double Cab',
    Type: 'Truck', Drivetrain: '4x4', Engine: '5.3L V8', Mileage: '155,000',
    Price: '19950', Status: 'Available',
    Features: 'Navigation, Heated Seats, Remote Start, Backup Camera, No Rust',
    Photos: 'https://static.wixstatic.com/media/461da9_b2a1b26ca1614dc8921ec9d466bc64ac~mv2.jpg',
    VIN: '1GTV2MEC0JZ208046', PhotoCount: '9'
  },
  {
    Year: '2017', Make: 'Chevy', Model: 'Silverado 1500', Trim: 'Z71 Crew Cab',
    Type: 'Truck', Drivetrain: '4x4', Engine: '5.3L V8', Mileage: '146,000',
    Price: '19950', Status: 'Sold',
    Features: 'Navigation, Remote Start, Backup Camera, No Rust',
    Photos: 'https://static.wixstatic.com/media/461da9_21d8f88a5525419888f0b75cbe23be3e~mv2.jpg',
    VIN: '3GCUKREC2HG328109', PhotoCount: '10'
  },
  {
    Year: '2015', Make: 'Ram', Model: '1500', Trim: 'Crew Cab',
    Type: 'Truck', Drivetrain: '4x4', Engine: '5.7L V8', Mileage: '117,000',
    Price: '16950', Status: 'Available',
    Features: 'Power Windows, Power Locks, Cloth Seats, Good Tires',
    Photos: 'https://static.wixstatic.com/media/461da9_2d3445017ffb464081a88ded58b96d29~mv2.jpg',
    VIN: '1C6RR7FT7FS737403', PhotoCount: '9'
  },
  {
    Year: '2015', Make: 'GMC', Model: 'Acadia', Trim: 'SLE2',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.6L V6', Mileage: '128,000',
    Price: '12950', Status: 'Available',
    Features: 'Heated Seats, Remote Start, Backup Camera, 3rd Row, Rebuilt Trans w/ Warranty',
    Photos: 'https://static.wixstatic.com/media/461da9_b2aee2fe769a4466a64c6eaffd62b3b7~mv2.jpg',
    VIN: '1GKKVPKD8FJ296735', PhotoCount: '11'
  },
  {
    Year: '2014', Make: 'Buick', Model: 'Enclave', Trim: 'Premium',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.6L V6', Mileage: '123,000',
    Price: '11950', Status: 'Available',
    Features: 'Navigation, DVD, Heated+Cooled Leather, Sunroof, 3rd Row',
    Photos: 'https://static.wixstatic.com/media/461da9_194185be4d9e4415a152cc7b5ff4a063~mv2.jpg',
    VIN: '5GAKVCKD6EJ203604', PhotoCount: '11'
  },
  {
    Year: '2014', Make: 'Chevy', Model: 'Traverse', Trim: 'LTZ',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.6L V6', Mileage: '141,000',
    Price: '9950', Status: 'Available',
    Features: 'Navigation, DVD, Heated+Cooled Leather, Tow Package, 3rd Row',
    Photos: 'https://static.wixstatic.com/media/461da9_ecd22490f95a451daedb40292c8298a9~mv2.jpg',
    VIN: '1GNKVJKD7EJ164435', PhotoCount: '10'
  },
  {
    Year: '2015', Make: 'Dodge', Model: 'Grand Caravan', Trim: 'SXT',
    Type: 'Van', Drivetrain: 'FWD', Engine: '3.6L V6', Mileage: '131,000',
    Price: '8950', Status: 'Available',
    Features: 'Stow & Go, Power Cloth Seats, Very Clean',
    Photos: 'https://static.wixstatic.com/media/461da9_dd7aa477d08d4b2ab96d907a5763ffcb~mv2.jpg',
    VIN: '2C4RDGCG6FR556504', PhotoCount: '9'
  },
  {
    Year: '2014', Make: 'Chevy', Model: 'Equinox', Trim: 'LT',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.6L V6', Mileage: '122,000',
    Price: '8950', Status: 'Available',
    Features: 'Heated Leather, Backup Camera, Remote Start, Very Clean',
    Photos: 'https://static.wixstatic.com/media/461da9_eca1b06d155644508679cfee67af39cb~mv2.jpg',
    VIN: '2GNFLGE33E6191996', PhotoCount: '10'
  },
  {
    Year: '2016', Make: 'Chrysler', Model: 'Town & Country', Trim: 'Touring',
    Type: 'Van', Drivetrain: 'FWD', Engine: '3.6L V6', Mileage: '144,000',
    Price: '7950', Status: 'Available',
    Features: 'DVD, Leather Seats, Stow & Go, Backup Camera',
    Photos: 'https://static.wixstatic.com/media/461da9_1a4e52026f5240a9ab5e2b125ed4d9d1~mv2.jpg',
    VIN: '2C4RC1BG8GR148315', PhotoCount: '9'
  },
  {
    Year: '2013', Make: 'Dodge', Model: 'Avenger', Trim: 'SXT',
    Type: 'Car', Drivetrain: 'FWD', Engine: '3.6L V6', Mileage: '129,000',
    Price: '7950', Status: 'Pending',
    Features: 'Navigation, Sunroof, Heated Leather, Remote Start',
    Photos: 'https://static.wixstatic.com/media/461da9_7a2be068393f41b7a065920bd29c928f~mv2.jpg',
    VIN: '1C3CDZCG6DN622274', PhotoCount: '8'
  },
  {
    Year: '2012', Make: 'Chevy', Model: 'Impala', Trim: 'LS',
    Type: 'Car', Drivetrain: 'FWD', Engine: '3.6L V6', Mileage: '117,000',
    Price: '6950', Status: 'Available',
    Features: 'Power Windows, Power Locks, AM/FM/CD, Cloth Seats',
    Photos: 'https://static.wixstatic.com/media/461da9_f98ebcca48f54979bdb59b2e1e7f32f8~mv2.jpg',
    VIN: '2G1WF5E30C1266001', PhotoCount: '8'
  },
  {
    Year: '2010', Make: 'Buick', Model: 'Lucerne', Trim: 'CX',
    Type: 'Car', Drivetrain: 'FWD', Engine: '3.9L V6', Mileage: '119,000',
    Price: '7950', Status: 'Available',
    Features: 'Power Cloth Seats, Very Clean, AM/FM/CD',
    Photos: 'https://static.wixstatic.com/media/461da9_e8dbc202e3c048d78c3d54a7e25ee0ef~mv2.jpg',
    VIN: '1G4HA5EM9AU129174', PhotoCount: '9'
  },
]
