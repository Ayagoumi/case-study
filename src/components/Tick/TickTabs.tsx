import type { TabsRef } from 'flowbite-react';
import { Tabs } from 'flowbite-react';
import React, { useRef } from 'react';

interface TickTabsProps {
  children: React.ReactNode;
  setActiveTab: (tab: number) => void;
}

const TickTabs: React.FC<TickTabsProps> = ({ children, setActiveTab }) => {
  const tabsRef = useRef<TabsRef>(null);

  return (
    <Tabs
      style="underline"
      ref={tabsRef}
      className="flex flex-1 gap-2 border-b-0 flex-nowrap"
      onActiveTabChange={(tab) => setActiveTab(tab)}
      theme={{
        tablist: {
          base: '!flex-none',
          tabitem: {
            base: 'flex items-center justify-center p-4 text-base font-bold first:ml-0 hover:!text-brand-primary/60 rounded-t-lg border-b-2 !text-brand-primary/40 w-[50%]',
            styles: {
              underline: {
                active: {
                  on: 'bg-brand-primary/20 rounded-md text-brand-primary border-b-0',
                  off: 'text-gray-500 border-b-2 border-transparent',
                },
              },
            },
          },
        },
        tabitemcontainer: {
          base: 'flex-1',
          styles: {
            underline: 'flex',
          },
        },
        tabpanel: 'flex-1 tabPanel',
      }}
    >
      {children}
    </Tabs>
  );
};

export default TickTabs;
