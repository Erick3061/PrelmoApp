import { StyleProp, TextStyle } from "react-native";
import { formatDate } from "./helpers.interface";

/**Interface */
interface CalendarActions {
    setInitialDates: (dates: date[]) => void;
    setCalendar: (calendar?: string) => void;
    onDelete: (name: string) => void;
    onSelect: (date: date) => void;
}

export interface Props {
    calendars: { label: string, date: Date }[];
    height?: number;
    textColor?: string;
    backgroundColor?: string;
    colorOutline?: string;
    limitDays?: number;
    Textstyle?: StyleProp<TextStyle>;
    hideInputs?: boolean;
    onChange: (dates: { name: string, date?: formatDate }[]) => void;
}

export interface date {
    name: string;
    date?: formatDate;
}

export interface CalendarState extends CalendarActions {
    dates?: date[];
    calendarSelected?: string;
}