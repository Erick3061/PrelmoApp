import { CalendarState, date } from "@/interface/calendar.store";
import { StateCreator, create } from "zustand";

const CalendarStore: StateCreator<CalendarState> = (set, get) => ({
    show: false,
    setInitialDates: (dates: date[]) => set(state => ({ ...state, dates })),
    setCalendar: (calendarSelected?: string) => {
        const isExist = get().dates?.find(f => f.name === calendarSelected);
        if (isExist)
            set(state => ({ ...state, calendarSelected }))
        else
            set(state => ({ ...state, calendarSelected: undefined }))
    },
    onDelete: (name: string) => set(state => ({
        ...state,
        dates: get().dates?.map(dat => (dat.name === name) ? { name: name } : dat)
    })),
    onSelect: (date: date) => set(state => ({
        ...state,
        dates: get().dates?.map(dat => (dat.name === date.name) ? { name: dat.name, date: date.date } : dat),
        calendarSelected: undefined
    })),
});

const useCalendarStore = create<CalendarState>()(
    CalendarStore
);

export default useCalendarStore;