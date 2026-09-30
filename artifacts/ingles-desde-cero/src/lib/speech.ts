import { toast } from 'sonner';

export function speak(text: string): boolean {
  if (!('speechSynthesis' in window)) {
    toast.error('Tu navegador no puede reproducir audio', {
      description: 'Prueba con Chrome o Edge para escuchar la pronunciación.',
    });
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
  return true;
}
