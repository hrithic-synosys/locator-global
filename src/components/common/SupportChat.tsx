'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/config/site'

// ── Support chat ─────────────────────────────────────────────────────────────
//
// FRONTEND ONLY, BY DESIGN. There is no chat backend on this site and no live
// agent queue, so this does not pretend to be one. It is a scripted assistant
// over a static knowledge base: every answer below is authored copy, matched to
// the visitor's question by keyword, and every path ends by handing the
// conversation to a channel that a human actually reads — WhatsApp, phone, or
// the contact form. Nothing here waits on a network call, so it cannot hang,
// time out, or show a spinner that never resolves.
//
// The transcript lives in sessionStorage so the thread survives a client-side
// navigation (the dock is mounted once in the root layout and never unmounts,
// but a hard reload would otherwise wipe a half-finished question).

type Chip = { id: string; label: string }

type Link = { label: string; href: string }

type Msg = {
  id: string
  from: 'bot' | 'user'
  text: string
  /** Rendered as a button under the bubble; internal hrefs route client-side. */
  link?: Link
  /** Follow-up suggestions. Only the newest bot message shows its chips. */
  chips?: Chip[]
}

type Topic = {
  id: string
  /** Chip text, and the message echoed into the thread as the visitor's turn. */
  label: string
  answer: string
  link?: Link
  /** Ids of topics offered as follow-ups after this answer. */
  next?: string[]
  /** Lowercase stems matched against free-typed input. */
  keywords: string[]
}

const WA = `https://wa.me/${siteConfig.whatsapp}`

// ── The knowledge base ───────────────────────────────────────────────────────
// Deliberately short answers. A chat bubble is not a landing page: each one
// answers the question in two or three lines and then points at the page that
// carries the detail. Anything that would need a real quote — pricing, fleet
// sizing, certification paperwork — routes to a human rather than guessing.
const TOPICS: Topic[] = [
  {
    id: 'quote',
    label: 'Get a price / quote',
    answer:
      'Pricing depends on fleet size, the hardware you need, and contract length — so we build every quote by hand rather than publishing a list price. Share your fleet size and we usually come back the same business day.',
    link: { label: 'Request a quote', href: '/get-a-quote' },
    next: ['demo', 'gps', 'human'],
    keywords: ['price', 'pricing', 'cost', 'quote', 'quotation', 'how much', 'rate', 'budget', 'aed', 'cheap', 'plan'],
  },
  {
    id: 'demo',
    label: 'Book a free demo',
    answer:
      'Happy to walk you through the live platform — about 30 minutes, screen-shared or at your office in the UAE. You will see real tracking, reports and alerts, not slides.',
    link: { label: 'Book a free demo', href: '/get-a-free-demo' },
    next: ['quote', 'software', 'human'],
    keywords: ['demo', 'demonstration', 'trial', 'test', 'show me', 'presentation', 'meeting'],
  },
  {
    id: 'gps',
    label: 'GPS vehicle tracking',
    answer:
      'Real-time location, trip history, geofences, idling and speeding alerts, and fuel or driver-behaviour reporting — for cars, trucks, buses, trailers and heavy equipment.',
    link: { label: 'Explore fleet telematics', href: '/service/fleet-telematics' },
    next: ['video', 'iot', 'quote'],
    keywords: ['gps', 'track', 'tracking', 'tracker', 'vehicle', 'car', 'truck', 'fleet', 'location', 'geofence', 'live'],
  },
  {
    id: 'video',
    label: 'AI video telematics',
    answer:
      'AI dashcams that flag the events that matter — harsh braking, tailgating, phone use, fatigue — with video you can pull on demand and use to coach drivers or settle a claim.',
    link: { label: 'See video telematics', href: '/service/video-telematics' },
    next: ['gps', 'quote', 'demo'],
    keywords: ['video', 'camera', 'dashcam', 'dash cam', 'cctv', 'footage', 'driver behaviour', 'driver behavior', 'ai', 'adas', 'fatigue'],
  },
  {
    id: 'iot',
    label: 'Smart IoT & assets',
    answer:
      'Battery-powered trackers and sensors for the things that are not vehicles — trailers, generators, containers, cold-chain cargo — with temperature, door and tamper monitoring.',
    link: { label: 'Explore smart IoT', href: '/service/smart-iot' },
    next: ['gps', 'quote', 'human'],
    keywords: ['iot', 'asset', 'assets', 'sensor', 'temperature', 'cold chain', 'container', 'trailer', 'generator', 'equipment'],
  },
  {
    id: 'regulatory',
    label: 'Asateel / Shahin / SecurePath',
    answer:
      'We are an approved supplier for the UAE regulatory programmes — Asateel-certified OBUs, Shahin for RTA-regulated fleets, and SecurePath for Dubai Police. We handle the certification paperwork with you.',
    link: { label: 'Regulatory & certifications', href: '/regulatory' },
    next: ['quote', 'install', 'human'],
    keywords: ['asateel', 'shahin', 'securepath', 'secure path', 'rta', 'police', 'certified', 'certificate', 'regulation', 'regulatory', 'compliance', 'obu', 'approval'],
  },
  {
    id: 'install',
    label: 'Installation & coverage',
    answer:
      'Installation is done by our own technicians across all seven emirates, at your yard or ours, and a typical vehicle takes under an hour. Fleet roll-outs are scheduled in batches so nothing sits off the road.',
    link: { label: 'Talk to our team', href: '/contact' },
    next: ['support', 'quote', 'human'],
    keywords: ['install', 'installation', 'fitting', 'fit', 'coverage', 'dubai', 'abu dhabi', 'sharjah', 'ajman', 'uae', 'location', 'office', 'where'],
  },
  {
    id: 'software',
    label: 'Platform & software',
    answer:
      'One dashboard for live tracking, reports, maintenance, expenses and task dispatch — on web and mobile, with role-based access for dispatchers, managers and finance.',
    link: { label: 'Tour the software', href: '/software' },
    next: ['demo', 'gps', 'quote'],
    keywords: ['software', 'platform', 'dashboard', 'app', 'mobile', 'portal', 'login', 'report', 'reports', 'api', 'integration'],
  },
  {
    id: 'support',
    label: "I'm an existing customer",
    answer:
      'Sorry for the trouble. Support is fastest on WhatsApp or by phone — have your vehicle plate or device number ready and the team can look it up straight away.',
    link: { label: 'Message support on WhatsApp', href: WA },
    next: ['human', 'install'],
    keywords: ['support', 'help', 'issue', 'problem', 'not working', 'offline', 'broken', 'fault', 'complaint', 'renew', 'renewal', 'invoice', 'account'],
  },
  {
    id: 'human',
    label: 'Talk to a person',
    answer: `Of course. Message us on WhatsApp for the quickest reply, or call ${siteConfig.phoneDisplay} — Saturday to Thursday, 9am to 6pm.`,
    link: { label: 'Open WhatsApp', href: WA },
    next: ['quote', 'demo'],
    keywords: ['human', 'person', 'agent', 'talk', 'call', 'phone', 'someone', 'sales', 'representative', 'contact', 'whatsapp', 'email'],
  },
]

const BY_ID = new Map(TOPICS.map((t) => [t.id, t]))

/** Chips shown with the opening message — the four things visitors ask for most. */
const OPENING_CHIPS = ['quote', 'demo', 'gps', 'human']

const GREETING_WORDS = ['hi', 'hello', 'hey', 'salam', 'salaam', 'assalam', 'good morning', 'good afternoon', 'good evening', 'marhaba']

const STORE_KEY = 'locator.support-chat.v1'

// sessionStorage THROWS rather than returning null when storage is blocked — a
// locked-down enterprise profile, Safari in private mode with cookies disabled.
// Every access goes through these so a blocked store degrades to "no persistence"
// instead of throwing inside a commit and taking the widget out with it.
const readStore = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}
const writeStore = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    /* no persistence available — non-fatal */
  }
}

const chipsFor = (ids: string[]): Chip[] =>
  ids.map((id) => BY_ID.get(id)).filter((t): t is Topic => Boolean(t)).map((t) => ({ id: t.id, label: t.label }))

const openingMessage = (): Msg => ({
  id: 'm0',
  from: 'bot',
  text: `Hi 👋 Welcome to ${siteConfig.name}. Ask me anything about fleet tracking — or pick one of these to start.`,
  chips: chipsFor(OPENING_CHIPS),
})

// ── Free-text matching ───────────────────────────────────────────────────────
// Scored keyword overlap, not fuzzy search. Longer keywords score higher so
// that "dash cam" beats a stray "cam", and a phrase match ("how much") outranks
// a single generic word. A zero score falls through to the handoff reply rather
// than guessing at an answer.
function matchTopic(input: string): Topic | null {
  const q = ` ${input.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()} `
  if (!q.trim()) return null

  let best: Topic | null = null
  let bestScore = 0
  for (const topic of TOPICS) {
    let score = 0
    for (const kw of topic.keywords) {
      if (q.includes(` ${kw} `) || q.includes(`${kw} `) || q.includes(` ${kw}`)) {
        score += kw.includes(' ') ? kw.length * 2 : kw.length
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = topic
    }
  }
  return best
}

function isGreeting(input: string): boolean {
  const q = input.toLowerCase().trim().replace(/[^\p{L}\s]/gu, '')
  return q.length <= 24 && GREETING_WORDS.some((w) => q === w || q.startsWith(`${w} `))
}

export default function SupportChat() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([openingMessage()])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [nudge, setNudge] = useState(false)

  const seq = useRef(1)
  const listRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const fabRef = useRef<HTMLButtonElement | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const nextId = () => `m${seq.current++}`

  // ── Restore an in-progress thread ─────────────────────────────────────────
  // sessionStorage, not localStorage: a conversation is relevant to this visit
  // and stale on the next one. Any parse failure just falls back to a fresh
  // thread — a corrupt key must never take the widget down.
  useEffect(() => {
    const raw = readStore(STORE_KEY)
    if (!raw) return
    try {
      const saved = JSON.parse(raw) as { msgs?: Msg[]; open?: boolean }
      if (Array.isArray(saved.msgs) && saved.msgs.length) {
        setMsgs(saved.msgs)
        seq.current = saved.msgs.length + 1
        if (saved.open) setOpen(true)
      }
    } catch {
      /* corrupt key — fresh thread */
    }
  }, [])

  useEffect(() => {
    writeStore(STORE_KEY, JSON.stringify({ msgs, open }))
  }, [msgs, open])

  // Every pending bot reply is cancellable, so unmounting or resetting mid-reply
  // can't push a message into a thread that no longer exists.
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  // Pin to the newest message. `behavior: auto` on the first paint after open —
  // smooth-scrolling a thread the visitor has not seen yet just wastes their time.
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: msgs.length > 2 ? 'smooth' : 'auto' })
  }, [msgs, typing])

  // ── Attention nudge ──────────────────────────────────────────────────────
  // One teaser, once per session, and only if the visitor has not already
  // opened the chat. A widget that re-nags is worse than one that never speaks.
  useEffect(() => {
    if (open || readStore(`${STORE_KEY}.nudged`)) return
    const t = setTimeout(() => setNudge(true), 14000)
    return () => clearTimeout(t)
  }, [open])

  const dismissNudge = useCallback(() => {
    setNudge(false)
    writeStore(`${STORE_KEY}.nudged`, '1')
  }, [])

  const push = useCallback((m: Omit<Msg, 'id'>) => {
    setMsgs((prev) => [...prev, { ...m, id: nextId() }])
  }, [])

  // A short, length-scaled delay with a typing indicator. Instant replies read
  // as a lookup table; this reads as an answer being written.
  const reply = useCallback(
    (m: Omit<Msg, 'id' | 'from'>) => {
      setTyping(true)
      const wait = Math.min(1100, 420 + m.text.length * 4)
      const t = setTimeout(() => {
        setTyping(false)
        push({ ...m, from: 'bot' })
      }, wait)
      timers.current.push(t)
    },
    [push],
  )

  const answerTopic = useCallback(
    (topic: Topic, echo?: string) => {
      push({ from: 'user', text: echo ?? topic.label })
      reply({
        text: topic.answer,
        link: topic.link,
        chips: chipsFor(topic.next ?? ['quote', 'demo', 'human']),
      })
    },
    [push, reply],
  )

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim()
      if (!text) return
      setDraft('')

      if (isGreeting(text)) {
        push({ from: 'user', text })
        reply({
          text: 'Hello! What can I help you with today?',
          chips: chipsFor(OPENING_CHIPS),
        })
        return
      }

      const topic = matchTopic(text)
      if (topic) {
        answerTopic(topic, text)
        return
      }

      // Nothing matched. Say so plainly and hand off — a scripted assistant that
      // bluffs an answer costs more trust than one that admits its limits.
      push({ from: 'user', text })
      reply({
        text: "That one is better answered by a person than by me. Send it over on WhatsApp and the team will pick it up — or pick a topic below and I'll do my best.",
        link: { label: 'Continue on WhatsApp', href: `${WA}?text=${encodeURIComponent(text)}` },
        chips: chipsFor(['quote', 'demo', 'human']),
      })
    },
    [answerTopic, push, reply],
  )

  const reset = useCallback(() => {
    clearTimers()
    setTyping(false)
    setDraft('')
    seq.current = 1
    setMsgs([openingMessage()])
  }, [])

  const toggle = useCallback(() => {
    dismissNudge()
    setOpen((v) => !v)
  }, [dismissNudge])

  const close = useCallback(() => {
    setOpen(false)
    fabRef.current?.focus()
  }, [])

  // Escape closes from anywhere in the panel; focus returns to the launcher so a
  // keyboard user is not dropped at the top of the document.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => inputRef.current?.focus(), 260)
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, close])

  // Internal links navigate client-side and close the panel behind them;
  // wa.me and tel: are external hand-offs and leave the panel alone.
  const followLink = (href: string) => {
    if (href.startsWith('/')) {
      setOpen(false)
      router.push(href)
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  const lastBot = [...msgs].reverse().find((m) => m.from === 'bot')

  return (
    <>
      {nudge && !open && (
        <div className="sc-nudge">
          <button type="button" className="sc-nudge__body" onClick={toggle}>
            <strong>Need a hand?</strong>
            <span>Ask about pricing, demos or coverage.</span>
          </button>
          <button type="button" className="sc-nudge__x" onClick={dismissNudge} aria-label="Dismiss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}

      <button
        ref={fabRef}
        type="button"
        className={`sc-fab${open ? ' is-open' : ''}${nudge ? ' is-nudging' : ''}`}
        onClick={toggle}
        aria-expanded={open}
        aria-controls="support-chat-panel"
        aria-label={open ? 'Close support chat' : 'Open support chat'}
      >
        <span className="sc-fab__ic sc-fab__ic--chat" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.9 3 2.8 6.4 2.8 10.6c0 2.3 1.2 4.4 3.2 5.8-.1 1-.6 2.3-1.5 3.4-.2.3 0 .7.4.6 2-.3 3.6-1.2 4.6-1.9.8.2 1.7.3 2.5.3 5.1 0 9.2-3.4 9.2-7.6S17.1 3 12 3Z" />
            <circle cx="8.3" cy="10.6" r="1.15" fill="#fff" />
            <circle cx="12" cy="10.6" r="1.15" fill="#fff" />
            <circle cx="15.7" cy="10.6" r="1.15" fill="#fff" />
          </svg>
        </span>
        <span className="sc-fab__ic sc-fab__ic--x" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </span>
      </button>

      <div
        id="support-chat-panel"
        className={`sc-panel${open ? ' is-open' : ''}`}
        role="dialog"
        aria-label={`${siteConfig.name} support chat`}
        // Hidden from the tree AND from tab order while closed — a panel that is
        // only visually collapsed still traps a keyboard user in invisible fields.
        aria-hidden={!open}
        inert={!open}
      >
        <header className="sc-head">
          <span className="sc-head__av" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.5a7 7 0 0 0-7 7v3.2" />
              <path d="M19 12.7V9.5a7 7 0 0 0-2.2-5.1" />
              <rect x="2.6" y="12.2" width="3.4" height="5.2" rx="1.7" fill="currentColor" stroke="none" />
              <rect x="18" y="12.2" width="3.4" height="5.2" rx="1.7" fill="currentColor" stroke="none" />
              <path d="M19 17.6v.6a2.6 2.6 0 0 1-2.6 2.6H13" />
            </svg>
          </span>
          <span className="sc-head__txt">
            <strong>{siteConfig.name} Support</strong>
            <em>
              <i aria-hidden="true" /> Typically replies in a few minutes
            </em>
          </span>
          <button type="button" className="sc-head__btn" onClick={reset} aria-label="Start a new conversation" title="Start over">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 11.5A8 8 0 1 1 17.7 6" />
              <path d="M20.5 3.5V8H16" />
            </svg>
          </button>
          <button type="button" className="sc-head__btn" onClick={close} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="sc-body" ref={listRef} aria-live="polite" aria-atomic="false">
          {msgs.map((m) => (
            <div key={m.id} className={`sc-row sc-row--${m.from}`}>
              {m.from === 'bot' && (
                <span className="sc-av" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3.2a6.4 6.4 0 0 0-6.4 6.4v2.6" />
                    <path d="M18.4 12.2V9.6A6.4 6.4 0 0 0 16.4 5" />
                    <rect x="3.4" y="11.8" width="3" height="4.6" rx="1.5" fill="currentColor" stroke="none" />
                    <rect x="17.6" y="11.8" width="3" height="4.6" rx="1.5" fill="currentColor" stroke="none" />
                    <path d="M18.4 16.6v.5a2.3 2.3 0 0 1-2.3 2.3h-2.7" />
                  </svg>
                </span>
              )}
              <div className="sc-bubble">
                <p>{m.text}</p>
                {m.link && (
                  <button type="button" className="sc-cta" onClick={() => followLink(m.link!.href)}>
                    <span>{m.link.label}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="sc-row sc-row--bot">
              <span className="sc-av" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3.2a6.4 6.4 0 0 0-6.4 6.4v2.6" />
                  <path d="M18.4 12.2V9.6A6.4 6.4 0 0 0 16.4 5" />
                  <rect x="3.4" y="11.8" width="3" height="4.6" rx="1.5" fill="currentColor" stroke="none" />
                  <rect x="17.6" y="11.8" width="3" height="4.6" rx="1.5" fill="currentColor" stroke="none" />
                  <path d="M18.4 16.6v.5a2.3 2.3 0 0 1-2.3 2.3h-2.7" />
                </svg>
              </span>
              <div className="sc-bubble sc-bubble--typing" aria-label="Typing">
                <i /><i /><i />
              </div>
            </div>
          )}

          {/* Only the newest bot turn keeps its chips. Leaving them live on every
              past message lets the thread branch off a question asked five turns
              ago, which makes the transcript impossible to follow. */}
          {!typing && lastBot?.chips?.length ? (
            <div className="sc-chips">
              {lastBot.chips.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="sc-chip"
                  onClick={() => {
                    const t = BY_ID.get(c.id)
                    if (t) answerTopic(t)
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <form
          className="sc-foot"
          onSubmit={(e) => {
            e.preventDefault()
            send(draft)
          }}
        >
          <input
            ref={inputRef}
            className="sc-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your question…"
            aria-label="Type your question"
            autoComplete="off"
            maxLength={500}
          />
          <button type="submit" className="sc-send" disabled={!draft.trim()} aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.4 20.4 21 12 3.4 3.6 3.39 10.1 15.5 12 3.39 13.9z" />
            </svg>
          </button>
        </form>

        <p className="sc-note">
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          {' · '}Quick answers from our assistant ·{' '}
          <a href={WA} target="_blank" rel="noopener noreferrer">
            talk to a person
          </a>
        </p>
      </div>

      <style jsx>{`
        /* ── Launcher ────────────────────────────────────────────────────────
           Geometry comes from --cd-* on the parent dock so the chat button is
           the same size and sits on the same right edge as WhatsApp and Call,
           without either file hard-coding the other's numbers. */
        .sc-fab {
          pointer-events: auto;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--cd-size, 48px);
          height: var(--cd-size, 48px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--cd-radius, 16px);
          cursor: pointer;
          color: #fff;
          /* Same two-layer sheen as the panel's buttons, so the launcher reads as
             the closed state of the thing it opens. */
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, transparent 48%),
            linear-gradient(140deg, #1360ee 0%, #0b40b8 100%);
          box-shadow:
            0 10px 26px -8px rgba(10, 137, 221, 0.5),
            0 4px 12px -4px rgba(15, 23, 42, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
          transition:
            transform 0.34s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease;
        }
        .sc-fab:hover,
        .sc-fab:focus-visible {
          transform: translateY(-3px) scale(1.06);
          box-shadow:
            0 18px 38px -10px rgba(10, 137, 221, 0.55),
            0 6px 16px -6px rgba(15, 23, 42, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
        }
        .sc-fab:active {
          transform: translateY(0) scale(0.95);
          transition-duration: 0.08s;
        }
        .sc-fab:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }

        /* Both glyphs are stacked and cross-faded rather than swapped in JSX, so
           the chat→close change is a rotation instead of a pop. */
        .sc-fab__ic {
          position: absolute;
          display: block;
          width: 55%;
          height: 55%;
          transition:
            opacity 0.26s ease,
            transform 0.34s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sc-fab__ic :global(svg) {
          width: 100%;
          height: 100%;
          display: block;
        }
        .sc-fab__ic--x {
          opacity: 0;
          transform: rotate(-90deg) scale(0.6);
        }
        .sc-fab.is-open .sc-fab__ic--chat {
          opacity: 0;
          transform: rotate(90deg) scale(0.6);
        }
        .sc-fab.is-open .sc-fab__ic--x {
          opacity: 1;
          transform: rotate(0) scale(1);
        }

        /* Pulse only while the teaser is up — a launcher that pulses forever
           becomes wallpaper within a minute. */
        .sc-fab.is-nudging::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px solid #1360ee;
          animation: scPulse 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          pointer-events: none;
        }
        @keyframes scPulse {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        /* ── Teaser ──────────────────────────────────────────────────────────
           Sized to the copy rather than the copy to the box. The previous version
           capped at 232px with the dismiss button taking a column out of the same
           flex row, which squeezed one sentence onto four ragged lines with the ×
           floating in the gutter. Now the card is wide enough for two clean lines,
           and the × is lifted out of the text flow entirely. */
        .sc-nudge {
          pointer-events: auto;
          position: absolute;
          right: calc(var(--cd-size, 48px) + 14px);
          bottom: 2px;
          width: max-content;
          max-width: min(268px, calc(100vw - var(--cd-size, 48px) - 44px));
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.88);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          backdrop-filter: blur(24px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 22px 46px -18px rgba(10, 45, 90, 0.42),
            0 3px 10px -6px rgba(15, 23, 42, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          animation: scNudgeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes scNudgeIn {
          from { opacity: 0; transform: translateX(14px) scale(0.92); }
          to { opacity: 1; transform: none; }
        }
        /* A small rotated square welded to the right edge, so the card points at
           the launcher instead of hovering unattached beside it. Its border shows
           on the two outer faces only; the third is covered by the card. */
        .sc-nudge::after {
          content: '';
          position: absolute;
          right: -5px;
          bottom: 17px;
          width: 10px;
          height: 10px;
          transform: rotate(45deg);
          background: rgba(255, 255, 255, 0.88);
          border-top: 1px solid rgba(255, 255, 255, 0.85);
          border-right: 1px solid rgba(255, 255, 255, 0.85);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          backdrop-filter: blur(24px) saturate(190%);
        }
        .sc-nudge__body {
          display: block;
          width: 100%;
          border: 0;
          background: none;
          cursor: pointer;
          text-align: left;
          padding: 13px 17px 14px 16px;
          font: inherit;
        }
        .sc-nudge__body strong {
          display: block;
          font-size: 13px;
          font-weight: 650;
          letter-spacing: -0.015em;
          color: #0f172a;
        }
        /* Lighter, smaller and looser than the title. The old card set one weight
           at one size, which is what made it read as heavy rather than as a
           two-level message. */
        .sc-nudge__body span {
          display: block;
          margin-top: 3px;
          font-size: 11.5px;
          font-weight: 450;
          line-height: 1.45;
          letter-spacing: -0.005em;
          color: #64748b;
        }
        .sc-nudge__body:hover strong { color: #0b40b8; }
        /* Floated onto the corner rather than given a column of its own — a
           dismiss affordance should cost the message no width at all. */
        .sc-nudge__x {
          position: absolute;
          top: -7px;
          right: -7px;
          display: grid;
          place-items: center;
          width: 21px;
          height: 21px;
          padding: 0;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 50%;
          background: #fff;
          color: #94a3b8;
          cursor: pointer;
          box-shadow: 0 4px 10px -4px rgba(15, 23, 42, 0.3);
          transition: color 0.2s ease, transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sc-nudge__x:hover {
          color: #0f172a;
          transform: scale(1.1);
        }
        .sc-nudge__x :global(svg) { width: 9px; height: 9px; display: block; }

        /* ── Panel ───────────────────────────────────────────────────────────
           Grows upward out of the launcher in the bottom-right corner. Its height
           is capped so the top edge stops short of the navbar and of the
           WhatsApp/Call pair parked under it — the panel must never cover the two
           channels it is offering as an alternative to itself. */
        .sc-panel {
          pointer-events: auto;
          position: fixed;
          right: calc(var(--cd-edge, 20px) + env(safe-area-inset-right, 0px));
          bottom: calc(
            var(--cd-bottom, 22px) + var(--cd-lift, 0px) + var(--cd-size, 48px) + 14px +
              env(safe-area-inset-bottom, 0px)
          );
          width: min(374px, calc(100vw - 40px));
          height: min(
            560px,
            calc(100dvh - var(--cd-bottom, 22px) - var(--cd-size, 48px) - var(--cd-top, 100px) - 30px)
          );
          /* Below roughly 560px of viewport the capped height would collapse to
             nothing; a floor keeps the thread readable and lets it scroll instead. */
          min-height: 320px;
          display: flex;
          flex-direction: column;
          border-radius: 26px;
          /* Frosted rather than solid white. The page behind it is photographic —
             hero video, maps, product shots — and a hard white slab sits on top of
             that like a dialog from another application. A blurred, faintly tinted
             surface belongs to the page it is floating over. */
          background: rgba(255, 255, 255, 0.82);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.75);
          /* Four layers: a long cool ambient shadow, a tight contact shadow, a blue
             tint that ties the panel to the brand rather than to a neutral grey,
             and an inner top highlight that gives the glass an edge. */
          box-shadow:
            0 40px 80px -28px rgba(10, 45, 90, 0.45),
            0 12px 28px -14px rgba(15, 23, 42, 0.22),
            0 0 0 1px rgba(10, 137, 221, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px) scale(0.96);
          transform-origin: bottom right;
          visibility: hidden;
          transition:
            opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.34s cubic-bezier(0.16, 1, 0.3, 1),
            bottom 0.42s cubic-bezier(0.16, 1, 0.3, 1),
            visibility 0s linear 0.34s;
        }
        .sc-panel.is-open {
          opacity: 1;
          transform: none;
          visibility: visible;
          transition-delay: 0s;
        }

        /* ── Header ──────────────────────────────────────────────────────────
           A deep brand gradient with a slow aurora drifting across it. The flat
           two-stop fill it replaced read as a coloured bar; the moving highlight
           is what makes it read as a lit surface. */
        .sc-head {
          position: relative;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px 13px 15px 16px;
          background:
            radial-gradient(120% 160% at 12% -20%, rgba(125, 232, 255, 0.5) 0%, transparent 58%),
            linear-gradient(135deg, #1360ee 0%, #0b40b8 52%, #0a3aa0 100%);
          color: #fff;
          flex-shrink: 0;
          overflow: hidden;
          /* A hairline of light along the join, so the header meets the thread on
             an edge rather than a seam. */
          box-shadow:
            inset 0 -1px 0 rgba(255, 255, 255, 0.16),
            0 10px 26px -18px rgba(9, 70, 130, 0.9);
        }
        .sc-head::after {
          content: '';
          position: absolute;
          inset: -60% -20%;
          background: radial-gradient(38% 44% at 50% 50%, rgba(255, 255, 255, 0.24) 0%, transparent 70%);
          animation: scAurora 11s ease-in-out infinite alternate;
          pointer-events: none;
        }
        @keyframes scAurora {
          from { transform: translate3d(-16%, 6%, 0) scale(1); }
          to { transform: translate3d(22%, -8%, 0) scale(1.25); }
        }
        .sc-head__av {
          position: relative;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: linear-gradient(150deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.12));
          border: 1px solid rgba(255, 255, 255, 0.34);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.45),
            0 6px 14px -8px rgba(3, 40, 78, 0.9);
          flex-shrink: 0;
        }
        .sc-head__av :global(svg) { width: 19px; height: 19px; display: block; }
        .sc-head__txt {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex: 1;
        }
        .sc-head__txt strong {
          font-size: 14.5px;
          font-weight: 650;
          letter-spacing: -0.015em;
          text-shadow: 0 1px 2px rgba(4, 42, 80, 0.25);
        }
        .sc-head__txt em {
          display: flex;
          align-items: center;
          gap: 6px;
          font-style: normal;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.005em;
          color: rgba(255, 255, 255, 0.86);
        }
        .sc-head__txt em i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          animation: scOnline 2.4s ease-out infinite;
        }
        @keyframes scOnline {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.65); }
          70%, 100% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
        }
        .sc-head__btn {
          position: relative;
          display: grid;
          place-items: center;
          width: 31px;
          height: 31px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          cursor: pointer;
          flex-shrink: 0;
          transition:
            background 0.22s ease,
            transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sc-head__btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        .sc-head__btn:active { transform: scale(0.94); }
        .sc-head__btn :global(svg) { width: 15px; height: 15px; display: block; }

        /* ── Thread ──────────────────────────────────────────────────────────
           Two soft brand-tinted washes over near-white, so the surface has depth
           without pattern. The mask fades the top four pixels of content out under
           the header instead of letting messages cut off against a hard edge. */
        .sc-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 18px 15px 10px;
          background:
            radial-gradient(90% 55% at 8% 0%, rgba(10, 137, 221, 0.07) 0%, transparent 60%),
            radial-gradient(70% 40% at 100% 100%, rgba(37, 211, 102, 0.06) 0%, transparent 62%),
            linear-gradient(180deg, #fbfcfe 0%, #f1f5fa 100%);
          -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 14px);
          mask-image: linear-gradient(180deg, transparent 0, #000 14px);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sc-body::-webkit-scrollbar { width: 5px; }
        .sc-body::-webkit-scrollbar-track { background: transparent; }
        .sc-body::-webkit-scrollbar-thumb {
          background: rgba(10, 60, 110, 0.16);
          border-radius: 99px;
        }
        .sc-body::-webkit-scrollbar-thumb:hover { background: rgba(10, 60, 110, 0.3); }

        .sc-row { display: flex; align-items: flex-end; gap: 8px; }
        .sc-row--bot { justify-content: flex-start; }
        .sc-row--user { justify-content: flex-end; }

        /* Small assistant mark beside every bot turn. It costs 26px of width and
           buys the thread an identity — without it the two speakers are told apart
           only by colour and alignment. */
        .sc-av {
          display: grid;
          place-items: center;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          margin-bottom: 2px;
          border-radius: 9px;
          color: #fff;
          background: linear-gradient(150deg, #1360ee 0%, #0b40b8 100%);
          box-shadow:
            0 4px 10px -4px rgba(10, 137, 221, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          animation: scPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .sc-av :global(svg) { width: 15px; height: 15px; display: block; }

        .sc-bubble {
          max-width: 78%;
          padding: 11px 14px;
          border-radius: 18px;
          font-size: 13.5px;
          line-height: 1.55;
          letter-spacing: -0.005em;
          animation: scPop 0.34s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes scPop {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: none; }
        }
        .sc-bubble p { margin: 0; }
        .sc-row--bot .sc-bubble {
          background: rgba(255, 255, 255, 0.94);
          color: #16233a;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-bottom-left-radius: 7px;
          box-shadow:
            0 8px 20px -14px rgba(15, 23, 42, 0.5),
            0 1px 2px rgba(15, 23, 42, 0.04);
        }
        /* Sheen across the top third rather than a flat fill — the same trick the
           dock buttons use, so the two controls share a material. */
        .sc-row--user .sc-bubble {
          position: relative;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, transparent 46%),
            linear-gradient(140deg, #1360ee 0%, #0b40b8 100%);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-bottom-right-radius: 7px;
          box-shadow:
            0 12px 24px -14px rgba(10, 111, 196, 0.95),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .sc-bubble--typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 14px 15px;
        }
        .sc-bubble--typing i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #9fb0c6;
          animation: scDot 1.25s ease-in-out infinite;
        }
        .sc-bubble--typing i:nth-child(2) { animation-delay: 0.16s; }
        .sc-bubble--typing i:nth-child(3) { animation-delay: 0.32s; }
        @keyframes scDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* The arrow travels on hover instead of the whole button growing — a 3px
           nudge on a glyph reads as intent, a scale on the button reads as a
           wobble. */
        .sc-cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 11px;
          padding: 9px 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 48%),
            linear-gradient(140deg, #1360ee 0%, #0b40b8 100%);
          color: #fff;
          font: inherit;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: -0.005em;
          cursor: pointer;
          box-shadow:
            0 10px 22px -12px rgba(10, 111, 196, 0.95),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
          transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease;
        }
        .sc-cta:hover {
          transform: translateY(-1.5px);
          box-shadow:
            0 16px 30px -12px rgba(10, 111, 196, 1),
            inset 0 1px 0 rgba(255, 255, 255, 0.42);
        }
        .sc-cta:active { transform: translateY(0) scale(0.98); }
        .sc-cta :global(svg) {
          width: 13px;
          height: 13px;
          display: block;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sc-cta:hover :global(svg) { transform: translateX(3px); }

        /* Chips are indented to the depth of the bot bubbles they belong to, so
           the suggestions read as part of the assistant's turn rather than as a
           toolbar floating in the thread. */
        .sc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 2px 0 8px 34px;
          animation: scPop 0.34s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .sc-chip {
          position: relative;
          padding: 8px 14px;
          border: 1px solid rgba(10, 137, 221, 0.26);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: #0b40b8;
          font: inherit;
          font-size: 12.5px;
          font-weight: 550;
          letter-spacing: -0.005em;
          cursor: pointer;
          box-shadow: 0 4px 12px -8px rgba(10, 137, 221, 0.7);
          transition:
            background 0.22s ease,
            border-color 0.22s ease,
            color 0.22s ease,
            transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.24s ease;
        }
        .sc-chip:hover {
          background: linear-gradient(140deg, #1360ee 0%, #0b40b8 100%);
          border-color: transparent;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 12px 22px -12px rgba(10, 111, 196, 0.95);
        }
        .sc-chip:active { transform: translateY(0) scale(0.97); }

        /* ── Composer ────────────────────────────────────────────────────────
           Frosted, like the panel shell, with a hairline of light along the top
           edge instead of a grey rule. */
        .sc-foot {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 13px 7px;
          background: rgba(255, 255, 255, 0.86);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          backdrop-filter: blur(20px) saturate(180%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 -1px 0 rgba(15, 23, 42, 0.06);
          flex-shrink: 0;
        }
        .sc-input {
          flex: 1;
          min-width: 0;
          height: 43px;
          padding: 0 16px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 999px;
          background: rgba(241, 245, 250, 0.92);
          font: inherit;
          font-size: 13.5px;
          letter-spacing: -0.005em;
          color: #16233a;
          outline: none;
          /* Recessed at rest, lifted on focus — the field looks like a slot cut
             into the surface rather than a box drawn on it. */
          box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
          transition:
            border-color 0.24s ease,
            background 0.24s ease,
            box-shadow 0.24s ease;
        }
        .sc-input::placeholder { color: #9aa9bd; }
        .sc-input:focus {
          border-color: rgba(10, 137, 221, 0.55);
          background: #fff;
          box-shadow:
            0 0 0 3.5px rgba(10, 137, 221, 0.13),
            0 6px 16px -12px rgba(10, 111, 196, 0.9);
        }
        .sc-send {
          position: relative;
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 50%;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, transparent 50%),
            linear-gradient(140deg, #1360ee 0%, #0b40b8 100%);
          color: #fff;
          cursor: pointer;
          box-shadow:
            0 10px 22px -10px rgba(10, 111, 196, 0.95),
            inset 0 1px 0 rgba(255, 255, 255, 0.34);
          transition:
            opacity 0.24s ease,
            transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.24s ease,
            filter 0.24s ease;
        }
        /* Desaturated rather than just faded: a 38%-opacity blue button still
           looks like a live blue button, only paler. */
        .sc-send:disabled {
          opacity: 0.5;
          filter: grayscale(0.72);
          box-shadow: none;
          cursor: default;
        }
        .sc-send:not(:disabled):hover {
          transform: translateY(-1.5px) scale(1.05);
          box-shadow:
            0 16px 28px -10px rgba(10, 111, 196, 1),
            inset 0 1px 0 rgba(255, 255, 255, 0.44);
        }
        .sc-send:not(:disabled):active { transform: scale(0.94); }
        .sc-send :global(svg) {
          width: 17px;
          height: 17px;
          display: block;
          transform: translateX(1px);
        }

        .sc-note {
          margin: 0;
          padding: 0 13px 11px;
          background: rgba(255, 255, 255, 0.86);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          backdrop-filter: blur(20px) saturate(180%);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #93a3b8;
          text-align: center;
          flex-shrink: 0;
        }
        .sc-note a {
          color: #1360ee;
          text-decoration: none;
          font-weight: 650;
          border-bottom: 1px solid rgba(10, 137, 221, 0.28);
          transition: border-color 0.2s ease;
        }
        .sc-note a:hover { border-color: #1360ee; }

        /* ── Small screens ───────────────────────────────────────────────────
           Near-fullscreen sheet. Anchoring a 374px panel beside a 44px button on
           a 360px-wide phone leaves no room for either. */
        @media (max-width: 620px) {
          .sc-panel {
            right: 10px;
            left: 10px;
            width: auto;
            height: min(72dvh, calc(100dvh - var(--cd-top, 88px) - 90px));
            transform: translateY(12px) scale(0.97);
          }
          .sc-panel.is-open { transform: none; }
          .sc-nudge { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sc-fab,
          .sc-fab__ic,
          .sc-panel,
          .sc-cta,
          .sc-chip,
          .sc-send {
            transition-duration: 0.01ms;
          }
          .sc-fab.is-nudging::after,
          .sc-head::after,
          .sc-head__txt em i,
          .sc-bubble--typing i {
            animation: none;
          }
          .sc-av,
          .sc-bubble,
          .sc-chips,
          .sc-nudge {
            animation: none;
          }
          .sc-cta:hover :global(svg) {
            transform: none;
          }
          .sc-fab:hover,
          .sc-fab:focus-visible {
            transform: none;
          }
        }
      `}</style>
    </>
  )
}
