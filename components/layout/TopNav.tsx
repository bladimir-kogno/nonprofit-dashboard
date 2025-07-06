'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Donors', href: '/donors' },
    { label: 'Volunteers', href: '/volunteers' },
    { label: 'Events', href: '/events' },
    { label: 'Reports', href: '/reports' },
];

export default function TopNav() {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b shadow-sm px-6 py-3 flex gap-6 text-sm font-medium">
            {navItems.map(({ label, href }) => (
                <Link
                    key={href}
                    href={href}
                    className={`py-1 hover:text-blue-600 ${
                        pathname === href ? 'text-blue-600' : 'text-gray-800'
                    }`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}
