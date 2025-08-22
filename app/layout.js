import './globals.css';

export const metadata = {
  title: 'Aerobea Presidential Timeline',
  description: 'Timeline of Aerobea Presidents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
