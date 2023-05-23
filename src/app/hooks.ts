import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from './store';
import { useContext, useEffect, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { NotificationContext } from "../components/Notification/NotificationtContext";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from "axios";
import { useReportProps } from "../interface/interface";
import { logOut } from "../features/configSlice";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDebouncedValue = (input: string = '', time: number = 500) => {
    const [debounceValue, setDebounceValue] = useState<string>(input);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceValue(input);
        }, time);

        return () => {
            clearTimeout(timeout);
        }
    }, [input])


    return debounceValue;
}


export function useReport({ accounts, dateEnd, dateStart, key, type, typeAccount }: useReportProps) {
    const { ReportEvents } = useContext(RequestContext);
    const { handleError } = useContext(NotificationContext);
    const AppDispatch = useAppDispatch();
    const queryclient = useQueryClient();

    return useQuery(['Events', key, type, dateStart, dateEnd], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }), {
        onError: error => {
            const Err = error as AxiosError;
            if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente")) {
                queryclient.clear();
                AppDispatch(logOut());
            }
            handleError(String(error) + '\n' + Err.message);
        },
    })
}

export function useMyAccounts() {
    const { GetMyAccount } = useContext(RequestContext);
    const { handleError } = useContext(NotificationContext);
    const AppDispatch = useAppDispatch();
    const queryclient = useQueryClient();

    return useQuery(['MyAccounts'], GetMyAccount, {
        onError: error => {
            const Err = error as AxiosError;
            if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente")) {
                queryclient.clear();
                AppDispatch(logOut());
            }
            handleError(String(error) + '\n' + Err.message);
        },
    });
}

export function useGroups() {
    const { GetGroups } = useContext(RequestContext);
    const { handleError } = useContext(NotificationContext);
    const AppDispatch = useAppDispatch();
    const queryclient = useQueryClient();

    return useQuery(['MyGroups'], GetGroups, {
        onError: error => {
            const Err = error as AxiosError;
            if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente")) {
                queryclient.clear();
                AppDispatch(logOut());
            }
            handleError(String(error) + '\n' + Err.message);
        },
    });
}
