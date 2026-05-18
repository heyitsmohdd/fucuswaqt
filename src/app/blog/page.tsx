import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on deep work, focus, and building better habits.',
  alternates: { canonical: 'https://focuswaqt.space/blog' },
  openGraph: {
    title: 'Blog — FocusWaqt',
    description: 'Thoughts on deep work, focus, and building better habits.',
    url: 'https://focuswaqt.space/blog',
  },
};

const BG   = '#1A3328';
const INK  = '#0D2118';
const WHITE = '#FFFFFF';
const SAGE  = '#85AB8B';
const MUTED = '#7BA88A';
const BORDER = `2px solid ${INK}`;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#F0F7F1' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .blog-nav-link { transition: color 0.18s ease; text-decoration: none; }
        .blog-nav-link:hover { color: ${SAGE} !important; }
        .post-card { transition: transform 0.08s ease, box-shadow 0.08s ease; }
        .post-card:hover { transform: translateY(-2px); box-shadow: 7px 7px 0px ${INK} !important; }
        .post-card:hover .post-title { color: ${SAGE}; }
        .post-arrow { transition: transform 0.18s ease, color 0.18s ease; }
        .post-card:hover .post-arrow { transform: translateX(4px); color: ${SAGE} !important; }
        .blog-cta-btn:hover { transform: translateY(2px) !important; box-shadow: 1px 1px 0px ${INK} !important; }
        @media (max-width: 640px) {
          .blog-nav-links { display: none !important; }
          .blog-nav-pill { padding: 8px 10px 8px 16px !important; gap: 12px !important; }
          .post-card { padding: 20px 18px !important; }
        }
      `}</style>

      {/* Nav */}
      <header style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 50, background: BG }}>
        <nav style={{
          background: WHITE, border: BORDER,
          boxShadow: `4px 4px 0px ${INK}`,
          borderRadius: '999px',
          padding: '10px 12px 10px 20px',
          display: 'flex', alignItems: 'center', gap: 24,
          width: '100%', maxWidth: 780, color: INK,
        }} className="blog-nav-pill">
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.03em', color: INK, marginRight: 'auto' }}>
            FocusWaqt
          </span>
          <Link href="/" className="blog-nav-link blog-nav-links" style={{ fontWeight: 600, fontSize: '0.87rem', color: INK, letterSpacing: '-0.01em' }}>
            Home
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

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <p style={{
            fontWeight: 700, fontSize: '0.73rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: SAGE, marginBottom: 14,
          }}>
            Blog
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 0.95, color: '#F0F7F1',
          }}>
            Thoughts on focus
          </h1>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p style={{ color: 'rgba(240,247,241,0.4)', fontWeight: 600 }}>No posts yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="post-card"
                style={{
                  background: WHITE, border: BORDER,
                  boxShadow: `5px 5px 0px ${INK}`,
                  borderRadius: 0, padding: '28px 28px',
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: 20,
                  textDecoration: 'none', color: INK,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    <time style={{ color: MUTED, fontSize: '0.75rem', fontWeight: 600 }}>
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    <span style={{ color: MUTED, fontSize: '0.75rem' }}>·</span>
                    <span style={{ color: MUTED, fontSize: '0.75rem', fontWeight: 600 }}>{post.readTime}</span>
                  </div>
                  <h2 className="post-title" style={{
                    fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em',
                    lineHeight: 1.2, marginBottom: 8, color: INK,
                    transition: 'color 0.18s ease',
                  }}>
                    {post.title}
                  </h2>
                  <p style={{ color: MUTED, fontSize: '0.88rem', lineHeight: 1.55, fontWeight: 600 }}>
                    {post.description}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                      {post.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: '0.7rem', padding: '3px 10px',
                          border: `1.5px solid ${INK}`, fontWeight: 700,
                          background: '#E8F5EC', color: INK,
                          letterSpacing: '0.01em',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="post-arrow" style={{
                  color: MUTED, fontSize: '1.2rem', flexShrink: 0, marginTop: 2, fontWeight: 800,
                }}>
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: BORDER, borderTopColor: 'rgba(240,247,241,0.12)', padding: '24px 32px' }}>
        <div style={{
          maxWidth: 780, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontWeight: 600, fontSize: '0.83rem', color: 'rgba(240,247,241,0.4)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span>© {new Date().getFullYear()} FocusWaqt.</span>
          <Link href="/app" className="blog-nav-link" style={{ color: '#F0F7F1', fontWeight: 700, textDecoration: 'none' }}>
            Open App →
          </Link>
        </div>
      </footer>
    </div>
  );
}
