import Link from 'next/link';

const navLinks = [
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--mk-border-brass)] bg-[var(--mk-bg-warm)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
            <path d="M16 2L30 16L16 30L2 16Z" fill="none" stroke="var(--mk-brass)" strokeWidth="1" opacity="0.5" />
            <path d="M16 8L24 16L16 24L8 16Z" fill="var(--mk-brass)" opacity="0.15" />
            <circle cx="16" cy="16" r="2" fill="var(--mk-brass)" opacity="0.4" />
          </svg>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8" aria-label="Footer navigation">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-mk-body text-[var(--mk-text-muted)] hover:text-[var(--mk-text-primary)] transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex justify-center gap-6 mb-8">
          <span className="text-xs font-mk-body text-[var(--mk-text-muted)]">Social links coming soon</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          {legalLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-xs font-mk-body text-[var(--mk-text-muted)] hover:text-[var(--mk-text-body)] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-center text-xs font-mk-body text-[var(--mk-text-muted)]">
          &copy; {new Date().getFullYear()} Gamekaleido. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
