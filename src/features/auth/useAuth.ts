import { useState } from 'react';
import { AuthService } from './AuthService';

export function useAuth(onLoginSuccess: () => void) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => AuthService.isAuthenticated());

  function handleLogin() {
    AuthService.createSession();
    setIsLoggedIn(true);
    onLoginSuccess();
  }

  return { isLoggedIn, handleLogin };
}
