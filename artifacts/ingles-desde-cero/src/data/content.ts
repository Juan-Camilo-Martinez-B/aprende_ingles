export const STORAGE_KEY = 'ingles-desde-cero-progress';

export type Progress = { sections: string[]; quizBest: number };
export const defaultProgress: Progress = { sections: [], quizBest: 0 };

export const navItems = [
  ['Inicio', 'inicio'],
  ['Abecedario', 'abecedario'],
  ['Números', 'numeros'],
  ['Vocabulario', 'vocabulario'],
  ['Verbo To Be', 'to-be'],
  ['Práctica', 'practica'],
] as const;

export const lessonMeta = [
  { id: 'abecedario', label: 'Abecedario', step: '01', icon: 'BookOpen' },
  { id: 'numeros', label: 'Números', step: '02', icon: 'Hash' },
  { id: 'vocabulario', label: 'Vocabulario', step: '03', icon: 'MessageCircle' },
  { id: 'to-be', label: 'To Be', step: '04', icon: 'CircleHelp' },
  { id: 'practica', label: 'Práctica', step: '05', icon: 'Trophy' },
] as const;

export const alphabet = [
  ['A', 'apple', 'éi'],
  ['B', 'ball', 'bí'],
  ['C', 'cat', 'sí'],
  ['D', 'dog', 'dí'],
  ['E', 'egg', 'í'],
  ['F', 'fish', 'ef'],
  ['G', 'go', 'yí'],
  ['H', 'house', 'éich'],
  ['I', 'ice', 'ái'],
  ['J', 'juice', 'yéi'],
  ['K', 'kite', 'kéi'],
  ['L', 'lion', 'el'],
  ['M', 'moon', 'em'],
  ['N', 'name', 'en'],
  ['O', 'orange', 'óu'],
  ['P', 'pen', 'pí'],
  ['Q', 'queen', 'kiú'],
  ['R', 'red', 'ar'],
  ['S', 'sun', 'es'],
  ['T', 'tree', 'tí'],
  ['U', 'umbrella', 'iú'],
  ['V', 'voice', 'ví'],
  ['W', 'water', 'dábol iú'],
  ['X', 'x-ray', 'eks réi'],
  ['Y', 'yellow', 'uái'],
  ['Z', 'zoo', 'zí'],
] as const;

export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export const numbers = [
  [1, 'one', 'uno'],
  [2, 'two', 'dos'],
  [3, 'three', 'tres'],
  [4, 'four', 'cuatro'],
  [5, 'five', 'cinco'],
  [6, 'six', 'seis'],
  [7, 'seven', 'siete'],
  [8, 'eight', 'ocho'],
  [9, 'nine', 'nueve'],
  [10, 'ten', 'diez'],
  [11, 'eleven', 'once'],
  [12, 'twelve', 'doce'],
  [13, 'thirteen', 'trece'],
  [14, 'fourteen', 'catorce'],
  [15, 'fifteen', 'quince'],
  [16, 'sixteen', 'dieciséis'],
  [17, 'seventeen', 'diecisiete'],
  [18, 'eighteen', 'dieciocho'],
  [19, 'nineteen', 'diecinueve'],
  [20, 'twenty', 'veinte'],
  [30, 'thirty', 'treinta'],
  [40, 'forty', 'cuarenta'],
  [50, 'fifty', 'cincuenta'],
  [60, 'sixty', 'sesenta'],
  [70, 'seventy', 'setenta'],
  [80, 'eighty', 'ochenta'],
  [90, 'ninety', 'noventa'],
  [100, 'one hundred', 'cien'],
] as const;

export const numberGroups = [
  { title: 'Del 1 al 10', range: [1, 10] as const },
  { title: 'Del 11 al 20', range: [11, 20] as const },
  { title: 'Decenas', range: [30, 100] as const },
] as const;

export const vocabulary = {
  Saludos: [
    ['Hello', 'Hola', 'MessageCircle'],
    ['Good morning', 'Buenos días', 'Sunrise'],
    ['Goodbye', 'Adiós', 'Hand'],
    ['Thank you', 'Gracias', 'Heart'],
  ],
  Colores: [
    ['Red', 'Rojo', 'Circle'],
    ['Blue', 'Azul', 'Droplets'],
    ['Yellow', 'Amarillo', 'Sun'],
    ['Green', 'Verde', 'Leaf'],
  ],
  'Días y meses': [
    ['Sunday', 'Domingo', 'Sun'],
    ['Monday', 'Lunes', 'CalendarDays'],
    ['Tuesday', 'Martes', 'CalendarDays'],
    ['Wednesday', 'Miércoles', 'CalendarDays'],
    ['Thursday', 'Jueves', 'CalendarDays'],
    ['Friday', 'Viernes', 'CalendarCheck'],
    ['Saturday', 'Sábado', 'CalendarDays'],
    ['January', 'Enero', 'Snowflake'],
    ['February', 'Febrero', 'Snowflake'],
    ['March', 'Marzo', 'Sun'],
    ['April', 'Abril', 'Sun'],
    ['May', 'Mayo', 'Sun'],
    ['June', 'Junio', 'Sun'],
    ['July', 'Julio', 'Sun'],
    ['August', 'Agosto', 'Sun'],
    ['September', 'Septiembre', 'Sun'],
    ['October', 'Octubre', 'Sun'],
    ['November', 'Noviembre', 'Snowflake'],
    ['December', 'Diciembre', 'Snowflake'],
  ],
  'Objetos comunes': [
    ['Book', 'Libro', 'BookOpen'],
    ['Chair', 'Silla', 'Armchair'],
    ['Phone', 'Teléfono', 'Smartphone'],
    ['Window', 'Ventana', 'PanelsTopLeft'],
  ],
} as const;

export type VocabCategory = keyof typeof vocabulary;

export const quizQuestions = [
  {
    subject: 'Abecedario',
    prompt: '¿Cuál es la pronunciación aproximada de la letra “J”?',
    options: ['yéi', 'jota', 'jí', 'ja'],
    answer: 'yéi',
    kind: 'choice' as const,
  },
  {
    subject: 'Números',
    prompt: '¿Cómo se dice “quince” en inglés?',
    options: ['fifty', 'fifteen', 'fourteen', 'five'],
    answer: 'fifteen',
    kind: 'choice' as const,
  },
  {
    subject: 'Vocabulario',
    prompt: '“Good morning” significa…',
    options: ['Buenas noches', 'Buenos días', 'Adiós', 'Gracias'],
    answer: 'Buenos días',
    kind: 'choice' as const,
  },
  {
    subject: 'Verbo To Be',
    prompt: 'Completa: “They ___ happy.”',
    options: ['am', 'is', 'are', 'be'],
    answer: 'are',
    kind: 'choice' as const,
  },
  {
    subject: 'Abecedario',
    prompt: 'Escribe la palabra en inglés para “gato”.',
    answer: 'cat',
    kind: 'fill' as const,
  },
  {
    subject: 'Números',
    prompt: 'Escribe el número en inglés: 8.',
    answer: 'eight',
    kind: 'fill' as const,
  },
  {
    subject: 'Vocabulario',
    prompt: 'Escribe la traducción de “blue”.',
    answer: 'azul',
    kind: 'fill' as const,
  },
  {
    subject: 'Verbo To Be',
    prompt: 'Completa: “I ___ a student.”',
    answer: 'am',
    kind: 'fill' as const,
  },
  {
    subject: 'Verbo To Be',
    prompt: 'Completa: “She ___ my friend.”',
    answer: 'is',
    kind: 'fill' as const,
  },
];
