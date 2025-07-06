import '../styles/globals.css';
import { Inter } from 'next/font/google';
import TopNav from '../components/layout/TopNav';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <TopNav />
        <main className="max-w-screen-xl mx-auto px-4 py-6">{children}</main>
        </body>
        </html>
    );
}

