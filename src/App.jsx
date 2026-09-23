import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { Dashboard } from './Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  // Si no hay usuario logueado, muestra el Login
  if (!user) {
    return <LoginForm onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // Si ya inició sesión, muestra el ERP (Dashboard)
  return <Dashboard onLogout={() => setUser(null)} />;
}