import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Headphones,
  Lightbulb,
  LockKeyhole,
  Menu,
  MessageCircle,
  Palette,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const STORAGE_KEY = 'ingles-desde-cero-progress';

type Progress = { sections: string[]; quizBest: number };
const defaultProgress: Progress = { sections: [], quizBest: 0 };

const alphabet = [
  ['A', 'apple', 'éi'], ['B', 'ball', 'bí'], ['C', 'cat', 'sí'], ['D', 'dog', 'dí'], ['E', 'egg', 'í'],
  ['F', 'fish', 'ef'], ['G', 'go', 'yí'], ['H', 'house', 'éich'], ['I', 'ice', 'ái'], ['J', 'juice', 'yéi'],
  ['K', 'kite', 'kéi'], ['L', 'lion', 'el'], ['M', 'moon', 'em'], ['N', 'name', 'en'], ['O', 'orange', 'óu'],
  ['P', 'pen', 'pí'], ['Q', 'queen', 'kiú'], ['R', 'red', 'ar'], ['S', 'sun', 'es'], ['T', 'tree', 'tí'],
  ['U', 'umbrella', 'iú'], ['V', 'voice', 'ví'], ['W', 'water', 'dábol iú'], ['X', 'x-ray', 'eks réi'], ['Y', 'yellow', 'uái'], ['Z', 'zoo', 'zí'],
];

const numbers = [
  [1, 'one', 'uno'], [2, 'two', 'dos'], [3, 'three', 'tres'], [4, 'four', 'cuatro'], [5, 'five', 'cinco'],
  [6, 'six', 'seis'], [7, 'seven', 'siete'], [8, 'eight', 'ocho'], [9, 'nine', 'nueve'], [10, 'ten', 'diez'],
  [11, 'eleven', 'once'], [12, 'twelve', 'doce'], [13, 'thirteen', 'trece'], [14, 'fourteen', 'catorce'], [15, 'fifteen', 'quince'],
  [16, 'sixteen', 'dieciséis'], [17, 'seventeen', 'diecisiete'], [18, 'eighteen', 'dieciocho'], [19, 'nineteen', 'diecinueve'], [20, 'twenty', 'veinte'],
  [30, 'thirty', 'treinta'], [40, 'forty', 'cuarenta'], [50, 'fifty', 'cincuenta'], [60, 'sixty', 'sesenta'], [70, 'seventy', 'setenta'],
  [80, 'eighty', 'ochenta'], [90, 'ninety', 'noventa'], [100, 'one hundred', 'cien'],
];

const vocabulary = {
  'Saludos': [
    ['Hello', 'Hola', 'MessageCircle'], ['Good morning', 'Buenos días', 'Sunrise'], ['Goodbye', 'Adiós', 'Hand'], ['Thank you', 'Gracias', 'Heart'],
  ],
  'Colores': [
    ['Red', 'Rojo', 'Circle'], ['Blue', 'Azul', 'Droplets'], ['Yellow', 'Amarillo', 'Sun'], ['Green', 'Verde', 'Leaf'],
  ],
  'Días y meses': [
    ['Sunday', 'Domingo', 'Sun'], ['Monday', 'Lunes', 'CalendarDays'], ['Tuesday', 'Martes', 'CalendarDays'],
    ['Wednesday', 'Miércoles', 'CalendarDays'], ['Thursday', 'Jueves', 'CalendarDays'], ['Friday', 'Viernes', 'CalendarCheck'],
    ['Saturday', 'Sábado', 'CalendarDays'], ['January', 'Enero', 'Snowflake'], ['February', 'Febrero', 'Snowflake'],
    ['March', 'Marzo', 'Sun'], ['April', 'Abril', 'Sun'], ['May', 'Mayo', 'Sun'], ['June', 'Junio', 'Sun'],
    ['July', 'Julio', 'Sun'], ['August', 'Agosto', 'Sun'], ['September', 'Septiembre', 'Sun'],
    ['October', 'Octubre', 'Sun'], ['November', 'Noviembre', 'Snowflake'], ['December', 'Diciembre', 'Snowflake'],
  ],
  'Objetos comunes': [
    ['Book', 'Libro', 'BookOpen'], ['Chair', 'Silla', 'Armchair'], ['Phone', 'Teléfono', 'Smartphone'], ['Window', 'Ventana', 'PanelsTopLeft'],
  ],
} as const;

const quizQuestions = [
  { subject: 'Abecedario', prompt: '¿Cuál es la pronunciación aproximada de la letra “J”?', options: ['yéi', 'jota', 'jí', 'ja'], answer: 'yéi', kind: 'choice' },
  { subject: 'Números', prompt: '¿Cómo se dice “quince” en inglés?', options: ['fifty', 'fifteen', 'fourteen', 'five'], answer: 'fifteen', kind: 'choice' },
  { subject: 'Vocabulario', prompt: '“Good morning” significa…', options: ['Buenas noches', 'Buenos días', 'Adiós', 'Gracias'], answer: 'Buenos días', kind: 'choice' },
  { subject: 'Verbo To Be', prompt: 'Completa: “They ___ happy.”', options: ['am', 'is', 'are', 'be'], answer: 'are', kind: 'choice' },
  { subject: 'Abecedario', prompt: 'Escribe la palabra en inglés para “gato”.', answer: 'cat', kind: 'fill' },
  { subject: 'Números', prompt: 'Escribe el número en inglés: 8.', answer: 'eight', kind: 'fill' },
  { subject: 'Vocabulario', prompt: 'Escribe la traducción de “blue”.', answer: 'azul', kind: 'fill' },
  { subject: 'Verbo To Be', prompt: 'Completa: “I ___ a student.”', answer: 'am', kind: 'fill' },
  { subject: 'Verbo To Be', prompt: 'Completa: “She ___ my friend.”', answer: 'is', kind: 'fill' },
];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
  return true;
}

function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  } catch { return defaultProgress; }
}

function IconByName({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, typeof MessageCircle> = { MessageCircle, Sun: Zap, Sunrise: Zap, Hand: Check, Heart: CheckCircle2, Circle: Palette, Droplets: Zap, Leaf: Sparkles, CalendarDays: BookOpen, CalendarCheck: CheckCircle2, Snowflake: Sparkles, BookOpen, Armchair: BookOpen, Smartphone: MessageCircle, PanelsTopLeft: BookOpen };
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

function AppProgress({ progress }: { progress: Progress }) {
  const percentage = Math.round((progress.sections.length / 5) * 100);
  return (
    <div className="flex items-center gap-3" data-testid="status-global-progress">
      <div className="hidden text-right sm:block">
        <p className="text-xs font-semibold text-slate-500">Tu avance</p>
        <p className="text-sm font-bold text-indigo-700">{percentage}% completado</p>
      </div>
      <div className="h-2 w-20 overflow-hidden rounded-full bg-indigo-100" aria-label={`${percentage}% completado`}>
        <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function Home() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof vocabulary>('Saludos');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }, [progress]);

  const markComplete = (id: string) => setProgress((current) => current.sections.includes(id) ? current : { ...current, sections: [...current.sections, id] });
  const completeCount = progress.sections.length;
  const currentQuestion = quizQuestions[quizIndex];
  const quizFinished = quizIndex >= quizQuestions.length;
  const startQuiz = () => { setQuizStarted(true); setQuizIndex(0); setQuizScore(0); setQuizAnswer(''); setQuizResult(null); };
  const checkAnswer = () => {
    if (!quizAnswer.trim() || quizResult) return;
    const valid = quizAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    setQuizResult(valid ? 'correct' : 'incorrect');
    if (valid) setQuizScore((score) => score + 1);
  };
  const nextQuestion = () => {
    setQuizIndex((index) => index + 1);
    setQuizAnswer('');
    setQuizResult(null);
  };
  useEffect(() => {
    if (quizFinished && quizScore > progress.quizBest) {
      setProgress((current) => ({ ...current, quizBest: quizScore }));
    }
  }, [quizFinished, quizScore, progress.quizBest]);

  const navItems = [
    ['Inicio', 'inicio'], ['Abecedario', 'abecedario'], ['Números', 'numeros'], ['Vocabulario', 'vocabulario'], ['Verbo To Be', 'to-be'], ['Práctica', 'practica'],
  ];
  const completionLabels = ['abecedario', 'numeros', 'vocabulario', 'to-be', 'practica'];
  const completedSubjects = useMemo(() => new Set(progress.sections), [progress.sections]);
  const alphabetComplete = completedSubjects.has('abecedario');

  return (
    <div className="app-shell gradient-wash">
      <header className="sticky top-0 z-40 border-b border-indigo-100/80 bg-white/90 backdrop-blur-md" data-testid="header-main">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><BookOpen size={21} /></span>
            <span><strong className="display block text-sm font-extrabold tracking-tight text-slate-800">Inglés desde cero</strong><span className="text-[11px] text-slate-500">pasito a pasito</span></span>
          </a>
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navegación principal">
            {navItems.map(([label, id]) => <a key={id} href={`#${id}`} className="nav-link rounded-full px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700" data-testid={`link-nav-${id}`}>{label}</a>)}
          </nav>
          <div className="flex items-center gap-4"><AppProgress progress={progress} /><button type="button" className="rounded-xl p-2 text-slate-600 hover:bg-indigo-50 xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" data-testid="button-toggle-menu"><Menu size={21} /></button></div>
        </div>
        {menuOpen && <nav className="border-t border-indigo-50 bg-white px-5 py-3 xl:hidden" aria-label="Menú móvil">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50" data-testid={`link-mobile-${id}`}>{label}</a>)}</nav>}
      </header>

      <main>
        <section id="inicio" className="mx-auto max-w-7xl px-5 pb-12 pt-12 lg:px-8 lg:pb-20 lg:pt-20" data-testid="section-inicio">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div className="fade-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/75 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm"><Sparkles size={15} /> Aprende sin miedo, empieza hoy</div>
              <h1 className="display max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">Tu primer paso para hablar <span className="text-indigo-600">inglés.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Un espacio amable para construir confianza desde cero. Escucha, repite y celebra cada palabra nueva.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href="#abecedario" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700" data-testid="button-start-learning">Empezar a aprender <ArrowRight size={17} /></a><a href="#practica" className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white/70 px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-white" data-testid="button-go-practice"><Zap size={17} /> Ir a práctica</a></div>
              <div className="mt-8 flex items-center gap-3 text-sm text-slate-500"><div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-sky-200 text-xs font-bold text-sky-700">A</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-violet-200 text-xs font-bold text-violet-700">M</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-amber-200 text-xs font-bold text-amber-700">L</span></div><span>Pequeños pasos, grandes logros.</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
              <div className="absolute -right-5 top-4 h-24 w-24 rounded-full bg-violet-200/70 blur-2xl" /><div className="absolute -bottom-5 left-4 h-28 w-28 rounded-full bg-sky-200/70 blur-2xl" />
              <div className="soft-card relative overflow-hidden bg-white/85 p-7">
                <div className="mb-7 flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Headphones size={24} /></span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Día 1</span></div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Tu ruta de hoy</p><h2 className="display mt-2 text-2xl font-extrabold text-slate-800">Conoce el abecedario</h2><p className="mt-2 text-sm leading-6 text-slate-500">Aprende las 26 letras y practica sus sonidos.</p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-indigo-100"><div className={`h-full rounded-full bg-indigo-500 transition-all ${alphabetComplete ? 'w-full' : 'w-0'}`} /></div><div className="mt-2 flex justify-between text-xs font-semibold text-slate-400"><span>{alphabetComplete ? 'Lección completada' : '26 letras listas para explorar'}</span><span>{alphabetComplete ? '100%' : '0%'}</span></div>
                <a href="#abecedario" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white hover:bg-indigo-700" data-testid="button-continue-lesson">Continuar lección <ArrowRight size={16} /></a>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[['01', 'Escucha', 'Oye el sonido en inglés'], ['02', 'Repite', 'Practica a tu ritmo'], ['03', 'Avanza', 'Guarda tus logros']].map(([num, title, copy]) => <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-4" key={num} data-testid={`card-step-${num}`}><span className="display text-2xl font-extrabold text-indigo-200">{num}</span><span><strong className="block text-sm text-slate-700">{title}</strong><span className="text-xs text-slate-500">{copy}</span></span></div>)}
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="h-px bg-indigo-100" /></div>

        <section id="abecedario" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14 lg:px-8 lg:py-20" data-testid="section-abecedario">
          <SectionHeading eyebrow="Lección 01 · Sonidos" title="El abecedario" description="26 letras para abrir la puerta del inglés. Pulsa el altavoz, escucha y repite en voz alta." icon={<BookOpen size={22} />} complete={completedSubjects.has('abecedario')} onComplete={() => markComplete('abecedario')} />
          <div className="lesson-grid mt-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {alphabet.map(([letter, word, hint]) => <button type="button" onClick={() => speak(`${letter}. ${word}`)} key={letter} className="group soft-card flex min-h-[135px] flex-col items-center justify-center p-4 text-center transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100" data-testid={`card-letter-${letter}`} aria-label={`Escuchar letra ${letter}`}>
              <span className="display text-4xl font-extrabold text-indigo-600">{letter}</span><span className="mt-1 text-sm font-bold text-slate-700">{word}</span><span className="mt-1 text-xs text-slate-400">/ {hint} /</span><span className="mt-2 grid h-7 w-7 place-items-center rounded-full bg-indigo-50 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white"><Volume2 size={14} /></span>
            </button>)}
          </div>
        </section>

        <section id="numeros" className="scroll-mt-20 bg-white/65 py-14 lg:py-20" data-testid="section-numeros">
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionHeading eyebrow="Lección 02 · Cantidades" title="Los números" description="Cuenta del 1 al 20 y descubre cómo formar las decenas. Cada número tiene su propio ritmo." icon={<Zap size={22} />} complete={completedSubjects.has('numeros')} onComplete={() => markComplete('numeros')} />
            <div className="mt-8 grid gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">{numbers.map(([number, english, spanish]) => <button type="button" key={number} onClick={() => speak(String(english))} className="group rounded-2xl border border-indigo-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md" data-testid={`card-number-${number}`} aria-label={`Escuchar número ${number}`}><div className="flex items-center justify-between"><span className="display text-2xl font-extrabold text-slate-800">{number}</span><Volume2 size={15} className="text-indigo-400 group-hover:text-indigo-600" /></div><p className="mt-2 text-sm font-bold text-indigo-600">{english}</p><p className="text-xs text-slate-500">{spanish}</p></button>)}</div>
            <div className="mt-8 flex gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-sm text-violet-800"><Lightbulb size={20} className="mt-0.5 shrink-0" /><p><strong>Tip rápido:</strong> del 13 al 19, muchas palabras terminan en <strong>-teen</strong>. Escucha la diferencia entre <em>thirteen</em> y <em>thirty</em>.</p></div>
          </div>
        </section>

        <section id="vocabulario" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14 lg:px-8 lg:py-20" data-testid="section-vocabulario">
          <SectionHeading eyebrow="Lección 03 · Palabras útiles" title="Vocabulario de cada día" description="Palabras pequeñas que puedes usar desde el primer día. Elige un tema para explorar." icon={<MessageCircle size={22} />} complete={completedSubjects.has('vocabulario')} onComplete={() => markComplete('vocabulario')} />
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorías de vocabulario">{Object.keys(vocabulary).map((category) => <button type="button" role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category as keyof typeof vocabulary)} key={category} className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${activeCategory === category ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white text-slate-600 hover:bg-indigo-50'}`} data-testid={`tab-category-${category}`}>{category}</button>)}</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{vocabulary[activeCategory].map(([english, spanish, icon], index) => <button type="button" key={english} onClick={() => speak(english)} className="soft-card group flex items-center gap-4 p-5 text-left transition hover:-translate-y-1 hover:border-indigo-200" data-testid={`card-vocabulary-${activeCategory}-${index}`}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"><IconByName name={icon} size={22} /></span><span className="min-w-0 flex-1"><strong className="block text-base text-slate-800">{english}</strong><span className="text-sm text-slate-500">{spanish}</span></span><Volume2 size={17} className="text-indigo-300 group-hover:text-indigo-600" /></button>)}</div>
        </section>

        <section id="to-be" className="scroll-mt-20 bg-indigo-700 py-14 text-white lg:py-20" data-testid="section-to-be">
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionHeading dark eyebrow="Lección 04 · Gramática esencial" title="El verbo To Be" description="En presente, to be significa ser o estar. Su forma cambia según la persona." icon={<CircleHelp size={22} />} complete={completedSubjects.has('to-be')} onComplete={() => markComplete('to-be')} />
            <div className="mt-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
              <div className="rounded-3xl bg-white p-6 text-slate-800 shadow-xl shadow-indigo-950/10"><div className="mb-5 flex items-center justify-between"><h3 className="display text-xl font-extrabold">Pronombres y formas</h3><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">Presente</span></div><div className="overflow-x-auto rounded-2xl border border-indigo-100"><table className="w-full text-left text-sm"><thead className="bg-indigo-50 text-xs uppercase tracking-wide text-indigo-600"><tr><th className="px-4 py-3">Pronombre</th><th className="px-4 py-3">Forma</th><th className="px-4 py-3">Significa</th></tr></thead><tbody>{[['I', 'am', 'soy / estoy'], ['You', 'are', 'eres / estás'], ['He', 'is', 'es / está'], ['She', 'is', 'es / está'], ['It', 'is', 'es / está'], ['We', 'are', 'somos / estamos'], ['They', 'are', 'son / están']].map(([pronoun, form, meaning]) => <tr key={pronoun} className="border-t border-indigo-50"><td className="px-4 py-3 font-bold">{pronoun}</td><td className="px-4 py-3 font-bold text-indigo-600">{form}</td><td className="px-4 py-3 text-slate-500">{meaning}</td></tr>)}</tbody></table></div></div>
              <div className="grid gap-4 sm:grid-cols-3">{[['Afirmativa', 'I am happy.', 'Estoy feliz.', 'text-emerald-600', 'bg-emerald-50'], ['Negativa', 'She is not tired.', 'Ella no está cansada.', 'text-rose-600', 'bg-rose-50'], ['Pregunta', 'Are you ready?', '¿Estás listo?', 'text-violet-600', 'bg-violet-50']].map(([type, english, spanish, color, bg]) => <div className={`rounded-3xl ${bg} p-5 text-slate-800`} key={type}><span className={`text-xs font-extrabold uppercase tracking-wide ${color}`}>{type}</span><p className="mt-5 text-lg font-bold">{english}</p><p className="mt-2 text-sm text-slate-500">{spanish}</p><button type="button" onClick={() => speak(english)} className={`mt-5 inline-flex items-center gap-2 text-xs font-bold ${color}`} data-testid={`button-speak-tobe-${type}`}><Volume2 size={15} /> Escuchar</button></div>)}</div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-indigo-50"><strong>Recuerda:</strong> en preguntas, el verbo va antes del pronombre: <strong>Are you…?</strong> / <strong>Is she…?</strong></div>
          </div>
        </section>

        <section id="practica" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14 lg:px-8 lg:py-20" data-testid="section-practica">
          <SectionHeading eyebrow="Reto final · Comprueba lo que sabes" title="Momento de practicar" description="Sin presión: cada respuesta es una oportunidad para aprender. Hay preguntas de todas las lecciones." icon={<Trophy size={22} />} complete={completedSubjects.has('practica')} onComplete={() => markComplete('practica')} />
          {!quizStarted ? <div className="soft-card mt-8 flex flex-col items-center justify-between gap-6 bg-gradient-to-br from-white to-violet-50 p-7 text-center sm:flex-row sm:text-left"><div><p className="text-sm font-bold text-indigo-600">{quizQuestions.length} preguntas · opción múltiple y completar</p><h3 className="display mt-1 text-2xl font-extrabold text-slate-800">¿Listo para tu primer reto?</h3><p className="mt-1 text-sm text-slate-500">Tu mejor puntuación guardada: {progress.quizBest}/{quizQuestions.length}</p></div><button type="button" onClick={startQuiz} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700" data-testid="button-start-quiz"><Play size={16} fill="currentColor" /> Comenzar práctica</button></div> : quizFinished ? <div className="soft-card mt-8 bg-white p-8 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Trophy size={31} /></span><p className="mt-5 text-sm font-bold text-indigo-600">Práctica terminada</p><h3 className="display mt-1 text-3xl font-extrabold text-slate-800">{quizScore} de {quizQuestions.length} correctas</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{quizScore >= 6 ? '¡Excelente! Ya tienes una base muy bonita.' : 'Cada intento suma. Repasa tus lecciones y vuelve a intentarlo.'}</p><button type="button" onClick={startQuiz} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50" data-testid="button-restart-quiz"><RotateCcw size={16} /> Intentar de nuevo</button></div> : <div className="soft-card mt-8 overflow-hidden bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><span className="text-xs font-bold uppercase tracking-wide text-indigo-600">{currentQuestion.subject}</span><span className="text-sm font-bold text-slate-400">{quizIndex + 1} / {quizQuestions.length}</span></div><div className="p-6 sm:p-8"><div className="mb-7 h-2 overflow-hidden rounded-full bg-indigo-100"><div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} /></div><h3 className="display max-w-2xl text-2xl font-extrabold leading-snug text-slate-800" data-testid={`text-quiz-question-${quizIndex}`}>{currentQuestion.prompt}</h3>{currentQuestion.kind === 'choice' ? <div className="mt-6 grid gap-3 sm:grid-cols-2">{currentQuestion.options?.map((option, index) => <button type="button" disabled={Boolean(quizResult)} onClick={() => setQuizAnswer(option)} key={option} className={`rounded-xl border p-4 text-left text-sm font-bold transition ${quizAnswer === option ? (quizResult === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : quizResult === 'incorrect' ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-indigo-500 bg-indigo-50 text-indigo-700') : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50'}`} data-testid={`button-answer-${quizIndex}-${index}`}><span className="mr-3 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-slate-500">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div> : <input value={quizAnswer} onChange={(event) => setQuizAnswer(event.target.value)} disabled={Boolean(quizResult)} placeholder="Escribe tu respuesta..." className="mt-6 w-full max-w-md rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" data-testid={`input-answer-${quizIndex}`} aria-label="Tu respuesta" />}{quizResult && <div className={`mt-5 flex items-center gap-2 rounded-xl p-3 text-sm font-semibold ${quizResult === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`} data-testid="status-quiz-result">{quizResult === 'correct' ? <CheckCircle2 size={18} /> : <X size={18} />} {quizResult === 'correct' ? '¡Muy bien! Respuesta correcta.' : `Casi. La respuesta es: ${currentQuestion.answer}`}</div>}<div className="mt-7 flex justify-end">{!quizResult ? <button type="button" disabled={!quizAnswer.trim()} onClick={checkAnswer} className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-indigo-700" data-testid="button-check-answer">Comprobar</button> : <button type="button" onClick={nextQuestion} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700" data-testid="button-next-question">Siguiente <ArrowRight size={16} /></button>}</div></div></div>}
        </section>

        <footer className="border-t border-indigo-100 bg-white/70 px-5 py-8 text-center" data-testid="footer-main"><p className="display text-sm font-extrabold text-slate-700">Inglés desde cero</p><p className="mt-1 text-xs text-slate-500">Aprender algo nuevo también puede sentirse bien.</p></footer>
      </main>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, icon, complete, onComplete, dark = false }: { eyebrow: string; title: string; description: string; icon: React.ReactNode; complete: boolean; onComplete: () => void; dark?: boolean }) {
  return <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><div className={`mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] ${dark ? 'text-indigo-200' : 'text-indigo-600'}`}><span className={`grid h-9 w-9 place-items-center rounded-xl ${dark ? 'bg-white/15 text-white' : 'bg-indigo-50'}`}>{icon}</span>{eyebrow}</div><h2 className={`display text-3xl font-extrabold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-slate-800'}`} data-testid={`heading-${title}`}>{title}</h2><p className={`mt-3 max-w-xl leading-7 ${dark ? 'text-indigo-100' : 'text-slate-500'}`}>{description}</p></div><button type="button" onClick={onComplete} className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${complete ? (dark ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700') : (dark ? 'border border-white/25 text-white hover:bg-white/10' : 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50')}`} data-testid={`button-complete-${title}`} aria-pressed={complete}>{complete ? <CheckCircle2 size={16} /> : <Check size={16} />}{complete ? 'Lección completada' : 'Marcar como completada'}</button></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary resetKey={window.location.pathname}><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;