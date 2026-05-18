import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { Logo } from '@/components/Logo';

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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

      <article className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-white/35 hover:text-white/60 text-sm transition-colors mb-12"
        >
          ← All posts
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <time className="text-white/30 text-sm">
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span className="text-white/20">·</span>
            <span className="text-white/30 text-sm">{post.readTime}</span>
          </div>
          <h1
            className="font-normal text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.025em' }}
          >
            {post.title}
          </h1>
          <p className="text-white/45 text-lg leading-relaxed">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
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
        </header>

        <div className="prose prose-invert prose-green max-w-none
          prose-headings:font-normal prose-headings:text-white prose-headings:tracking-tight
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
          prose-p:text-white/65 prose-p:leading-relaxed prose-p:text-[1.0625rem]
          prose-strong:text-white prose-strong:font-semibold
          prose-a:text-[#85AB8B] prose-a:no-underline hover:prose-a:underline
          prose-li:text-white/65 prose-li:leading-relaxed
          prose-ol:text-white/65
          prose-hr:border-white/10
          prose-code:text-[#85AB8B] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        ">
          <MDXRemote source={post.content} />
        </div>

        <footer className="mt-16 pt-8 border-t border-white/8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/35 hover:text-white/60 text-sm transition-colors"
          >
            ← Back to all posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
