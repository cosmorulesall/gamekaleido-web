import { Navigation } from '@/components/marketing/Navigation';
import { Footer } from '@/components/marketing/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mk-page font-mk-body">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
