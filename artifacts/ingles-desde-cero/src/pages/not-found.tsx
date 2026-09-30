import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="app-shell gradient-wash flex min-h-screen items-center justify-center px-5">
      <Card className="soft-card mx-auto w-full max-w-md border-0 bg-white/90 backdrop-blur">
        <CardContent className="pt-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <BookOpen size={26} />
          </span>
          <h1 className="display mt-5 text-2xl font-extrabold text-slate-800">Página no encontrada</h1>
          <p className="mt-2 text-sm text-slate-500">
            Esta ruta no existe. Vuelve al inicio y sigue aprendiendo inglés paso a paso.
          </p>
          <Link
            href="/"
            className="btn-primary mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm no-underline"
          >
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
