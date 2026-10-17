'use client'

import { useEffect, useState } from 'react'

type Section = { id: string; title: string }

export default function PrivacyContents({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = sections[0]?.id ?? ''
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= 132) current = section.id
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [sections])

  return (
    <nav className="pp-contents" aria-label="On this page">
      <h2>On this page</h2>
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>
              <span className="pp-nav-number">{index + 1}.</span>
              <span>{section.title.replace(/^\d+\.\s*/, '')}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
