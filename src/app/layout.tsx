import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Lumen d'Or — Private Fragrance House",
  description: 'Private luxury fragrance house. Editions Le Cavalier and La Signature.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
