'use client'

import { useMemo, useState } from 'react'
import Link from '@/components/country/CountryLink'
import { JOBS } from './jobs-data'
import FilterSelect from './FilterSelect'
import CountryFlag from './CountryFlag'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

// Fixed GCC + India list — shown regardless of where current openings are,
// so the filter reads as complete even before every region has a live role.
const LOCATIONS = [
  'All',
  'United Arab Emirates',
  'Saudi Arabia',
  'Kuwait',
  'Qatar',
  'Oman',
  'Bahrain',
  'India',
]

// Fixed job-area list — "Back Office" has no current opening but stays
// selectable so the filter doesn't look thinner than the business actually is.
const JOB_AREAS = ['All', 'Back Office', 'Sales Executive', 'IT Technical Support', 'GPS Field Technician']

export default function CareerJobsList() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All')
  const [jobArea, setJobArea] = useState('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return JOBS.filter((j) => {
      const matchesQuery = !q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q)
      const matchesLocation = location === 'All' || j.country === location
      const matchesArea = jobArea === 'All' || j.title === jobArea
      return matchesQuery && matchesLocation && matchesArea
    })
  }, [query, location, jobArea])

  return (
    <section id="open-positions" className="cjl-section">
      <style>{`
        .cjl-section { padding: clamp(56px,7vw,88px) 28px; background: #fff; scroll-margin-top: 90px; }
        .cjl-inner { max-width: var(--w-900); margin: 0 auto; }

        .cjl-h2 {
          margin: 0 0 clamp(28px,4vw,44px); text-align: center;
          font-size: max(clamp(24px,3vw,36px), min(2.500vw, 52.2px)); font-weight: 800; letter-spacing: -.02em; color: #1d1d1f;
          text-transform: uppercase;
        }

        .cjl-filters {
          display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 12px;
          margin-bottom: clamp(24px,3vw,32px);
        }
        @media (max-width: 760px) { .cjl-filters { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .cjl-filters { grid-template-columns: 1fr; } }

        .cjl-search {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px; border-radius: 12px;
          border: 1.5px solid #e4e8f0; background: #fbfcfe;
          transition: border-color .18s ${EASE}, box-shadow .18s ${EASE};
        }
        .cjl-search:focus-within { border-color: #1360ee; box-shadow: 0 0 0 4px rgba(19,96,238,.12); background: #fff; }
        .cjl-search input { flex: 1; border: 0; outline: 0; background: transparent; font-family: inherit; font-size: var(--f-14); color: #1d1d1f; }
        .cjl-search input::placeholder { color: #aab0bd; }
        .cjl-search svg { flex-shrink: 0; color: #9aa2b1; }

        .cjl-count { margin: 0 0 8px; font-size: var(--f-13); color: #8b93a3; }
        .cjl-count b { color: #1d1d1f; }

        .cjl-list { border-top: 1px solid #eef1f7; }
        .cjl-row {
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          padding: clamp(18px,2.2vw,24px) clamp(4px,1vw,8px);
          border-bottom: 1px solid #eef1f7;
          text-decoration: none; transition: background .2s ${EASE}, padding-left .2s ${EASE};
        }
        .cjl-row:hover { background: #f7f9fd; padding-left: 14px; }
        .cjl-row-title { margin: 0 0 4px; font-size: max(clamp(15px,1.5vw,17px), min(1.181vw, 24.65px)); font-weight: 800; letter-spacing: -.01em; color: #1d1d1f; text-transform: uppercase; }
        .cjl-row-dept { margin: 0; font-size: var(--f-13); color: #8b93a3; }
        .cjl-row-loc { flex-shrink: 0; display: flex; align-items: center; gap: 9px; font-size: var(--f-13-5); color: #52525e; }
        @media (max-width: 560px) { .cjl-row-loc { gap: 7px; } }
        .cjl-row-arrow { flex-shrink: 0; color: #c3cbd9; transition: transform .2s ${EASE}, color .2s ${EASE}; }
        .cjl-row:hover .cjl-row-arrow { color: #1360ee; transform: translateX(4px); }

        .cjl-empty { padding: 40px 8px; text-align: center; color: #8b93a3; font-size: var(--f-14); }
      `}</style>

      <div className="cjl-inner">
        <h2 className="cjl-h2">Open Positions</h2>

        <div className="cjl-filters" data-reveal>
          <div className="cjl-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search by keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search open positions"
            />
          </div>
          <FilterSelect
            label="Location"
            value={location}
            options={LOCATIONS}
            onChange={setLocation}
            renderIcon={(opt) => <CountryFlag country={opt} size={20} />}
          />
          <FilterSelect label="Job area" value={jobArea} options={JOB_AREAS} onChange={setJobArea} />
        </div>

        <p className="cjl-count"><b>{filtered.length}</b> of {JOBS.length} open roles</p>

        <div className="cjl-list" data-reveal>
          {filtered.length === 0 ? (
            <p className="cjl-empty">No roles match your search — try a different keyword, location, or job area.</p>
          ) : (
            filtered.map((job) => (
              <Link key={job.slug} href={`/about/career/${job.slug}`} className="cjl-row">
                <div>
                  <h3 className="cjl-row-title">{job.title}</h3>
                  <p className="cjl-row-dept">{job.department}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <span className="cjl-row-loc">
                    <CountryFlag country={job.country} size={18} />
                    {job.location}
                  </span>
                  <svg className="cjl-row-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
