import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from './blog';

describe('blog utilities', () => {
  it('getAllPosts returns an array', () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });
  it('getAllPosts returns posts with required frontmatter fields', () => {
    const posts = getAllPosts();
    if (posts.length === 0) return;
    const post = posts[0];
    expect(post).toHaveProperty('slug');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('date');
    expect(post).toHaveProperty('excerpt');
  });
  it('getAllPosts sorts by date descending', () => {
    const posts = getAllPosts();
    if (posts.length < 2) return;
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      );
    }
  });
  it('getPostBySlug returns content for existing slug', () => {
    const result = getPostBySlug('hello-world');
    expect(result).not.toBeNull();
    expect(result!.frontmatter.title).toBe('Welcome to Gamekaleido');
    expect(result!.content).toContain('Personalised Board Games');
  });
  it('getPostBySlug returns null for missing slug', () => {
    expect(getPostBySlug('does-not-exist')).toBeNull();
  });
});
