import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags?: string[];
  content: string;
}

export interface BlogPostMeta extends Omit<BlogPost, 'content'> {}

function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? '',
        description: data.description ?? '',
        date: data.date ?? '',
        readTime: calculateReadTime(content),
        tags: data.tags ?? [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    readTime: calculateReadTime(content),
    tags: data.tags ?? [],
    content,
  };
}
