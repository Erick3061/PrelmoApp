import React, { createContext, useReducer } from 'react';
import { Notification } from './Notification';

type State = {
    show: boolean;
    content?: Props;
    autoClose: boolean;
    timeOut?: number;
}

type Action = | { type: 'showModal', payload: Props }
    | { type: 'show', payload: Props }
    | { type: 'close' }
    | { type: 'updateTimeOut', payload: number }
    | { type: 'updateAutoClose', payload: boolean }

const AlertReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'show': return { ...state, content: action.payload, show: true }
        case 'close': return { ...state, show: false, content: undefined }
        case 'updateTimeOut': return { ...state, timeOut: action.payload }
        case 'updateAutoClose': return { ...state, autoClose: action.payload }
        default: return state;
    }
}

interface ContextProps extends State {
    handleError: (error: string) => void;
    notification: (props: Props) => void;
    updateAutoClose: (close: boolean) => void;
    closeNot: () => void;
}

interface Props {
    type: 'info' | 'error' | 'question' | 'warning' | 'success';
    customContent?: React.ReactNode;
    title?: string;
    subtitle?: string;
    text?: string;
    autoClose?: boolean;
    timeOut?: number;
}

const initialState: State = {
    show: false,
    autoClose: true,
    timeOut: 2000,
}


export const NotificationContext = createContext({} as ContextProps);

export const NotificationProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(AlertReducer, initialState);

    const handleError = async (error: string) => {
        notification({
            type: 'error',
            title: 'Error',
            text: error,
        });
    }

    const resetTimeOut = () => dispatch({ type: 'updateTimeOut', payload: 2000 });

    const notification = (props: Props) => {
        dispatch({ type: 'show', payload: props });
        props.timeOut && dispatch({ type: 'updateTimeOut', payload: props.timeOut });
        dispatch({ type: 'updateAutoClose', payload: props.autoClose ?? true });
    }

    const updateAutoClose = (close: boolean) => { dispatch({ type: 'updateAutoClose', payload: close }) }

    const closeNot = () => {
        dispatch({ type: 'close' });
        updateAutoClose(true);
        resetTimeOut();
    }

    return (
        <NotificationContext.Provider
            value={{
                ...state,
                notification,
                closeNot,
                updateAutoClose,
                handleError,
            }}
        >
            {children}
            <Notification />
        </NotificationContext.Provider>
    )
}