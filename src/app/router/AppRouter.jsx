import React, { Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const Home = React.lazy(() => import('../../pages/Home'));
const Results = React.lazy(() => import('../../pages/Results'));
const Hotels = React.lazy(() => import('../../pages/Hotels'));
const Itinerary = React.lazy(() => import('../../pages/Itinerary'));
const SharedTrip = React.lazy(() => import('../../pages/SharedTrip'));

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <div className="text-8xl mb-4">🚂</div>
      <h1 className="text-4xl font-bold mb-2 text-accent-orange">Oops!</h1>
      <p className="text-xl text-text-muted mb-6">Train went off track. We couldn't find this page.</p>
      <Link to="/" className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg px-8 py-3.5 rounded-xl font-black hover-lift shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] transition-all">
        Go Back Home
      </Link>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[50vh]" role="status" aria-live="polite">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-accent-orange border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/trip" element={<SharedTrip />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
