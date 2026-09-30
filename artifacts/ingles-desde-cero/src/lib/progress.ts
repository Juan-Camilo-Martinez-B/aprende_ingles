import { defaultProgress, STORAGE_KEY, type Progress } from '@/data/content';

export type { Progress };

export function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function progressPercent(sections: string[]) {
  return Math.round((sections.length / 5) * 100);
}
