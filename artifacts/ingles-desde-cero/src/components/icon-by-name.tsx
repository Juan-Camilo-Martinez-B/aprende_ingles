import {
  BookOpen,
  Check,
  CheckCircle2,
  MessageCircle,
  Palette,
  Sparkles,
  Zap,
} from 'lucide-react';

const icons: Record<string, typeof MessageCircle> = {
  MessageCircle,
  Sun: Zap,
  Sunrise: Zap,
  Hand: Check,
  Heart: CheckCircle2,
  Circle: Palette,
  Droplets: Zap,
  Leaf: Sparkles,
  CalendarDays: BookOpen,
  CalendarCheck: CheckCircle2,
  Snowflake: Sparkles,
  BookOpen,
  Armchair: BookOpen,
  Smartphone: MessageCircle,
  PanelsTopLeft: BookOpen,
};

export function IconByName({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
