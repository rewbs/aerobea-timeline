import  Metadata  from 'next';
import './globals.css';

import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Fictional Presidential Timelines',
  description: 'Explore the leadership histories of Aerobea, Nitopia, and beyond.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
