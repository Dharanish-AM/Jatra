export function computeRouteInsights(routes) {
  if (!routes.length) {
    return {
      cheapestId: null,
      fastestId: null,
      bestRatedId: null,
      bestValueId: null,
    };
  }

  const cheapest = routes.reduce((prev, current) => (current.fare < prev.fare ? current : prev));
  const fastest = routes.reduce((prev, current) =>
    current.durationMinutes < prev.durationMinutes ? current : prev,
  );
  const bestRated = routes.reduce((prev, current) => (current.rating > prev.rating ? current : prev));
  const bestValue = routes.reduce((prev, current) => {
    const prevScore = prev.rating / prev.fare;
    const currentScore = current.rating / current.fare;
    return currentScore > prevScore ? current : prev;
  });

  return {
    cheapestId: cheapest.id,
    fastestId: fastest.id,
    bestRatedId: bestRated.id,
    bestValueId: bestValue.id,
  };
}

export function getRouteInsightBadges(route, insights) {
  const badges = [];
  if (route.id === insights.bestValueId) badges.push({ label: '🏆 Best Value', tone: 'teal' });
  if (route.id === insights.fastestId) badges.push({ label: '⚡ Fastest', tone: 'blue' });
  if (route.id === insights.cheapestId) badges.push({ label: '💰 Cheapest', tone: 'orange' });
  if (route.id === insights.bestRatedId) badges.push({ label: '⭐ Best Rated', tone: 'yellow' });
  return badges;
}
