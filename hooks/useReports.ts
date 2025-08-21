import { useReportProps } from "@/interface/hooks.interface";

export function useReport({ accounts, dateEnd, dateStart, key, type, typeAccount }: useReportProps) {
    // const { ReportEvents } = useContext(RequestContext);
    // const { handleError } = useContext(NotificationContext);
    // const AppDispatch = useAppDispatch();
    // const queryclient = useQueryClient();

    // return useQuery(['Events', key, type, dateStart, dateEnd], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }), {
    //     onError: error => {
    //         const Err = error as AxiosError;
    //         if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente")) {
    //             queryclient.clear();
    //             AppDispatch(logOut());
    //         }
    //         handleError(String(error) + '\n' + Err.message);
    //     },
    // })
}