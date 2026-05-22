import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────
// CONFIGURATION — update these two values
// ─────────────────────────────────────────────

// 1. Your Google Sheet ID (from the URL):
//    https://docs.google.com/spreadsheets/d/SHEET_ID/edit
const SHEET_ID = '2PACX-1vR5FUDreARbu_k7U-8vQ-VonkCl0ANeG2ZMUI2EUZBSqNVwDTGCwaWIrj7LAmXfModflIYLX2zbkr5P'

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
    Year: '2016', Make: 'Chevy', Model: 'Silverado 1500', Trim: 'LT Crew Cab',
    Type: 'Truck', Drivetrain: '4x4', Engine: '5.3L V8', Mileage: '152,000',
    Price: '19950', Status: 'Available',
    Features: 'Navigation, Heated Cloth Seats, Remote Start, Good Tires',
    Photos: 'https://static.wixstatic.com/media/461da9_26969965a791434e93138afb539af8ca~mv2.jpg',
    VIN: '1GCUKREC1GF194757', PhotoCount: '9'
  },
  {
    Year: '2012', Make: 'Dodge', Model: 'Ram 1500', Trim: 'Sport',
    Type: 'Truck', Drivetrain: '4x4', Engine: '5.7L V8', Mileage: '112,000',
    Price: '16950', Status: 'Available',
    Features: 'Power Cloth Seats, Good Tires, Very Clean',
    Photos: 'https://static.wixstatic.com/media/461da9_f6ee748c52684bbfb9d44071025ee185~mv2.jpg',
    VIN: '1C6RD7MT3CS304075', PhotoCount: '9'
  },
  {
    Year: '2017', Make: 'RAM', Model: '1500', Trim: 'Tradesman Double Cab',
    Type: 'Truck', Drivetrain: '4x4', Engine: '5.7L V8', Mileage: '142,000',
    Price: '14950', Status: 'Available',
    Features: 'Cloth Seats, Good Tires, Clean',
    Photos: 'https://static.wixstatic.com/media/461da9_ac908aeccf834a4ab77a0f75b681563d~mv2.jpg',
    VIN: '1C6RR7FT0HS589968', PhotoCount: '9'
  },
  {
    Year: '2013', Make: 'Ford', Model: 'Explorer', Trim: 'Limited',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.5L V6', Mileage: '121,000',
    Price: '10950', Status: 'Available',
    Features: 'Navigation, Heated Leather, Sunroof, Backup Camera, Remote Start',
    Photos: 'https://static.wixstatic.com/media/461da9_91216b969b0f4fff89101d0ee0896274~mv2.jpg',
    VIN: '1FM5K8F88DGA55140', PhotoCount: '10'
  },
  {
    Year: '2011', Make: 'Jeep', Model: 'Grand Cherokee', Trim: 'Limited',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '5.7L V8', Mileage: '99,000',
    Price: '10950', Status: 'Available',
    Features: 'Navigation, Heated Leather, Sunroof, Backup Camera',
    Photos: 'https://static.wixstatic.com/media/461da9_cccbba62c5a7496a9bd04d92fa761c83~mv2.jpg',
    VIN: '1J4RR5GT3BC575702', PhotoCount: '9'
  },
  {
    Year: '2016', Make: 'GMC', Model: 'Acadia', Trim: 'SLE1',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.6L V6', Mileage: '138,000',
    Price: '10950', Status: 'Available',
    Features: 'Navigation, Leather Seats, Backup Camera, Very Clean',
    Photos: 'https://static.wixstatic.com/media/461da9_6a23a1b25ae64a358a5227a305ee969a~mv2.jpg',
    VIN: '1GKKVNED4GJ105653', PhotoCount: '10'
  },
  {
    Year: '2014', Make: 'Chevy', Model: 'Traverse', Trim: 'LTZ',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.6L V6', Mileage: '141,000',
    Price: '9950', Status: 'Available',
    Features: 'Navigation, DVD, Heated+Cooled Leather, Tow Package, Remote Start, 3rd Row',
    Photos: 'https://static.wixstatic.com/media/461da9_ecd22490f95a451daedb40292c8298a9~mv2.jpg',
    VIN: '1GNKVJKD7EJ164435', PhotoCount: '10'
  },
  {
    Year: '2016', Make: 'Chrysler', Model: 'Town & Country', Trim: 'Touring',
    Type: 'Minivan', Drivetrain: 'FWD', Engine: '3.6L V6', Mileage: '137,000',
    Price: '8950', Status: 'Available',
    Features: 'DVD, Power Leather Seats, Stow & Go, Backup Camera',
    Photos: 'https://static.wixstatic.com/media/461da9_2869ed52bce34e25b4a6eceac38480c2~mv2.jpg',
    VIN: '2C4RC1BG4GR231160', PhotoCount: '9'
  },
  {
    Year: '2014', Make: 'Chevy', Model: 'Malibu', Trim: 'LT',
    Type: 'Car', Drivetrain: 'FWD', Engine: '2.5L', Mileage: '124,000',
    Price: '8950', Status: 'Available',
    Features: 'Remote Start, Leather Seats, Good Tires, Clean',
    Photos: 'https://static.wixstatic.com/media/461da9_6c4193f9658e480682bc7d992b0264c7~mv2.jpg',
    VIN: '1G11E5SL2EF146097', PhotoCount: '8'
  },
  {
    Year: '2016', Make: 'Chrysler', Model: 'Town & Country', Trim: 'Touring',
    Type: 'Minivan', Drivetrain: 'FWD', Engine: '3.6L V6', Mileage: '144,000',
    Price: '7950', Status: 'Available',
    Features: 'DVD, Power Leather Seats, Stow & Go, Backup Camera',
    Photos: 'https://static.wixstatic.com/media/461da9_fec2ecf469f1424799d5561b4bdd015f~mv2.jpg',
    VIN: '2C4RC1BG8GR148315', PhotoCount: '9'
  },
  {
    Year: '2015', Make: 'Chevy', Model: 'Sonic', Trim: 'LT',
    Type: 'Car', Drivetrain: 'FWD', Engine: '1.8L', Mileage: '107,000',
    Price: '7950', Status: 'Available',
    Features: 'Remote Start, Backup Camera, Cloth Seats, Good Tires',
    Photos: 'https://static.wixstatic.com/media/461da9_aad2a4613351430483feb6faec8b3e1d~mv2.jpg',
    VIN: '1G1JC5SH5F4178475', PhotoCount: '8'
  },
  {
    Year: '2012', Make: 'Chevy', Model: 'Impala', Trim: 'LS',
    Type: 'Car', Drivetrain: 'FWD', Engine: '3.6L V6', Mileage: '117,000',
    Price: '6950', Status: 'Available',
    Features: 'Power Cloth Seats, AM/FM/CD, Good Tires',
    Photos: 'https://static.wixstatic.com/media/461da9_b6460fcface1437193238ae014c96ca8~mv2.jpg',
    VIN: '2G1WF5E30C1266001', PhotoCount: '8'
  },
  {
    Year: '2007', Make: 'Ford', Model: 'Fusion', Trim: 'SE',
    Type: 'Car', Drivetrain: 'FWD', Engine: '3.0L V6', Mileage: '142,000',
    Price: '5950', Status: 'Available',
    Features: 'Super Clean, No Rust, Good Tires',
    Photos: 'https://static.wixstatic.com/media/461da9_bfad3c21d1ad4ad59e304fe22d8bdd02~mv2.jpg',
    VIN: '3FAHP07147R171282', PhotoCount: '8'
  },
  {
    Year: '2014', Make: 'Chevy', Model: 'Equinox', Trim: 'LT',
    Type: 'SUV', Drivetrain: 'AWD', Engine: '3.6L V6', Mileage: '122,000',
    Price: '8950', Status: 'Sold',
    Features: 'Heated Leather, Backup Camera, Remote Start',
    Photos: 'https://static.wixstatic.com/media/461da9_eca1b06d155644508679cfee67af39cb~mv2.jpg',
    VIN: '2GNFLGE33E6191996', PhotoCount: '10'
  },
]
