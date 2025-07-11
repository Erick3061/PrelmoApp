import { Notification } from '@/components/Notification';
import { Action, ContextProps, Props, State } from '@/interface/notification.context';
import React, { createContext, useReducer } from 'react';

const AlertReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'show': return { ...state, content: action.payload, show: true }
        case 'close': return { ...state, show: false, content: undefined }
        case 'updateTimeOut': return { ...state, timeOut: action.payload }
        case 'updateAutoClose': return { ...state, autoClose: action.payload }
        default: return state;
    }
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