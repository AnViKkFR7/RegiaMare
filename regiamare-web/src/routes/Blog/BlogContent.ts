import { createElement as h } from 'react'
import Markdown from 'react-markdown'
import { BLOG_PAGE_SIZE, httpsUrl } from '../../lib/blog.js'
import type { BlogPost } from '../../lib/blog.js'

export default function BlogContent({ posts, detail = false, page = 1 }: { posts: BlogPost[]; detail?: boolean; page?: number }) {
  // El renderer compartido usa .ts para que Vercel resuelva su import .js
  // al trazar las dependencias de la función (no resuelve .js a .tsx).
  const date = (post: BlogPost) => post.published_at
    ? h('time', { dateTime: post.published_at }, post.published_at.slice(0, 10)) : null
  const cover = (post: BlogPost, className?: string) => httpsUrl(post.cover?.url_externa)
    ? h('img', { className, src: post.cover!.url_externa, alt: post.cover!.alt_text ?? '', loading: 'lazy' }) : null
  if (detail && posts[0]) {
    const post = posts[0]
    return h('article', { className: 'blog-article' },
      h('a', { href: '/blog' }, '← Blog'),
      h('h1', null, post.title),
      post.heading && h('p', { className: 'blog-heading' }, post.heading),
      date(post),
      post.intro && h('p', { className: 'blog-intro' }, post.intro),
      cover(post, 'blog-cover'),
      h('div', { className: 'blog-body' }, h(Markdown, { skipHtml: true, children: post.body })),
      post.media.filter(image => image.id !== post.cover?.id && httpsUrl(image.url_externa)).map(image =>
        h('figure', { key: image.id },
          h('img', { loading: 'lazy', src: image.url_externa, alt: image.alt_text ?? '' }),
          image.title && h('figcaption', null, image.title))),
    )
  }
  return h('section', null,
    h('h1', null, 'Blog'),
    !posts.length && h('p', null, 'No hay publicaciones disponibles en esta página.'),
    h('div', { className: 'blog-grid' }, posts.slice(0, BLOG_PAGE_SIZE).map(post =>
      h('article', { className: 'blog-card', key: post.id },
        h('a', { href: `/blog/${post.slug}` }, cover(post), h('h2', null, post.title)),
        date(post), h('p', null, post.intro || post.heading)))),
    h('nav', { className: 'blog-pagination', 'aria-label': 'Paginación del blog' },
      page > 1 && h('a', { href: `/blog?page=${page - 1}` }, '← Anterior'),
      posts.length > BLOG_PAGE_SIZE && h('a', { href: `/blog?page=${page + 1}` }, 'Siguiente →')),
  )
}
