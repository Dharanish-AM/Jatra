import { useSearchParams } from 'react-router-dom';

export default function useSearchTripParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setTripParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  return {
    searchParams,
    setTripParam,
  };
}
