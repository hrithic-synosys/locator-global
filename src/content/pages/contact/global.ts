type Office = {
  id: string
  city: string
  country: string
  region: string
  flag: string
  image: string
  address: string
  badge?: string
}

// City-level placeholders can be replaced with verified street addresses.
export const globalOffices: Office[] = [
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    region: 'United Arab Emirates',
    flag: '/flags/uae.svg',
    image: '/contact/dubai-office.webp',
    address: 'City Tower 2, Sheikh Zayed Road, Trade Centre First, Dubai, UAE',
    badge: 'Head Office',
  },
  {
    id: 'abu-dhabi',
    city: 'Abu Dhabi',
    country: 'UAE',
    region: 'United Arab Emirates',
    flag: '/flags/uae.svg',
    image: '/contact/abu-dhabi-office.webp',
    address: 'Mazyad Mall, Mohammed Bin Zayed City, Abu Dhabi, UAE',
    badge: 'Regional Office',
  },
  {
    id: 'riyadh',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    region: 'Kingdom of Saudi Arabia',
    flag: '/flags/saudi-arabia.svg',
    image: '/contact/riyadh-office.webp',
    address: 'Riyadh, Saudi Arabia',
  },
  {
    id: 'muscat',
    city: 'Muscat',
    country: 'Oman',
    region: 'Sultanate of Oman',
    flag: '/flags/oman.svg',
    image: '/contact/muscat-office.webp',
    address: 'Muscat, Oman',
  },
  {
    id: 'kuwait-city',
    city: 'Kuwait City',
    country: 'Kuwait',
    region: 'State of Kuwait',
    flag: '/flags/kuwait.svg',
    image: '/contact/kuwait-city-office.webp',
    address: 'Kuwait City, Kuwait',
  },
  {
    id: 'doha',
    city: 'Doha',
    country: 'Qatar',
    region: 'State of Qatar',
    flag: '/flags/qatar.svg',
    image: '/contact/doha-office.webp',
    address: 'Doha, Qatar',
  },
  {
    id: 'calicut',
    city: 'Calicut',
    country: 'India',
    region: 'Kerala, India',
    flag: '/flags/india.svg',
    image: '/contact/calicut-office.webp',
    address: 'Calicut, Kerala, India',
    badge: 'Backend Operations',
  },
]
