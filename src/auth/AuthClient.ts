import { authService } from '../api/services';
import { 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse
} from './types';

class AuthClient {
  private user: AuthUser | null = null;
  private isAuthenticated = false;

  constructor() {
    this.restoreAuth();
  }

  private restoreAuth(): void {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (accessToken && user) {
      this.isAuthenticated = true;
      this.user = JSON.parse(user);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
      const response = await authService.login(credentials);
      return this.handleAuthResponse(response);
  }

  async register(userData: RegisterCredentials): Promise<AuthUser> {
      const response = await authService.register(userData);
      return this.handleAuthResponse(response);
  }

  public handleAuthResponse(response: AuthResponse): AuthUser {
    const { accessToken, refreshToken, user } = response;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    this.isAuthenticated = true;
    this.user = user;
    
    return user;
  }

  async logout(): Promise<void> {
    try {
      await authService.logout();
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      this.isAuthenticated = false;
      this.user = null;
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.user;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  async refreshUserInfo(): Promise<AuthUser | null> {
    try {
      const user = await authService.getCurrentUser();
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return null;
      }
      
      const response = await authService.refreshToken(refreshToken);
      const newAccessToken = response.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}

const authClient = new AuthClient();

export default authClient;