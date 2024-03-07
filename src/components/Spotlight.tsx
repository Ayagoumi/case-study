'use client';

import React, { useEffect, useRef, useState } from 'react';

import MousePosition from '../utils/mouse-position';

type SpotlightProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Spotlight({ children, className = '' }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [boxes, setBoxes] = useState<Array<HTMLElement>>([]);

  const initContainer = () => {
    if (containerRef.current) {
      containerSize.current.w = containerRef.current.offsetWidth;
      containerSize.current.h = containerRef.current.offsetHeight;
    }
  };

  const onMouseMove = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const { w, h } = containerSize.current;
      if (mousePosition.x === null || mousePosition.y === null) return;
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;
      const inside = x < w && x > 0 && y < h && y > 0;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
        boxes.forEach((box) => {
          const boxX = -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
          const boxY = -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
          box.style.setProperty('--mouse-x', `${boxX}px`);
          box.style.setProperty('--mouse-y', `${boxY}px`);
        });
      }
    }
  };

  useEffect(() => {
    if (containerRef.current)
      setBoxes(Array.from(containerRef.current.children).map((el) => el as HTMLElement)); // eslint-disable-line
  }, [containerRef.current?.children.length]);

  useEffect(() => {
    initContainer();
    window.addEventListener('resize', initContainer);

    return () => {
      window.removeEventListener('resize', initContainer);
    };
  }, [setBoxes, containerRef.current?.offsetHeight, containerRef.current?.offsetWidth]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition]);

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
}

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function SpotlightCard({ children, className = '', onClick }: SpotlightCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative h-full w-[285px] border border-brand-primary/20 rounded-md cursor-pointer 
      before:absolute before:w-40 before:h-40 before:-left-20 before:-top-20 before:bg-brand-primary/60 before:rounded-full
      before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)]
      before:translate-y-[var(--mouse-y)] before:group-hover:opacity-100 before:z-10 before:blur-[100px] after:absolute
      after:w-50 after:h-50 after:-left-25 after:-top-25 after:bg-indigo-500 after:rounded-full after:opacity-0
      after:pointer-events-none after:transition-opacity after:duration-500 after:translate-x-[var(--mouse-x)]
      after:translate-y-[var(--mouse-y)] after:hover:opacity-10 after:z-30 after:blur-[100px]
      hover:scale-[103%] transform-gpu transform transition-transform duration-500 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
