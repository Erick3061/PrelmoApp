/**Interface */
interface NotificationActions {
    closeNot: () => void;
    handleError: (error: string) => void;
    // notification: (props: Props) => void;
}

export interface Props {
    type: 'info' | 'error' | 'question' | 'warning' | 'success';
    customContent?: React.ReactNode;
    title?: string;
    subtitle?: string;
    text?: string;
}

export interface NotificationState extends NotificationActions {
    autoClose: boolean;
    show: boolean;
    timeOut: number;
    content?: Props;
}