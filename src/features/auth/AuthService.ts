const MAX_ATTEMPTS = 5;

export class AuthService {
  private static attempts = 0;

  static validate(user: string, pass: string): boolean {
    if (this.attempts >= MAX_ATTEMPTS) return false;
    const validUser = import.meta.env.VITE_AUTH_USER ?? 'admin';
    const validPass = import.meta.env.VITE_AUTH_PASS ?? 'abl1704931';
    if (user.trim() === validUser && pass === validPass) {
      this.attempts = 0;
      return true;
    }
    this.attempts++;
    return false;
  }

  static isLocked(): boolean {
    return this.attempts >= MAX_ATTEMPTS;
  }

  static createSession(): void {
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('pos_auth', token);
  }

  static isAuthenticated(): boolean {
    return sessionStorage.getItem('pos_auth') !== null;
  }

  static clearSession(): void {
    sessionStorage.removeItem('pos_auth');
  }
}
