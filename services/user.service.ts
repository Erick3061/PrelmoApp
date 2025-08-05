import { Account } from '@/interface/hooks.interface';
import useAppStore from '@/utils/app.store';

class UserService {
    static GetMyAccount = async (): Promise<{ accounts: Account[] }> => {
        const { data } = await useAppStore.getState().instance.get<{ accounts: Account[] }>('accounts/individual');
        return data
    }
}

export default UserService;

