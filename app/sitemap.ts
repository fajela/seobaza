import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

async function getEvents() {
  const eventsPath = path.join(process.cwd(), 'content', 'events')
  const events: Array<{ year: string; slug: string; date: string }> = []

  try {
    const years = await fs.readdir(eventsPath)

    for (const year of years) {
      const yearPath = path.join(eventsPath, year)
      const stat = await fs.stat(yearPath)

      if (stat.isDirectory()) {
        const files = await fs.readdir(yearPath)
        const mdxFiles = files.filter((file) => file.endsWith('.mdx'))

        for (const file of mdxFiles) {
          const filePath = path.join(yearPath, file)
          const fileContent = await fs.readFile(filePath, 'utf8')
          const { data } = matter(fileContent)

          events.push({
            year,
            slug: file.replace('.mdx', ''),
            date: data.date || new Date().toISOString(),
          })
        }
      }
    }
  } catch (error) {
    console.error('Error reading events:', error)
  }

  return events
}

async function getTests() {
  const testsPath = path.join(process.cwd(), 'content', 'tests')
  const tests: Array<{ slug: string; date: string }> = []

  try {
    const files = await fs.readdir(testsPath)
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'))

    for (const file of mdxFiles) {
      const filePath = path.join(testsPath, file)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const { data } = matter(fileContent)

      tests.push({
        slug: file.replace('.mdx', ''),
        date: data.date || new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('Error reading tests:', error)
  }

  return tests
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://seobaza.com.ua'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/test`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/knowledge-base`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/black-friday`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Articles
  const articles = getAllArticles()
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Events
  const events = await getEvents()
  const eventPages = events.map((event) => ({
    url: `${baseUrl}/events/${event.year}/${event.slug}`,
    lastModified: new Date(event.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Tests
  const tests = await getTests()
  const testPages = tests.map((test) => ({
    url: `${baseUrl}/test/${test.slug}`,
    lastModified: new Date(test.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages, ...eventPages, ...testPages]
}
