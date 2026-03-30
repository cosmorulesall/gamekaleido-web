import type { Metadata } from 'next';
import Link from 'next/link';
import { PaperCard } from '@/components/marketing/PaperCard';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Gamekaleido',
  description: 'Gift guides, behind-the-scenes stories, and game night tips from Gamekaleido.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-mk-display text-[clamp(2rem,5vw,3.5rem)] font-bold mk-letterpress text-center mb-4">
          Blog
        </h1>
        <p className="font-mk-body text-center text-[var(--mk-text-muted)] mb-16">
          Stories, guides, and updates from Gamekaleido.
        </p>
        {posts.length === 0 ? (
          <p className="font-mk-body text-center text-[var(--mk-text-muted)] italic">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <PaperCard className="p-6 group-hover:border-[var(--mk-brass)]">
                  <time className="text-xs font-mk-body text-[var(--mk-text-muted)]">
                    {new Date(post.date).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="font-mk-display text-xl font-semibold text-[var(--mk-text-primary)] mt-1 mb-2">
                    {post.title}
                  </h2>
                  <p className="font-mk-body text-sm text-[var(--mk-text-body)] leading-relaxed">
                    {post.excerpt}
                  </p>
                </PaperCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
