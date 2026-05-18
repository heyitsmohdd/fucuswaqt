import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Logo } from '@/components/Logo';

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

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0a0e0b] text-white">
      <nav className="border-b border-white/6 px-5 sm:px-8 md:px-12 py-4 flex items-center justify-between">
        <Logo />
        <Link
          href="/app"
          className="text-sm font-medium px-4 py-2 bg-[#336443] hover:bg-[#2d5a3b] rounded-full transition-colors"
        >
          Open App
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <p className="text-[#85AB8B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Blog</p>
          <h1
            className="font-normal text-white"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.025em' }}
          >
            Thoughts on focus
          </h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-white/40">No posts yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/6">
            {posts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group py-7 flex items-start justify-between gap-6 hover:opacity-75 transition-opacity"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <time className="text-white/30 text-xs">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-white/30 text-xs">{post.readTime}</span>
                  </div>
                  <h2 className="text-white font-medium text-base sm:text-lg leading-snug mb-2 group-hover:text-[#85AB8B] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed">{post.description}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3.5">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-[#85AB8B]/10 text-[#85AB8B] border border-[#85AB8B]/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-white/25 text-sm shrink-0 group-hover:text-[#85AB8B] group-hover:translate-x-0.5 transition-all duration-200 mt-0.5">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
