'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationBar() {
  const pathname = usePathname();
  const isExercise = pathname.startsWith('/exercise');

  if (isExercise) return null;

  const links = [
    { href: '/', label: '首页', icon: '🏠' },
    { href: '/stats', label: '统计', icon: '📊' },
    { href: '/settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/60 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around py-1.5">
        {links.map(link => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center px-8 py-1.5 relative"
            >
              {active && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--color-primary)] rounded-full" />
              )}
              <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>
                {link.icon}
              </span>
              <span className={`text-xs mt-0.5 font-medium transition-colors ${
                active ? 'text-[var(--color-primary)] font-semibold' : 'text-gray-400'
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
