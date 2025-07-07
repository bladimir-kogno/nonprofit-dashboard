import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import TopNav from '../components/layout/TopNav';
import { Heart, User } from 'lucide-react';

const inter = Inter({ 
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
});

export const metadata = {
    title: 'Nonprofit Management System',
    description: 'A comprehensive nonprofit management application with email newsletter management, donor tracking, and volunteer coordination.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" className={inter.variable}>
                <body className={`${inter.className} antialiased`}>
                    <div className="min-h-screen bg-gray-50">
                        {/* Top Header */}
                        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between items-center py-4">
                                    <div className="flex items-center gap-3">
                                        {/* Logo */}
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">Nonprofit Management</h1>
                                            <p className="text-sm text-gray-500">Email & Newsletter System</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-gray-500 hidden md:block">
                                            {new Date().toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                            <User className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">Welcome!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col xl:flex-row gap-8">
                                <div className="xl:w-64 flex-shrink-0">
                                    <TopNav />
                                </div>
                                <div className="flex-1 min-w-0">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}

