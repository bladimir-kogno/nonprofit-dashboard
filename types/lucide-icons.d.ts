import { FC, SVGProps } from 'react';

// Generic icon type used by lucide-react
export type LucideIcon = FC<SVGProps<SVGSVGElement>>;

declare module 'lucide-react' {
  import { LucideIcon } from '../types/lucide-icons';
  export const BarChart3: LucideIcon;
  export const Heart: LucideIcon;
  export const Users: LucideIcon;
  export const Calendar: LucideIcon;
  export const FileText: LucideIcon;
  export const Mail: LucideIcon;
  export const Contact: LucideIcon;
  export const Upload: LucideIcon;
  export const Search: LucideIcon;
  export const Phone: LucideIcon;
  export const Building: LucideIcon;
  export const User: LucideIcon;
  export const Download: LucideIcon;
  export const Trash2: LucideIcon;
  export const Plus: LucideIcon;
  export const Edit2: LucideIcon;
  export const Send: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Settings: LucideIcon;
  export const Eye: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Clock: LucideIcon;
  export const MapPin: LucideIcon;
}

// Firebase modular SDK re-export stubs (compiler picks real ones, but these silence editors)

declare module 'firebase/app' {
  export * from '@firebase/app';
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
}

// Next.js link/navigation fallbacks (for editors that mis-detect)

declare module 'next/link' {
  import { FC } from 'react';
  const Link: FC<any>;
  export default Link;
}

declare module 'next/navigation' {
  export const usePathname: () => string;
}