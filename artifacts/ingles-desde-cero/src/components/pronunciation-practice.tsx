import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  MicOff,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { matchesPronunciation, useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { speak } from '@/lib/speech';
import { cn } from '@/lib/utils';

export type PracticeItem = {
  id: string;
  display: string;
  speakText: string;
  hint?: string;
  subtitle?: string;
};

type PronunciationPracticeProps = {
  items: PracticeItem[];
  title: string;
  description: string;
  sectionId: string;
  onAllComplete: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  onProgressChange?: (completed: Set<string>) => void;
};

export const STORAGE_PREFIX = 'pronunciation-progress-';

export function loadPronunciationProgress(sectionId: string): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + sectionId);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

export function savePronunciationProgress(sectionId: string, completed: Set<string>) {
  localStorage.setItem(STORAGE_PREFIX + sectionId, JSON.stringify([...completed]));
}

export function PronunciationPractice({
  items,
  title,
  description,
  sectionId,
  onAllComplete,
  isOpen,
  onClose,
  initialIndex = 0,
  onProgressChange,
}: PronunciationPracticeProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(() =>
    loadPronunciationProgress(sectionId),
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [attemptResult, setAttemptResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCompletedItems(loadPronunciationProgress(sectionId));
      setCurrentIndex(initialIndex >= 0 && initialIndex < items.length ? initialIndex : 0);
      setAttemptResult(null);
    }
  }, [isOpen, initialIndex, sectionId, items.length]);

  const {
    isListening,
    transcript,
    confidence,
    startListening,
    stopListening,
    isSupported,
    error: speechError,
  } = useSpeechRecognition();

  const currentItem = items[currentIndex];
  const totalCompleted = completedItems.size;
  const totalItems = items.length;
  const allDone = totalCompleted >= totalItems;
  const progressPercent = Math.round((totalCompleted / totalItems) * 100);

  // Find next incomplete item
  const nextIncompleteIndex = useMemo(() => {
    for (let i = 0; i < items.length; i++) {
      if (!completedItems.has(items[i].id)) return i;
    }
    return -1;
  }, [items, completedItems]);

  // Save progress whenever completedItems changes
  useEffect(() => {
    savePronunciationProgress(sectionId, completedItems);
    onProgressChange?.(completedItems);
  }, [completedItems, sectionId, onProgressChange]);

  // Check the transcript when it changes (after recognition finishes)
  useEffect(() => {
    if (!transcript || !currentItem || isListening) return;

    const expectedText = currentItem.speakText;
    const isMatch = matchesPronunciation(transcript, expectedText);

    if (isMatch) {
      setAttemptResult('correct');
      setCompletedItems((prev) => {
        const next = new Set(prev);
        next.add(currentItem.id);
        return next;
      });
    } else {
      setAttemptResult('incorrect');
    }
  }, [transcript, currentItem, isListening]);

  // Check if all items are done
  useEffect(() => {
    if (allDone && !showCelebration) {
      setShowCelebration(true);
      onAllComplete();
    }
  }, [allDone, showCelebration, onAllComplete]);

  const handleListenFirst = useCallback(() => {
    if (currentItem) {
      speak(currentItem.speakText);
    }
  }, [currentItem]);

  const handleTryPronounce = useCallback(() => {
    setAttemptResult(null);
    startListening();
  }, [startListening]);

  const handleNext = useCallback(() => {
    setAttemptResult(null);
    if (nextIncompleteIndex >= 0) {
      setCurrentIndex(nextIncompleteIndex);
    } else {
      // All done, go to first
      setCurrentIndex(0);
    }
  }, [nextIncompleteIndex]);

  const handleGoTo = useCallback(
    (index: number) => {
      setAttemptResult(null);
      setCurrentIndex(index);
    },
    [],
  );

  const handleReset = useCallback(() => {
    setCompletedItems(new Set());
    setCurrentIndex(0);
    setAttemptResult(null);
    setShowCelebration(false);
    savePronunciationProgress(sectionId, new Set());
  }, [sectionId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pronunciation-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="pronunciation-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="pronunciation-header">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Mic size={18} className="text-indigo-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                  Práctica de pronunciación
                </span>
              </div>
              <h3 className="display mt-1 text-xl font-extrabold text-white">{title}</h3>
              <p className="mt-1 text-sm text-indigo-200/80">{description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-6 pb-2 pt-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">
                {totalCompleted} de {totalItems} pronunciados
              </span>
              <span className={cn('font-extrabold', allDone ? 'text-emerald-600' : 'text-indigo-600')}>
                {progressPercent}%
              </span>
            </div>
            <div className="pronunciation-progress-bar mt-2">
              <motion.div
                className="pronunciation-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Item grid (mini map) */}
          <div className="px-6 py-3">
            <div className="pronunciation-minimap">
              {items.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleGoTo(index)}
                  className={cn(
                    'pronunciation-minimap-item',
                    completedItems.has(item.id) && 'pronunciation-minimap-done',
                    currentIndex === index && !completedItems.has(item.id) && 'pronunciation-minimap-active',
                    currentIndex === index && completedItems.has(item.id) && 'pronunciation-minimap-done pronunciation-minimap-active',
                  )}
                  title={item.display}
                >
                  {completedItems.has(item.id) ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <span className="text-[10px] font-bold">{item.display}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main practice area */}
          <div className="px-6 pb-6">
            {showCelebration && allDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pronunciation-celebration"
              >
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <PartyPopper size={32} />
                </span>
                <h4 className="display mt-4 text-2xl font-extrabold text-slate-800">
                  ¡Felicidades! 🎉
                </h4>
                <p className="mt-2 text-sm text-slate-500">
                  Has pronunciado correctamente todos los elementos. ¡Ya puedes avanzar!
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={15} /> Practicar de nuevo
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
                  >
                    <Sparkles size={15} /> ¡Continuar!
                  </button>
                </div>
              </motion.div>
            ) : currentItem ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="pronunciation-card"
                >
                  {/* Step indicator */}
                  <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">
                      Paso {currentIndex + 1} de {totalItems}
                    </span>
                    {completedItems.has(currentItem.id) && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600">
                        ✓ Ya pronunciado
                      </span>
                    )}
                  </div>

                  {/* Display letter/number */}
                  <div className="pronunciation-display">
                    <span className="display text-6xl font-extrabold text-indigo-600">
                      {currentItem.display}
                    </span>
                    {currentItem.hint && (
                      <span className="mt-1 text-sm text-slate-400">/ {currentItem.hint} /</span>
                    )}
                    {currentItem.subtitle && (
                      <span className="mt-1 text-sm font-bold text-slate-600">
                        {currentItem.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Step 1: Listen */}
                  <div className="pronunciation-step">
                    <span className="pronunciation-step-number">1</span>
                    <span className="flex-1 text-sm font-semibold text-slate-700">
                      Escucha cómo se pronuncia
                    </span>
                    <button
                      type="button"
                      onClick={handleListenFirst}
                      className="pronunciation-listen-btn"
                      data-testid={`btn-listen-${currentItem.id}`}
                    >
                      <Volume2 size={16} /> Escuchar
                    </button>
                  </div>

                  {/* Step 2: Speak */}
                  <div className="pronunciation-step">
                    <span className="pronunciation-step-number">2</span>
                    <span className="flex-1 text-sm font-semibold text-slate-700">
                      Ahora di tú la pronunciación
                    </span>
                    {!isSupported ? (
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                          <MicOff size={13} /> Sin soporte de voz (usa Chrome o Edge)
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAttemptResult('correct');
                            setCompletedItems((prev) => {
                              const next = new Set(prev);
                              next.add(currentItem.id);
                              return next;
                            });
                          }}
                          className="text-xs font-bold text-indigo-600 underline hover:text-indigo-800"
                        >
                          Marcar como dicho
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={isListening ? stopListening : handleTryPronounce}
                        disabled={!isSupported}
                        className={cn(
                          'pronunciation-speak-btn',
                          isListening && 'pronunciation-speak-btn-active',
                        )}
                        data-testid={`btn-speak-${currentItem.id}`}
                      >
                        <Mic size={16} className={isListening ? 'animate-pulse' : ''} />
                        {isListening ? 'Escuchando...' : 'Hablar'}
                      </button>
                    )}
                  </div>

                  {/* Listening indicator */}
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pronunciation-listening"
                    >
                      <div className="pronunciation-wave">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="pronunciation-wave-bar"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-bold text-indigo-600">Habla ahora...</p>
                    </motion.div>
                  )}

                  {/* Result */}
                  {attemptResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'pronunciation-result',
                        attemptResult === 'correct'
                          ? 'pronunciation-result-correct'
                          : 'pronunciation-result-incorrect',
                      )}
                    >
                      {attemptResult === 'correct' ? (
                        <>
                          <CheckCircle2 size={20} />
                          <div>
                            <p className="font-bold">¡Excelente! Pronunciación correcta</p>
                            <p className="text-xs opacity-80">
                              Dijiste: "{transcript}" — Confianza: {Math.round(confidence * 100)}%
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <X size={20} />
                          <div>
                            <p className="font-bold">Intenta de nuevo</p>
                            <p className="text-xs opacity-80">
                              Dijiste: "{transcript}" — Se esperaba: "{currentItem.speakText}"
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Speech error */}
                  {speechError && (
                    <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-700">
                      {speechError}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={currentIndex === 0}
                      onClick={() => handleGoTo(currentIndex - 1)}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Anterior
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
                    >
                      Siguiente <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
