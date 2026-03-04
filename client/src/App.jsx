import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AppRouter from './app/router/AppRouter';

const AIChatSidebar = React.lazy(() => import('./components/AIChatSidebar'));

function App() {
  return (
    <div className="premium-shell min-h-screen flex flex-col relative w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full relative z-10">
        <AppRouter />
      </main>

      <Suspense fallback={null}>
        <AIChatSidebar />
      </Suspense>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--color-card-bg)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
          },
        }}
      />
    </div>
  );
}

export default App;
