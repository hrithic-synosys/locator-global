import Image from 'next/image'
import Link from '@/components/country/CountryLink'
import { INDUSTRIES } from './industries-data'

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function IndustriesGrid() {
  return (
    <section className="ig-sec">
      <style>{`
        .ig-sec { padding: clamp(48px,6vw,80px) 28px; background: #fff; }
        .ig-inner { max-width: var(--w-1280); margin: 0 auto; }

        .ig-head { max-width: 640px; margin: 0 0 clamp(28px,3.6vw,44px); }
        .ig-eyebrow {
          display: block; font-size: max(clamp(22px,2.8vw,32px), min(2.222vw, 46.4px)); font-weight: 800; letter-spacing: .04em;
          color: #1360ee; text-transform: uppercase; margin-bottom: 16px;
        }
        .ig-eyebrow span { display: block; width: 34px; height: 3px; background: #1360ee; border-radius: 2px; margin-bottom: 12px; }
        .ig-h2 { margin: 0; font-size: max(clamp(21px,2.5vw,28px), min(1.944vw, 40.6px)); font-weight: 800; line-height: 1.2; letter-spacing: -.015em; color: #1d1d1f; }
        .ig-lead { margin: 14px 0 0; font-size: max(clamp(14px,1.3vw,16px), min(1.111vw, 23.2px)); line-height: 1.65; color: #6e6e73; max-width: 56ch; }

        .ig-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(20px,2.4vw,28px); }
        @media (max-width: 980px) { .ig-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 620px) { .ig-grid { grid-template-columns: 1fr; } }

        .ig-card {
          display: flex; flex-direction: column; text-decoration: none;
          border-radius: 16px; overflow: hidden; background: #fff;
          border: 1px solid #e9e9ec;
          transition: transform .24s ${EASE}, box-shadow .24s ${EASE}, border-color .24s ${EASE};
        }
        .ig-card:hover { transform: translateY(-4px); border-color: #d6dcea; box-shadow: 0 22px 44px -22px rgba(20,40,90,.28); }

        .ig-card-media { position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #eef3fb; }
        .ig-card-media img { object-fit: cover; object-position: center; width: 100%; height: 100%; transition: transform .5s ${EASE}; }
        .ig-card:hover .ig-card-media img { transform: scale(1.06); }

        .ig-card-body { padding: 20px 22px 24px; flex: 1; display: flex; flex-direction: column; }
        .ig-card-title {
          margin: 0 0 14px; font-size: max(clamp(17px,1.9vw,21px), min(1.458vw, 30.45px)); font-weight: 800;
          text-transform: uppercase; line-height: 1.22; letter-spacing: -.01em; color: #1d1d1f;
        }
        .ig-card-tag {
          margin-top: auto; align-self: flex-start;
          font-size: var(--f-12-5); font-weight: 600; color: #3a3a3c;
          border: 1px solid #dfe2e8; border-radius: 999px; padding: 8px 15px;
          transition: background .2s ${EASE}, border-color .2s ${EASE}, color .2s ${EASE};
        }
        .ig-card:hover .ig-card-tag { background: #1360ee; border-color: #1360ee; color: #fff; }
      `}</style>

      <div className="ig-inner">
        <div className="ig-head" data-reveal>
          <span className="ig-eyebrow"><span />Industries</span>
          <h2 className="ig-h2">Built for every fleet, in every industry</h2>
          <p className="ig-lead">
            Explore how Locator’s GPS tracking, video telematics, and IoT platform are put to work across
            the sectors we serve every day.
          </p>
        </div>

        <div className="ig-grid" data-reveal>
          {INDUSTRIES.map((ind) => (
            <Link key={ind.slug} href={`/industries/${ind.slug}`} className="ig-card">
              <div className="ig-card-media">
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
              </div>
              <div className="ig-card-body">
                <h3 className="ig-card-title">{ind.name}</h3>
                <span className="ig-card-tag">{ind.cardTag}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
