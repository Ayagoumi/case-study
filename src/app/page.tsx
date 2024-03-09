'use client';

import React from 'react';

import MLCTsList from '@/components/MLCTsList';
import Navbar from '@/components/Navbar';

const Home: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-col gap-4 container mx-auto p-4 h-full">
        <MLCTsList />
      </div>
    </main>
  );
};

export default Home;
