import Markdown from 'react-markdown'
import { BLOG_PAGE_SIZE, httpsUrl } from '../../lib/blog.js'
import type { BlogPost } from '../../lib/blog.js'

export default function BlogContent({ posts, detail = false, page = 1 }: { posts: BlogPost[]; detail?: boolean; page?: number }) {
  if (detail && posts[0]) {
    const post = posts[0]
    return <article className="blog-article">
      <a href="/blog">← Blog</a>
      <h1>{post.title}</h1>
      {post.heading && <p className="blog-heading">{post.heading}</p>}
      {post.published_at && <time dateTime={post.published_at}>{post.published_at.slice(0, 10)}</time>}
      {post.intro && <p className="blog-intro">{post.intro}</p>}
      {httpsUrl(post.cover?.url_externa) && <img className="blog-cover" src={post.cover!.url_externa} alt={post.cover!.alt_text ?? ''} />}
      <div className="blog-body"><Markdown skipHtml>{post.body}</Markdown></div>
      {post.media.filter(image => image.id !== post.cover?.id && httpsUrl(image.url_externa)).map(image =>
        <figure key={image.id}><img loading="lazy" src={image.url_externa} alt={image.alt_text ?? ''} />{image.title && <figcaption>{image.title}</figcaption>}</figure>)}
    </article>
  }
  return <section>
    <h1>Blog</h1>
    {!posts.length && <p>No hay publicaciones disponibles en esta página.</p>}
    <div className="blog-grid">{posts.slice(0, BLOG_PAGE_SIZE).map(post => <article className="blog-card" key={post.id}>
      <a href={`/blog/${post.slug}`}>
        {httpsUrl(post.cover?.url_externa) && <img loading="lazy" src={post.cover!.url_externa} alt={post.cover!.alt_text ?? ''} />}
        <h2>{post.title}</h2>
      </a>
      {post.published_at && <time dateTime={post.published_at}>{post.published_at.slice(0, 10)}</time>}
      <p>{post.intro || post.heading}</p>
    </article>)}</div>
    <nav className="blog-pagination" aria-label="Paginación del blog">
      {page > 1 && <a href={`/blog?page=${page - 1}`}>← Anterior</a>}
      {posts.length > BLOG_PAGE_SIZE && <a href={`/blog?page=${page + 1}`}>Siguiente →</a>}
    </nav>
  </section>
}
