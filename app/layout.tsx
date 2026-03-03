import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Zakat Calculator | Precise & Elegant',
  description: 'A precise and elegant Zakat calculator to help you fulfill your Islamic obligations.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-emerald-50/30 text-emerald-950 min-h-screen antialiased selection:bg-emerald-200 selection:text-emerald-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
