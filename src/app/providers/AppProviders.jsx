import { TripProvider } from '../../context/TripContext';

export default function AppProviders({ children }) {
  return <TripProvider>{children}</TripProvider>;
}
