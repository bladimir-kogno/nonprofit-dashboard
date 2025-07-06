import '../styles/globals.css';
import { Inter } from 'next/font/google';
import TopNav from '../components/layout/TopNav';

const inter = Inter({ 
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
});

export const metadata = {
    title: 'My Nonprofit App',
    description: 'A comprehensive nonprofit management application',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
        <body className={`${inter.className} antialiased`}>
        <TopNav />
        <main className="max-w-screen-xl mx-auto px-4 py-6">{children}</main>
        </body>
        </html>
    );
}

