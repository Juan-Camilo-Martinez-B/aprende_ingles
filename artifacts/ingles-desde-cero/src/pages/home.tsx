import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Headphones,
  Lightbulb,
  MessageCircle,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { IconByName } from '@/components/icon-by-name';
import { LearningRail } from '@/components/learning-rail';
import { SectionHeading } from '@/components/section-heading';
import { Progress } from '@/components/ui/progress';
import {
  alphabet,
  navItems,
  numberGroups,
  numbers,
  quizQuestions,
  VOWELS,
  vocabulary,
  type VocabCategory,
} from '@/data/content';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { loadProgress, saveProgress, type Progress as UserProgress } from '@/lib/progress';
import { speak } from '@/lib/speech';
import { cn } from '@/lib/utils';

type LetterFilter = 'all' | 'vowels' | 'consonants';

export default function Home() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<VocabCategory>('Saludos');
  const [letterFilter, setLetterFilter] = useState<LetterFilter>('all');
  const [letterQuery, setLetterQuery] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const sectionIds = useMemo(() => navItems.map(([, id]) => id), []);
  const activeSection = useScrollSpy(sectionIds);
  const completedSubjects = useMemo(() => new Set(progress.sections), [progress.sections]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markComplete = (id: string) =>
    setProgress((current) =>
      current.sections.includes(id) ? current : { ...current, sections: [...current.sections, id] },
    );

  const currentQuestion = quizQuestions[quizIndex];
  const quizFinished = quizIndex >= quizQuestions.length;
  const alphabetComplete = completedSubjects.has('abecedario');
  const globalPercent = Math.round((progress.sections.length / 5) * 100);

  const filteredAlphabet = useMemo(() => {
    const query = letterQuery.trim().toLowerCase();
    return alphabet.filter(([letter, word]) => {
      if (letterFilter === 'vowels' && !VOWELS.has(letter)) return false;
      if (letterFilter === 'consonants' && VOWELS.has(letter)) return false;
      if (!query) return true;
      return letter.toLowerCase().includes(query) || word.toLowerCase().includes(query);
    });
  }, [letterFilter, letterQuery]);

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer('');
    setQuizResult(null);
  };

  const checkAnswer = useCallback(() => {
    if (!quizAnswer.trim() || quizResult || quizFinished) return;
    const valid = quizAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    setQuizResult(valid ? 'correct' : 'incorrect');
    if (valid) setQuizScore((score) => score + 1);
  }, [quizAnswer, quizResult, quizFinished, currentQuestion.answer]);

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

  useEffect(() => {
    if (!quizStarted || quizFinished) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      if (quizResult) nextQuestion();
      else checkAnswer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quizStarted, quizFinished, quizResult, checkAnswer]);

  const floatingLetters = ['A', 'B', 'C', 'Hi!', '123'];

  return (
    <div className="app-shell gradient-wash">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <AppHeader
        progress={progress}
        activeSection={activeSection}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
      />

      <div className="relative mx-auto flex max-w-7xl gap-8 px-5 lg:px-8">
        <LearningRail completed={completedSubjects} activeSection={activeSection} />

        <main className="min-w-0 flex-1">
          <section
            id="inicio"
            className="scroll-mt-24 pb-12 pt-10 lg:pb-20 lg:pt-16"
            data-testid="section-inicio"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
              <motion.div
                className="fade-up"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
                  <Sparkles size={15} /> Aprende sin miedo, empieza hoy
                </div>
                <h1 className="display max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
                  Tu primer paso para hablar{' '}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    inglés.
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Un espacio amable para construir confianza desde cero. Escucha, repite y celebra cada
                  palabra nueva.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#abecedario"
                    className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
                    data-testid="button-start-learning"
                  >
                    Empezar a aprender <ArrowRight size={17} />
                  </a>
                  <a
                    href="#practica"
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200/80 bg-white/80 px-5 py-3 text-sm font-bold text-indigo-700 shadow-sm backdrop-blur transition hover:bg-white"
                    data-testid="button-go-practice"
                  >
                    <Zap size={17} /> Ir a práctica
                  </a>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Escucha', 'Audio integrado en cada tarjeta'],
                    ['Repite', 'A tu ritmo, sin presión'],
                    ['Avanza', `${globalPercent}% de la ruta`],
                  ].map(([title, copy]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur"
                    >
                      <strong className="display block text-sm text-slate-800">{title}</strong>
                      <span className="text-xs text-slate-500">{copy}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
                {floatingLetters.map((label, index) => (
                  <span
                    key={label}
                    className={cn('float-chip', `float-chip-${index}`)}
                    style={{ animationDelay: `${index * 0.35}s` }}
                  >
                    {label}
                  </span>
                ))}
                <div className="soft-card relative overflow-hidden bg-white/90 p-7 backdrop-blur">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400" />
                  <div className="mb-7 flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Headphones size={24} />
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Día 1
                    </span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">
                    Tu ruta de hoy
                  </p>
                  <h2 className="display mt-2 text-2xl font-extrabold text-slate-800">
                    Conoce el abecedario
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Aprende las 26 letras y practica sus sonidos.
                  </p>
                  <Progress className="mt-6 h-2" value={alphabetComplete ? 100 : 8} />
                  <div className="mt-2 flex justify-between text-xs font-semibold text-slate-400">
                    <span>{alphabetComplete ? 'Lección completada' : '26 letras listas'}</span>
                    <span>{alphabetComplete ? '100%' : 'En curso'}</span>
                  </div>
                  <a
                    href="#abecedario"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                    data-testid="button-continue-lesson"
                  >
                    Continuar lección <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="section-divider" />

          <section
            id="abecedario"
            className="scroll-mt-24 py-14 lg:py-20"
            data-testid="section-abecedario"
          >
            <SectionHeading
              eyebrow="Lección 01 · Sonidos"
              title="El abecedario"
              description="26 letras para abrir la puerta del inglés. Pulsa el altavoz, escucha y repite en voz alta."
              icon={<BookOpen size={22} />}
              complete={completedSubjects.has('abecedario')}
              onComplete={() => markComplete('abecedario')}
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar letras">
                {(
                  [
                    ['all', 'Todas'],
                    ['vowels', 'Vocales'],
                    ['consonants', 'Consonantes'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLetterFilter(value)}
                    className={cn(
                      'rounded-full px-3.5 py-2 text-xs font-bold transition',
                      letterFilter === value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white/80 text-slate-600 hover:bg-indigo-50',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="relative block w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={letterQuery}
                  onChange={(event) => setLetterQuery(event.target.value)}
                  placeholder="Buscar letra o palabra..."
                  className="w-full rounded-xl border border-indigo-100 bg-white/90 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            </div>
            <div className="lesson-grid mt-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {filteredAlphabet.map(([letter, word, hint], index) => (
                <motion.button
                  type="button"
                  onClick={() => speak(`${letter}. ${word}`)}
                  key={letter}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  className={cn(
                    'group soft-card flex min-h-[140px] flex-col items-center justify-center p-4 text-center transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100',
                    VOWELS.has(letter) && 'ring-1 ring-violet-100',
                  )}
                  data-testid={`card-letter-${letter}`}
                  aria-label={`Escuchar letra ${letter}`}
                >
                  <span className="display text-4xl font-extrabold text-indigo-600">{letter}</span>
                  <span className="mt-1 text-sm font-bold text-slate-700">{word}</span>
                  <span className="mt-1 text-xs text-slate-400">/ {hint} /</span>
                  <span className="mt-2 grid h-7 w-7 place-items-center rounded-full bg-indigo-50 text-indigo-500 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Volume2 size={14} />
                  </span>
                </motion.button>
              ))}
            </div>
            {filteredAlphabet.length === 0 && (
              <p className="mt-6 text-center text-sm text-slate-500">
                No hay letras con ese filtro. Prueba otra búsqueda.
              </p>
            )}
          </section>

          <section id="numeros" className="scroll-mt-24 py-14 lg:py-20" data-testid="section-numeros">
            <div className="rounded-[2rem] border border-white/70 bg-white/60 p-6 backdrop-blur lg:p-10">
              <SectionHeading
                eyebrow="Lección 02 · Cantidades"
                title="Los números"
                description="Cuenta del 1 al 20 y descubre cómo formar las decenas. Cada número tiene su propio ritmo."
                icon={<Zap size={22} />}
                complete={completedSubjects.has('numeros')}
                onComplete={() => markComplete('numeros')}
              />
              <div className="mt-8 space-y-10">
                {numberGroups.map(({ title, range }) => {
                  const items = numbers.filter(
                    ([n]) => n >= range[0] && n <= range[1],
                  );
                  return (
                    <div key={title}>
                      <h3 className="display mb-4 text-sm font-extrabold uppercase tracking-wide text-indigo-600">
                        {title}
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                        {items.map(([number, english, spanish]) => (
                          <button
                            type="button"
                            key={number}
                            onClick={() => speak(String(english))}
                            className="group rounded-2xl border border-indigo-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                            data-testid={`card-number-${number}`}
                            aria-label={`Escuchar número ${number}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="display text-2xl font-extrabold text-slate-800">
                                {number}
                              </span>
                              <Volume2
                                size={15}
                                className="text-indigo-400 group-hover:text-indigo-600"
                              />
                            </div>
                            <p className="mt-2 text-sm font-bold text-indigo-600">{english}</p>
                            <p className="text-xs text-slate-500">{spanish}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-sm text-violet-800">
                <Lightbulb size={20} className="mt-0.5 shrink-0" />
                <p>
                  <strong>Tip rápido:</strong> del 13 al 19, muchas palabras terminan en{' '}
                  <strong>-teen</strong>. Escucha la diferencia entre <em>thirteen</em> y{' '}
                  <em>thirty</em>.
                </p>
              </div>
            </div>
          </section>

          <section
            id="vocabulario"
            className="scroll-mt-24 py-14 lg:py-20"
            data-testid="section-vocabulario"
          >
            <SectionHeading
              eyebrow="Lección 03 · Palabras útiles"
              title="Vocabulario de cada día"
              description="Palabras pequeñas que puedes usar desde el primer día. Elige un tema para explorar."
              icon={<MessageCircle size={22} />}
              complete={completedSubjects.has('vocabulario')}
              onComplete={() => markComplete('vocabulario')}
            />
            <div
              className="mt-8 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Categorías de vocabulario"
            >
              {(Object.keys(vocabulary) as VocabCategory[]).map((category) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  key={category}
                  className={cn(
                    'rounded-full px-4 py-2.5 text-sm font-bold transition',
                    activeCategory === category
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'bg-white/80 text-slate-600 hover:bg-indigo-50',
                  )}
                  data-testid={`tab-category-${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {vocabulary[activeCategory].map(([english, spanish, icon], index) => (
                  <button
                    type="button"
                    key={english}
                    onClick={() => speak(english)}
                    className="soft-card group flex items-center gap-4 p-5 text-left transition hover:-translate-y-1 hover:border-indigo-200"
                    data-testid={`card-vocabulary-${activeCategory}-${index}`}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <IconByName name={icon} size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-base text-slate-800">{english}</strong>
                      <span className="text-sm text-slate-500">{spanish}</span>
                    </span>
                    <Volume2 size={17} className="text-indigo-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          <section
            id="to-be"
            className="scroll-mt-24 py-14 lg:py-20"
            data-testid="section-to-be"
          >
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 px-6 py-10 text-white shadow-2xl shadow-indigo-300/30 lg:px-10 lg:py-14">
              <SectionHeading
                dark
                eyebrow="Lección 04 · Gramática esencial"
                title="El verbo To Be"
                description="En presente, to be significa ser o estar. Su forma cambia según la persona."
                icon={<CircleHelp size={22} />}
                complete={completedSubjects.has('to-be')}
                onComplete={() => markComplete('to-be')}
              />
              <div className="mt-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
                <div className="rounded-3xl bg-white p-6 text-slate-800 shadow-xl shadow-indigo-950/10">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="display text-xl font-extrabold">Pronombres y formas</h3>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                      Presente
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-indigo-100">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-indigo-50 text-xs uppercase tracking-wide text-indigo-600">
                        <tr>
                          <th className="px-4 py-3">Pronombre</th>
                          <th className="px-4 py-3">Forma</th>
                          <th className="px-4 py-3">Significa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['I', 'am', 'soy / estoy'],
                          ['You', 'are', 'eres / estás'],
                          ['He', 'is', 'es / está'],
                          ['She', 'is', 'es / está'],
                          ['It', 'is', 'es / está'],
                          ['We', 'are', 'somos / estamos'],
                          ['They', 'are', 'son / están'],
                        ].map(([pronoun, form, meaning]) => (
                          <tr key={pronoun} className="border-t border-indigo-50">
                            <td className="px-4 py-3 font-bold">{pronoun}</td>
                            <td className="px-4 py-3 font-bold text-indigo-600">{form}</td>
                            <td className="px-4 py-3 text-slate-500">{meaning}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ['Afirmativa', 'I am happy.', 'Estoy feliz.', 'text-emerald-600', 'bg-emerald-50'],
                    ['Negativa', 'She is not tired.', 'Ella no está cansada.', 'text-rose-600', 'bg-rose-50'],
                    ['Pregunta', 'Are you ready?', '¿Estás listo?', 'text-violet-600', 'bg-violet-50'],
                  ].map(([type, english, spanish, color, bg]) => (
                    <div className={`rounded-3xl ${bg} p-5 text-slate-800`} key={type}>
                      <span className={`text-xs font-extrabold uppercase tracking-wide ${color}`}>
                        {type}
                      </span>
                      <p className="mt-5 text-lg font-bold">{english}</p>
                      <p className="mt-2 text-sm text-slate-500">{spanish}</p>
                      <button
                        type="button"
                        onClick={() => speak(english)}
                        className={`mt-5 inline-flex items-center gap-2 text-xs font-bold ${color}`}
                        data-testid={`button-speak-tobe-${type}`}
                      >
                        <Volume2 size={15} /> Escuchar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-indigo-50">
                <strong>Recuerda:</strong> en preguntas, el verbo va antes del pronombre:{' '}
                <strong>Are you…?</strong> / <strong>Is she…?</strong>
              </div>
            </div>
          </section>

          <section id="practica" className="scroll-mt-24 py-14 lg:py-20" data-testid="section-practica">
            <SectionHeading
              eyebrow="Reto final · Comprueba lo que sabes"
              title="Momento de practicar"
              description="Sin presión: cada respuesta es una oportunidad para aprender. Hay preguntas de todas las lecciones."
              icon={<Trophy size={22} />}
              complete={completedSubjects.has('practica')}
              onComplete={() => markComplete('practica')}
            />
            {!quizStarted ? (
              <div className="soft-card mt-8 flex flex-col items-center justify-between gap-6 bg-gradient-to-br from-white to-violet-50 p-7 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="text-sm font-bold text-indigo-600">
                    {quizQuestions.length} preguntas · opción múltiple y completar
                  </p>
                  <h3 className="display mt-1 text-2xl font-extrabold text-slate-800">
                    ¿Listo para tu primer reto?
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Tu mejor puntuación: {progress.quizBest}/{quizQuestions.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startQuiz}
                  className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
                  data-testid="button-start-quiz"
                >
                  <Play size={16} fill="currentColor" /> Comenzar práctica
                </button>
              </div>
            ) : quizFinished ? (
              <div className="soft-card mt-8 bg-white p-8 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <Trophy size={31} />
                </span>
                <p className="mt-5 text-sm font-bold text-indigo-600">Práctica terminada</p>
                <h3 className="display mt-1 text-3xl font-extrabold text-slate-800">
                  {quizScore} de {quizQuestions.length} correctas
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  {quizScore >= 6
                    ? '¡Excelente! Ya tienes una base muy bonita.'
                    : 'Cada intento suma. Repasa tus lecciones y vuelve a intentarlo.'}
                </p>
                <button
                  type="button"
                  onClick={startQuiz}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
                  data-testid="button-restart-quiz"
                >
                  <RotateCcw size={16} /> Intentar de nuevo
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={quizIndex}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="soft-card mt-8 overflow-hidden bg-white"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                      {currentQuestion.subject}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      {quizIndex + 1} / {quizQuestions.length}
                    </span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <Progress
                      className="mb-7 h-2"
                      value={((quizIndex + 1) / quizQuestions.length) * 100}
                    />
                    <h3
                      className="display max-w-2xl text-2xl font-extrabold leading-snug text-slate-800"
                      data-testid={`text-quiz-question-${quizIndex}`}
                    >
                      {currentQuestion.prompt}
                    </h3>
                    {currentQuestion.kind === 'choice' ? (
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {currentQuestion.options?.map((option, index) => (
                          <button
                            type="button"
                            disabled={Boolean(quizResult)}
                            onClick={() => setQuizAnswer(option)}
                            key={option}
                            className={cn(
                              'rounded-xl border p-4 text-left text-sm font-bold transition',
                              quizAnswer === option
                                ? quizResult === 'correct'
                                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                  : quizResult === 'incorrect'
                                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                                    : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50',
                            )}
                            data-testid={`button-answer-${quizIndex}-${index}`}
                          >
                            <span className="mr-3 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-slate-500">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        value={quizAnswer}
                        onChange={(event) => setQuizAnswer(event.target.value)}
                        disabled={Boolean(quizResult)}
                        placeholder="Escribe tu respuesta..."
                        className="mt-6 w-full max-w-md rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        data-testid={`input-answer-${quizIndex}`}
                        aria-label="Tu respuesta"
                      />
                    )}
                    {quizResult && (
                      <div
                        className={cn(
                          'mt-5 flex items-center gap-2 rounded-xl p-3 text-sm font-semibold',
                          quizResult === 'correct'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700',
                        )}
                        data-testid="status-quiz-result"
                      >
                        {quizResult === 'correct' ? <CheckCircle2 size={18} /> : <X size={18} />}
                        {quizResult === 'correct'
                          ? '¡Muy bien! Respuesta correcta.'
                          : `Casi. La respuesta es: ${currentQuestion.answer}`}
                      </div>
                    )}
                    <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-400">Tip: pulsa Enter para comprobar</p>
                      <div>
                        {!quizResult ? (
                          <button
                            type="button"
                            disabled={!quizAnswer.trim()}
                            onClick={checkAnswer}
                            className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-indigo-700"
                            data-testid="button-check-answer"
                          >
                            Comprobar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={nextQuestion}
                            className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
                            data-testid="button-next-question"
                          >
                            Siguiente <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </section>

          <footer
            className="border-t border-indigo-100/80 py-10 text-center"
            data-testid="footer-main"
          >
            <p className="display text-sm font-extrabold text-slate-700">Inglés desde cero</p>
            <p className="mt-1 text-xs text-slate-500">
              Aprender algo nuevo también puede sentirse bien.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {navItems.slice(1).map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  {label}
                </a>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
