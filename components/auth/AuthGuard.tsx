'use client';

import { useState, useEffect } from 'react';
import { Heart, Lock, User, Key } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Organization-specific credentials (in production, use environment variables)
    const VALID_CREDENTIALS = {
        username: 'riseforhope@admin',
        password: 'RiseForHope2024!'
    };

    useEffect(() => {
        // Check if user is already authenticated
        const authStatus = localStorage.getItem('nonprofit-auth');
        if (authStatus === 'authenticated') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError('');

        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (credentials.username === VALID_CREDENTIALS.username && 
            credentials.password === VALID_CREDENTIALS.password) {
            setIsAuthenticated(true);
            localStorage.setItem('nonprofit-auth', 'authenticated');
            setCredentials({ username: '', password: '' });
        } else {
            setError('Invalid credentials. Please contact your administrator.');
        }
        setIsLoggingIn(false);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('nonprofit-auth');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-6">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Rise for Hope
                        </h2>
                        <p className="text-lg text-gray-600 mb-2">
                            Nonprofit Management System
                        </p>
                        <p className="text-sm text-gray-500">
                            Organization Access Required
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                        <div className="flex items-center justify-center mb-6">
                            <Lock className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-center text-gray-900 mb-6">
                            Sign in to your account
                        </h3>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoggingIn ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                For access, contact your organization administrator
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Logout button - positioned to avoid header overlap on mobile */}
            <div className="fixed top-20 sm:top-4 right-4 z-50">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors shadow-lg"
                >
                    Logout
                </button>
            </div>
            {children}
        </div>
    );
}