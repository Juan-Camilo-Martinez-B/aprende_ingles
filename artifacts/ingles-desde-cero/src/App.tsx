import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Route, Router as WouterRouter, Switch } from 'wouter';

import { ErrorBoundary } from '@/components/error-boundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as ShadToaster } from '@/components/ui/toaster';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary resetKey={window.location.pathname}>
            <Router />
          </ErrorBoundary>
        </WouterRouter>
        <ShadToaster />
        <Toaster position="top-center" richColors closeButton theme="light" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
