import { User } from '@/interface/auth.store.interface';
import useAppStore from '@/utils/app.store';

class AuthService {
  static signIn = async (props: { email: string; password: string; }): Promise<User> => {
    const { data } = await useAppStore.getState().instance.post<User>('auth', props);
    return data;
  }

  static checkAuth = async (refreshToken?: string): Promise<User> => {
    if (refreshToken) {
      const { data } = await useAppStore.getState().instance.get<User>('auth/check-auth', { headers: { Authorization: `Bearer ${refreshToken}` } });
      return data;
    }
    const { data } = await useAppStore.getState().instance.get<User>('auth/check-auth');
    return data;
  }
}

export default AuthService;

