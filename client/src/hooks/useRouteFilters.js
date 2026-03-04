import { useMemo } from 'react';

function resolveTimeBucket(time) {
  const hour = Number.parseInt(time.split(':')[0], 10);
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
}

export default function useRouteFilters(routes, searchParams, filters, sortBy) {
  return useMemo(() => {
    let result = routes.filter(
      (route) =>
        route.from.toLowerCase() === searchParams.from.toLowerCase() &&
        route.to.toLowerCase() === searchParams.to.toLowerCase(),
    );

    result = result.filter((route) => {
      const typeMatch = filters.types.includes(route.type === 'bus' ? 'Bus' : 'Train');
      if (!typeMatch) return false;

      const operatorMatch = filters.operators.includes(route.isGovernment ? 'Government' : 'Private');
      if (!operatorMatch) return false;

      if (filters.times.length > 0) {
        const timeBucket = resolveTimeBucket(route.departure);
        if (!filters.times.includes(timeBucket)) return false;
      }

      if (route.fare > filters.maxFare) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'Cheapest') return a.fare - b.fare;
      if (sortBy === 'Fastest') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'Earliest') return a.departure.localeCompare(b.departure);
      if (sortBy === 'Latest') return b.departure.localeCompare(a.departure);
      if (sortBy === 'Best Value') return b.rating / b.fare - a.rating / a.fare;
      return 0;
    });

    return result;
  }, [routes, searchParams, filters, sortBy]);
}
