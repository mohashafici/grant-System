// Authentication utility functions using sessionStorage for better security

export const authStorage = {
  // Set authentication data
  setAuth: (token: string, user: any) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  },

  // Get authentication token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  },

  // Get user data
  getUser: (): any | null => {
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('token');
    }
    return false;
  },

  // Clear authentication data
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  },

  // Get user role
  getUserRole: (): string | null => {
    const user = authStorage.getUser();
    return user?.role || null;
  }
}; 