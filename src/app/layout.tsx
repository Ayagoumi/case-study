import '@/styles/globals.css';

import type { Metadata } from 'next';
import React from 'react';

import { ContextProvider } from '@/context';

export const metadata: Metadata = {
  title: 'MetaStreet | Frontend Challenge',
  description: 'MetaStreet | Frontend Challenge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <link rel="icon" href="/favicon.ico" />
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}