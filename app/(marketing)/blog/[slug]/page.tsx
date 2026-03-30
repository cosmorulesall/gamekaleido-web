import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { BrassDivider } from '@/components/marketing/BrassDivider';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.frontmatter.title} — Gamekaleido Blog`,
    description: post.frontmatter.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  return (
    <article className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-mk-body text-[var(--mk-brass)] hover:text-[var(--mk-brass-dark)] transition-colors mb-8"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M10.78 3.22a.75.75 0 01.03 1.06L7.28 8l3.53 3.72a.75.75 0 01-1.06 1.06l-4-4.25a.75.75 0 010-1.06l4-4.25a.75.75 0 011.03.03z" />
          </svg>
          Back to Blog
        </Link>
        <header className="mb-12">
          <time className="text-sm font-mk-body text-[var(--mk-text-muted)]">
            {new Date(post.frontmatter.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="font-mk-display text-[clamp(2rem,5vw,3.5rem)] font-bold mk-letterpress mt-2">
            {post.frontmatter.title}
          </h1>
        </header>
        <BrassDivider className="mb-12" />
        <div className="font-mk-body text-[var(--mk-text-body)] leading-relaxed space-y-6 [&_h2]:font-mk-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--mk-text-primary)] [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-mk-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--mk-text-primary)] [&_h3]:mt-8 [&_h3]:mb-3 [&_a]:text-[var(--mk-brass)] [&_a]:underline [&_strong]:text-[var(--mk-text-primary)] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
