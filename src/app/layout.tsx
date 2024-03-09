import '@/styles/globals.css';

import type { Metadata } from 'next';
import React from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

import { ContextProvider } from '@/context';
import { ApolloWrapper } from '@/lib/apollo-wrapper';

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
          <SkeletonTheme baseColor="rgb(107 114 128)" highlightColor="rgb(156 163 175)">
            <ApolloWrapper>{children}</ApolloWrapper>
          </SkeletonTheme>
        </ContextProvider>
      </body>
    </html>
  );
}
