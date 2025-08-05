import useNotificationStore from '@/utils/notification.store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserService from '../services/user.service';
export function useMyAccounts() {
    const handleError = useNotificationStore(state => state.handleError);
    const queryclient = useQueryClient();

    const response = useQuery({
        queryKey: ['MyAccounts'],
        queryFn: UserService.GetMyAccount
    });

    return;
}