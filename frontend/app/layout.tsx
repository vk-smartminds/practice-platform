// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/shared/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShivArth  ',
  description: 'An interactive learning platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[] text-[#693b94]`}>
        <AuthProvider>
          <Header />
          <main className="mx-auto p-4 md:p-8 bg-white/50 rounded-lg shadow-sm my-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}