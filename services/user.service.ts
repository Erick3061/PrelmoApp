import { Account, Group } from '@/interface/hooks.interface';
import useAppStore from '@/utils/app.store';

class UserService {
    static GetMyAccount = async (): Promise<{ accounts: Account[] }> => {
        const { data } = await useAppStore.getState().instance.get<{ accounts: Account[] }>('accounts/individual');
        return data
    }

    static GetMyGroups = async (): Promise<{ groups: Group[] }> => {
        const { data } = await useAppStore.getState().instance.get<{ groups: Group[] }>('accounts/groups');
        return data
    }
}

export default UserService;

