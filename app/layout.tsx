import '../styles/globals.css';
import { Inter } from 'next/font/google';
import SideNav from '../components/layout/TopNav';
import { Heart } from 'lucide-react';

const inter = Inter({ 
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
});

export const metadata = {
    title: 'Nonprofit Management System',
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
            <div className="min-h-screen bg-gray-50">
                {/* Top Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center gap-3">
                                {/* Logo placeholder */}
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Nonprofit Management System</h1>
                            </div>
                            <div className="text-sm text-gray-500">
                                Welcome back! Today is {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <SideNav />
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    );
}

