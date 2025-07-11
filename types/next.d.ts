declare module 'next/link' {
  import { FC } from 'react';
  interface LinkProps { href: string; className?: string; children?: React.ReactNode; [key: string]: any; }
  const Link: FC<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function usePathname(): string;
}