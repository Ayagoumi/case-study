'use client';

import React from 'react';

import MLCTsList from '@/components/MLCTsList';
import Navbar from '@/components/Navbar';

const Home: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col">
      <Navbar />
      <MLCTsList />
    </main>
  );
};

export default Home;
