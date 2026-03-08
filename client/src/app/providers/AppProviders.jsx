import { TripProvider } from '../../context/TripContext';
import { AuthProvider } from '../../context/AuthContext';

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <TripProvider>{children}</TripProvider>
    </AuthProvider>
  );
}
