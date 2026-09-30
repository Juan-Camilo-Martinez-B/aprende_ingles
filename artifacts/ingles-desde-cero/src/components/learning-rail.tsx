import { CheckCircle2 } from 'lucide-react';
import { lessonMeta } from '@/data/content';
import { cn } from '@/lib/utils';

type LearningRailProps = {
  completed: Set<string>;
  activeSection: string;
};

export function LearningRail({ completed, activeSection }: LearningRailProps) {
  return (
    <aside
      className="hidden w-52 shrink-0 xl:block"
      aria-label="Ruta de aprendizaje"
    >
      <div className="sticky top-28 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-lg shadow-indigo-100/50 backdrop-blur">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Tu ruta
        </p>
        <ol className="mt-4 space-y-1">
          {lessonMeta.map(({ id, label, step }, index) => {
            const done = completed.has(id);
            const active = activeSection === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
                    active && 'bg-indigo-600 text-white shadow-md shadow-indigo-200',
                    !active && done && 'text-emerald-700 hover:bg-emerald-50',
                    !active && !done && 'text-slate-600 hover:bg-indigo-50',
                  )}
                >
                  <span
                    className={cn(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-extrabold',
                      active && 'bg-white/20 text-white',
                      !active && done && 'bg-emerald-100 text-emerald-700',
                      !active && !done && 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {done ? <CheckCircle2 size={16} /> : step}
                  </span>
                  <span className="min-w-0 truncate">{label}</span>
                </a>
                {index < lessonMeta.length - 1 && (
                  <div className="ml-7 h-2 border-l border-dashed border-indigo-100" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
