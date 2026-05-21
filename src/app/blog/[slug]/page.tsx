import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://focuswaqt.space/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://focuswaqt.space/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

const BG    = '#1A3328';
const INK   = '#0D2118';
const WHITE  = '#FFFFFF';
const SAGE   = '#85AB8B';
const MUTED  = '#7BA88A';
const BORDER = `2px solid ${INK}`;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#F0F7F1' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .blog-link { transition: color 0.18s ease; text-decoration: none; }
        .blog-link:hover { color: ${SAGE} !important; }
        .blog-cta-btn:hover { transform: translateY(2px) !important; box-shadow: 1px 1px 0px ${INK} !important; }
        @media (max-width: 640px) {
          .blog-nav-links { display: none !important; }
          .blog-nav-pill { padding: 8px 10px 8px 16px !important; gap: 12px !important; }
          .article-pad { padding: 32px 16px 64px !important; }
        }
        .prose-body h2 { font-size: 1.35rem; font-weight: 800; letter-spacing: -0.025em; margin: 2.5rem 0 1rem; color: #F0F7F1; }
        .prose-body h3 { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; margin: 2rem 0 0.75rem; color: #F0F7F1; }
        .prose-body p { font-size: 1.05rem; line-height: 1.75; color: rgba(240,247,241,0.75); margin: 0 0 1.25rem; font-weight: 600; }
        .prose-body strong { color: #F0F7F1; font-weight: 800; }
        .prose-body a { color: ${SAGE}; text-decoration: underline; }
        .prose-body ul, .prose-body ol { padding-left: 1.5rem; margin: 0 0 1.25rem; }
        .prose-body li { font-size: 1.05rem; line-height: 1.75; color: rgba(240,247,241,0.75); margin-bottom: 0.4rem; font-weight: 600; }
        .prose-body hr { border: none; border-top: 2px solid rgba(240,247,241,0.1); margin: 2.5rem 0; }
        .prose-body code { color: ${SAGE}; background: rgba(133,171,139,0.12); padding: 2px 7px; font-size: 0.9em; border: 1px solid rgba(133,171,139,0.2); border-radius: 4px; }
        .prose-body pre { background: #0d1117 !important; border: 1.5px solid rgba(240,247,241,0.1); border-radius: 10px; padding: 20px 24px; overflow-x: auto; margin: 1.75rem 0; }
        .prose-body pre code { background: transparent !important; border: none !important; padding: 0 !important; font-size: 0.88rem; line-height: 1.7; color: inherit; }
        .prose-body blockquote { border-left: 3px solid ${SAGE}; margin: 1.5rem 0; padding: 0.5rem 0 0.5rem 1.25rem; color: rgba(240,247,241,0.6); font-style: italic; }
      `}</style>

      {/* Nav */}
      <header style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 50, background: BG }}>
        <nav style={{
          background: WHITE, border: BORDER,
          boxShadow: `4px 4px 0px ${INK}`, borderRadius: '999px',
          padding: '10px 12px 10px 20px',
          display: 'flex', alignItems: 'center', gap: 24,
          width: '100%', maxWidth: 780,
        }} className="blog-nav-pill">
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.03em', color: INK, textDecoration: 'none', marginRight: 'auto' }}>
            FocusWaqt
          </Link>
          <Link href="/blog" className="blog-link blog-nav-links" style={{ fontWeight: 600, fontSize: '0.87rem', color: INK, letterSpacing: '-0.01em' }}>
            Blog
          </Link>
          <Link href="/app" className="blog-cta-btn" style={{
            background: SAGE, border: BORDER, boxShadow: `3px 3px 0px ${INK}`,
            borderRadius: 10, padding: '8px 20px',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700, fontSize: '0.87rem', color: WHITE,
            textDecoration: 'none', letterSpacing: '-0.01em',
            transition: 'transform 0.07s ease, box-shadow 0.07s ease',
            display: 'inline-flex', alignItems: 'center',
          }}>
            Open App →
          </Link>
        </nav>
      </header>

      <article className="article-pad" style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 96px' }}>

        <Link href="/blog" className="blog-link" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgba(240,247,241,0.45)', fontSize: '0.88rem',
          fontWeight: 600, marginBottom: 48,
        }}>
          ← All posts
        </Link>

        {/* Post header */}
        <header style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <time style={{ color: MUTED, fontSize: '0.82rem', fontWeight: 600 }}>
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span style={{ color: MUTED, fontSize: '0.82rem' }}>·</span>
            <span style={{ color: MUTED, fontSize: '0.82rem', fontWeight: 600 }}>{post.readTime}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 1.0,
            color: '#F0F7F1', marginBottom: 20,
          }}>
            {post.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'rgba(240,247,241,0.6)', lineHeight: 1.6, fontWeight: 600, marginBottom: 0 }}>
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '0.7rem', padding: '3px 10px',
                  border: `1.5px solid rgba(240,247,241,0.2)`,
                  fontWeight: 700, color: SAGE,
                  letterSpacing: '0.02em', background: 'rgba(133,171,139,0.08)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div style={{ width: '100%', height: 2, background: 'rgba(240,247,241,0.1)', marginBottom: 48 }} />

        {/* Body */}
        <div className="prose-body">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode as never, { theme: 'github-dark' }]],
              },
            }}
          />
        </div>

        {/* Footer nav */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '2px solid rgba(240,247,241,0.1)' }}>
          <Link href="/blog" className="blog-link" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(240,247,241,0.45)', fontSize: '0.88rem', fontWeight: 600,
          }}>
            ← Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
