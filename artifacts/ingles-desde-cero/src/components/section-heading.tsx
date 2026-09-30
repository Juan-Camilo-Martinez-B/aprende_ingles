import { Check, CheckCircle2, Lock, Mic } from 'lucide-react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  complete: boolean;
  onComplete: () => void;
  dark?: boolean;
  locked?: boolean;
  lockReason?: string;
  onOpenPractice?: () => void;
  practiceButtonText?: string;
  progressCount?: { done: number; total: number; label: string };
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  complete,
  onComplete,
  dark = false,
  locked = false,
  lockReason,
  onOpenPractice,
  practiceButtonText,
  progressCount,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <div
          className={`mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] ${
            dark ? 'text-indigo-200' : 'text-indigo-600'
          }`}
        >
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl ${
              dark ? 'bg-white/15 text-white' : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            {icon}
          </span>
          {eyebrow}
        </div>
        <h2
          className={`display text-3xl font-extrabold tracking-tight sm:text-4xl ${
            dark ? 'text-white' : 'text-slate-800'
          }`}
          data-testid={`heading-${title}`}
        >
          {title}
        </h2>
        <p
          className={`mt-3 max-w-xl leading-7 ${
            dark ? 'text-indigo-100' : 'text-slate-500'
          }`}
        >
          {description}
        </p>

        {progressCount && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                progressCount.done >= progressCount.total
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
              }`}
            >
              {progressCount.done >= progressCount.total ? (
                <CheckCircle2 size={13} />
              ) : (
                <Lock size={13} />
              )}
              Voz: {progressCount.done} de {progressCount.total} {progressCount.label}
            </span>
            {locked && lockReason && (
              <span className={dark ? 'text-indigo-200' : 'text-slate-400'}>
                ({lockReason})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onOpenPractice && (
          <button
            type="button"
            onClick={onOpenPractice}
            className="pronunciation-open-btn"
            data-testid={`button-practice-${title}`}
          >
            <Mic size={15} />
            {practiceButtonText || 'Practicar pronunciación'}
          </button>
        )}

        <button
          type="button"
          onClick={locked ? onOpenPractice : onComplete}
          disabled={locked && !onOpenPractice}
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${
            complete
              ? dark
                ? 'bg-white/15 text-white'
                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : locked
                ? dark
                  ? 'border border-amber-300/40 bg-amber-400/20 text-amber-200 hover:bg-amber-400/30'
                  : 'border border-amber-200 bg-amber-50/80 text-amber-800 shadow-sm hover:bg-amber-100/70'
                : dark
                  ? 'border border-white/25 text-white hover:bg-white/10'
                  : 'border border-indigo-200 bg-white text-indigo-700 shadow-sm hover:bg-indigo-50'
          }`}
          data-testid={`button-complete-${title}`}
          aria-pressed={complete}
          title={locked ? lockReason || 'Pronuncia todos los elementos para avanzar' : undefined}
        >
          {complete ? (
            <CheckCircle2 size={16} />
          ) : locked ? (
            <Lock size={15} />
          ) : (
            <Check size={16} />
          )}
          {complete
            ? 'Lección completada'
            : locked
              ? 'Bloqueado: Pronuncia para avanzar'
              : 'Marcar como completada'}
        </button>
      </div>
    </div>
  );
}
