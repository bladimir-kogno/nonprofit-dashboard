// app/layout.tsx

import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import TopNav from '../components/layout/TopNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Nonprofit Dashboard',
    description: 'Internal management for nonprofit organization',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <TopNav />
        <div className="max-w-screen-xl mx-auto px-4 py-6">
            {children}
        </div>
        </body>
        </html>
    );
}

