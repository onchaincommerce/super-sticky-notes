import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { XMTPProvider } from './context/XMTPContext';
import { mainnet } from 'viem/chains';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Super Sticky Notes',
  description: 'Private sticky notes powered by XMTP',
  icons: {
    icon: '/sticky_note_logo.png',
    apple: '/sticky_note_logo.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/sticky_note_logo.png" />
      </head>
      <body className={`${inter.className} paper-texture`}>
        <OnchainKitProvider chain={mainnet}>
          <XMTPProvider>
            {children}
          </XMTPProvider>
        </OnchainKitProvider>
      </body>
    </html>
  );
}
