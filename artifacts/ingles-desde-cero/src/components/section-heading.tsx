import { Check, CheckCircle2 } from 'lucide-react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  complete: boolean;
  onComplete: () => void;
  dark?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  complete,
  onComplete,
  dark = false,
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
      </div>
      <button
        type="button"
        onClick={onComplete}
        className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${
          complete
            ? dark
              ? 'bg-white/15 text-white'
              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            : dark
              ? 'border border-white/25 text-white hover:bg-white/10'
              : 'border border-indigo-200 bg-white text-indigo-700 shadow-sm hover:bg-indigo-50'
        }`}
        data-testid={`button-complete-${title}`}
        aria-pressed={complete}
      >
        {complete ? <CheckCircle2 size={16} /> : <Check size={16} />}
        {complete ? 'Lección completada' : 'Marcar como completada'}
      </button>
    </div>
  );
}
