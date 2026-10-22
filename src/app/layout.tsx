import type { PropsWithChildren } from 'react';

import type { Metadata, Viewport } from 'next';

import { Archivo, Barlow_Condensed } from 'next/font/google';

import { isProduction, siteUrl } from '@/shared/config';

import './globals.css';
import { Providers } from './providers';

const sans = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
});

const title = 'Ceramic Tile Order Form';
const description =
  'Order handmade ceramic tiles from The Artisan Kiln and sketch your own pattern.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${title} | The Artisan Kiln`,
    template: '%s | The Artisan Kiln',
  },
  description,
  applicationName: 'The Artisan Kiln',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: isProduction,
    follow: isProduction,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: '#f8f5e3',
};

const MOBILE_DESIGN_WIDTH = 384;

const mobileZoomScript = `(function(){var r=document.documentElement;function u(){r.style.setProperty('--mobile-zoom',String(window.innerWidth/${MOBILE_DESIGN_WIDTH}))}u();window.addEventListener('resize',u)})();`;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: mobileZoomScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
