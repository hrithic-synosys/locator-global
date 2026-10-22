import { countryPath } from '@/lib/country/paths';
import { countries } from '@/config/countries';
import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ScrollReveal from '@/components/software/ScrollReveal'
import SoftwareNavbar from '@/components/software/SoftwareNavbar'
import BlogArticle from '@/components/about/newsroom/blog/BlogArticle'
import AboutPillarNav from '@/components/about/AboutPillarNav'
import Footer from '@/components/layouts/Footer'
import { BLOG_POSTS, blogHref, getBlogPost } from '@/components/about/newsroom/blog/blog-index'
import { getBlogContent } from '@/components/about/newsroom/blog/blog-content'
import { siteConfig, siteUrl } from '@/config/site'

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

// Known articles remain prerendered. Unknown slugs use the existing notFound()
// guard below, avoiding a framework fallback exception at the market boundary.

async function getPageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  const url = blogHref(post.slug)
  const image = { url: post.hero.src, width: post.hero.width, height: post.hero.height, alt: post.hero.alt }

  return {
    title: post.seoTitle || post.title,
    description: post.description,
    keywords: post.keywords.length ? post.keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.seoTitle || post.title,
      description: post.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: post.date,
      authors: [siteConfig.name],
      tags: post.keywords,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.description,
      images: [post.hero.src],
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string; market: CountryCode }>
}) {
  const { slug, market } = await params
  const post = getBlogPost(slug)
  const blocks = post && getBlogContent(slug)
  if (!post || !blocks) notFound()

  const url = `${siteUrl}${countryPath(blogHref(post.slug), market)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        image: [`${siteUrl}${post.hero.src}`],
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: countries[market].locale,
        keywords: post.keywords.join(', '),
        articleSection: post.tag,
        wordCount: post.readingMinutes * 200,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@type': 'Organization', name: siteConfig.name, url: siteUrl },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/brand/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}${countryPath('/', market)}` },
          { '@type': 'ListItem', position: 2, name: 'Newsroom', item: `${siteUrl}${countryPath('/about/newsroom', market)}` },
          { '@type': 'ListItem', position: 3, name: 'Blog', item: `${siteUrl}${countryPath('/about/newsroom/blog', market)}` },
          { '@type': 'ListItem', position: 4, name: post.title, item: url },
        ],
      },
    ],
  }

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollReveal />
      <SoftwareNavbar />
      <BlogArticle post={post} blocks={blocks} />
      <AboutPillarNav current="newsroom" />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode; slug: string }> }): Promise<Metadata> {
  const { market, slug } = await params;
  return marketMetadata(await getPageMetadata({ params }), market, `/about/newsroom/blog/${slug}`);
}
