'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Heart, Users, Calendar, FileText, Mail, ContactRound } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/', icon: BarChart3 },
    { label: 'Donors', href: '/donors', icon: Heart },
    { label: 'Volunteers', href: '/volunteers', icon: Users },
    { label: 'Contacts', href: '/contacts', icon: ContactRound },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Email & Newsletter', href: '/emails', icon: Mail },
    { label: 'Reports', href: '/reports', icon: FileText },
];

export default function SideNav() {
    const pathname = usePathname();

    return (
        <div className="lg:w-64">
            <nav className="space-y-2">
                {navItems.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            pathname === href
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
