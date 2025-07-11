'use client';

import { useState, useEffect } from 'react';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseClient } from '@/lib/firebase-client';
import { Heart, Lock, User as UserIcon, Key, LogOut } from 'lucide-react';

interface FirebaseAuthGuardProps {
    children: React.ReactNode;
}

export default function FirebaseAuthGuard({ children }: FirebaseAuthGuardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        try {
            const { auth } = getFirebaseClient();
            
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('Firebase Auth initialization failed:', error);
            setLoading(false);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError('');

        try {
            const { auth } = getFirebaseClient();
            await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            setCredentials({ email: '', password: '' });
        } catch (error: any) {
            console.error('Login failed:', error);
            let errorMessage = 'Login failed. Please check your credentials.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { auth } = getFirebaseClient();
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-24 mx-auto"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Initializing authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
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
                            Secure Firebase Authentication
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
                                    Email Address
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="admin@riseforhope.org"
                                        required
                                        disabled={isLoggingIn}
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
                                        disabled={isLoggingIn}
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
                                Secured by Firebase Authentication
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* User info and logout button */}
            <div className="fixed top-20 sm:top-4 right-4 z-50 flex items-center gap-3">
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 hidden sm:flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
            {children}
        </div>
    );
}