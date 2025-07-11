import { FC, SVGProps } from 'react';

type LucideIcon = FC<SVGProps<SVGSVGElement>>;

declare module 'lucide-react' {
  export const Upload: LucideIcon;
  export const Search: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const Building: LucideIcon;
  export const User: LucideIcon;
  export const Download: LucideIcon;
  export const Trash2: LucideIcon;
  export const Plus: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Heart: LucideIcon;
  export const Users: LucideIcon;
  export const Calendar: LucideIcon;
  export const FileText: LucideIcon;
  export const Contact: LucideIcon;
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
  export const Bold: LucideIcon;
  export const Italic: LucideIcon;
  export const List: LucideIcon;
  export const ListOrdered: LucideIcon;
  export const Link: LucideIcon;
  export const Quote: LucideIcon;
  export const Undo: LucideIcon;
  export const Redo: LucideIcon;
  export const Code: LucideIcon;
  export const EyeOff: LucideIcon;
  export const X: LucideIcon;
  // fallback default export
  const Lucide: Record<string, LucideIcon>;
  export default Lucide;
}