import { useReportProps } from "@/interface/hooks.interface";
import ReportService from "@/services/reports.service";
import useNotificationStore from "@/utils/notification.store";
import { useQuery } from "@tanstack/react-query";

export function useReport({ accounts, dateEnd, dateStart, key, type, typeAccount }: useReportProps) {
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

    const handleError = useNotificationStore(state => state.handleError);


    const query = useQuery({
        queryKey: ['Events', key, type, dateStart, dateEnd],
        queryFn: () => ReportService.ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }) // Placeholder function
    });

    if (query.isError) handleError(query.error.message);

    return query;
}