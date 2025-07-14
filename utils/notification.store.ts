import { NotificationState } from "@/interface/notification.store";
import { StateCreator, create } from "zustand";

const NotificationStore: StateCreator<NotificationState> = (set, get) => ({
    show: false,
    autoClose: true,
    timeOut: 3000,
    closeNot: () => set(state => ({
        ...state,
        show: false,
        autoclose: true,
        content: undefined,
    })),
    handleError: (text: string) => set(state => ({
        ...state,
        show: true,
        content: {
            text,
            title: 'Error',
            type: 'error',
        }
    }))
});

const useNotificationStore = create<NotificationState>()(
    NotificationStore
);

export default useNotificationStore;