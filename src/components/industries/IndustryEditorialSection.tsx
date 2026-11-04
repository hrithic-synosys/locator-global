import ContentIcon from '@/components/common/ContentIcon'
import type { CardSection } from '@/content/page-schema'
import styles from './IndustryEditorialSection.module.css'

type Props = {
  id: string
  content: CardSection & { eyebrow: string }
  variant: 'solutions' | 'directory'
}

export default function IndustryEditorialSection({ id, content, variant }: Props) {
  const List = variant === 'solutions' ? 'ol' : 'ul'

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`${styles.section} ${styles[variant]}`}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 id={`${id}-heading`}>{content.heading}</h2>
          {content.paragraphs.map(paragraph => <p key={paragraph} className={styles.intro}>{paragraph}</p>)}
        </header>
        <List role="list" className={styles.list}>
          {content.order.map((key, index) => {
            const item = content.items[key]
            return (
              <li key={key} className={styles.item}>
                <span className={styles.marker} aria-hidden="true">
                  {variant === 'solutions' ? String(index + 1).padStart(2, '0') : <ContentIcon name={item.icon} />}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            )
          })}
        </List>
      </div>
    </section>
  )
}
