import { BookOpen, Menu } from 'lucide-react';
import { navItems } from '@/data/content';
import { progressPercent, type Progress } from '@/lib/progress';
import { cn } from '@/lib/utils';

type AppHeaderProps = {
  progress: Progress;
  activeSection: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

export function AppHeader({
  progress,
  activeSection,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
}: AppHeaderProps) {
  const percentage = progressPercent(progress.sections);

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl backdrop-saturate-150"
      data-testid="header-main"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <a href="#inicio" className="flex shrink-0 items-center gap-3" data-testid="link-brand">
          <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-300/40">
            <BookOpen size={21} />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </span>
          <span>
            <strong className="display block text-sm font-extrabold tracking-tight text-slate-800">
              Inglés desde cero
            </strong>
            <span className="text-[11px] font-medium text-slate-500">pasito a pasito</span>
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 rounded-full border border-indigo-100/80 bg-white/80 p-1 shadow-sm xl:flex" aria-label="Navegación principal">
          {navItems.map(([label, id]) => {
            const active = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={cn(
                  'nav-link rounded-full px-3 py-2 text-xs font-semibold transition',
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700',
                )}
                data-testid={`link-nav-${id}`}
                aria-current={active ? 'true' : undefined}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3" data-testid="status-global-progress">
            <div className="relative hidden h-11 w-11 sm:grid sm:place-items-center">
              <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(224 231 255)" strokeWidth="4" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="rgb(99 102 241)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 113} 113`}
                />
              </svg>
              <span className="absolute text-[10px] font-extrabold text-indigo-700">{percentage}%</span>
            </div>
            <div className="hidden text-right md:block">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tu avance</p>
              <p className="text-sm font-bold text-slate-700">
                {progress.sections.length}/5 lecciones
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl border border-indigo-100 bg-white p-2 text-slate-600 shadow-sm hover:bg-indigo-50 xl:hidden"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
            data-testid="button-toggle-menu"
          >
            <Menu size={21} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-indigo-50 bg-white/95 px-5 py-3 backdrop-blur xl:hidden"
          aria-label="Menú móvil"
        >
          {navItems.map(([label, id]) => {
            const active = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={onCloseMenu}
                className={cn(
                  'mb-1 block rounded-xl px-3 py-2.5 text-sm font-semibold last:mb-0',
                  active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50',
                )}
                data-testid={`link-mobile-${id}`}
              >
                {label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
