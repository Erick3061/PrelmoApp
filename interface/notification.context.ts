/**Types */
export type State = {
    show: boolean;
    content?: Props;
    autoClose: boolean;
    timeOut?: number;
}

export type Action = | { type: 'showModal', payload: Props }
    | { type: 'show', payload: Props }
    | { type: 'close' }
    | { type: 'updateTimeOut', payload: number }
    | { type: 'updateAutoClose', payload: boolean }

/**Interfaces */
export interface ContextProps extends State {
    handleError: (error: string) => void;
    notification: (props: Props) => void;
    updateAutoClose: (close: boolean) => void;
    closeNot: () => void;
}

export interface Props {
    type: 'info' | 'error' | 'question' | 'warning' | 'success';
    customContent?: React.ReactNode;
    title?: string;
    subtitle?: string;
    text?: string;
    autoClose?: boolean;
    timeOut?: number;
}