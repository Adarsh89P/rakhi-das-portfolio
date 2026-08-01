import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';

import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Rakhi Das | UI/UX Designer',
  description:
    'Portfolio of Rakhi Das, a UI/UX Designer based in Kolkata, India specializing in usability testing, heuristic evaluation, and intuitive product design.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
