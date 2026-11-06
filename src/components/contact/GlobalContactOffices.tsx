import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { globalOffices } from '@/content/pages/contact/global'
import styles from './GlobalContactOffices.module.css'

export default function GlobalContactOffices() {
  return (
    <section className={styles.section} id="offices" aria-labelledby="global-offices-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Our Offices</p>
          <h2 id="global-offices-heading">Our Presence <span>Across the Regions</span></h2>
          <p className={styles.intro}>
            A growing network across the GCC and India — delivering installation, support, and compliance with local expertise.
          </p>
        </header>

        <ul className={styles.grid} role="list">
          {globalOffices.map(office => (
            <li className={styles.card} key={office.id}>
              <div className={styles.media}>
                <Image
                  className={styles.photo}
                  src={office.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 48vw, (max-width: 1440px) 32vw, 440px"
                />
                <div className={styles.overlay}>
                  <p className={styles.country}>
                    <Image src={office.flag} alt="" width={26} height={26} />
                    {office.country}
                  </p>
                  {office.badge && <span className={styles.badge}>{office.badge}</span>}
                </div>
              </div>
              <div className={styles.details}>
                <div>
                  <h3>{office.city}</h3>
                  <p className={styles.region}>{office.region}</p>
                </div>
                <p className={styles.address}>
                  <MapPin aria-hidden="true" size={16} />
                  {office.address}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
