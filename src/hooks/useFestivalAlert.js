import { useMemo } from 'react';
import { isNearFestival } from '../utils/festivalDates';

export default function useFestivalAlert(date) {
  return useMemo(() => isNearFestival(date), [date]);
}
