import { formatDate } from "@/interface/helpers.interface";

interface ModDate {
    dateI: Date;
    addDay?: number;
    addHour?: number;
    addMinute?: number;
    addMonth?: number;
    addSecond?: number;
    Day?: number;
    Hours?: number;
    Minutes?: number;
    Month?: number;
    Seconds?: number;
    Year?: number;
}

function parseDateParts(date: Date) {
    const formatted = new Intl.DateTimeFormat("es-MX").format(date);
    const [day, month, year] = formatted.split('/').map(Number);
    return { day, month, year, formatted };
}

function parseTimeParts(date: Date) {
    const timeStr = date.toTimeString().slice(0, 8);
    const [hour, minute, second] = timeStr.split(':').map(Number);
    return { hour, minute, second, timeStr };
}

export const getDate = (dateIn?: Date): formatDate => {
    const dateObj = dateIn ? new Date(dateIn) : new Date();
    const { day, month, year, formatted } = parseDateParts(dateObj);
    const { hour, minute, second, timeStr } = parseTimeParts(dateObj);
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDay = new Date(year, month - 1, 1).getDay();
    return {
        DATE: dateObj,
        daysInMonth,
        startDay,
        date: { date: formatted, day, month, year },
        time: { time: timeStr, hour, minute, second },
    };
};


export const modDate = (params: ModDate): formatDate => {
    const {
        dateI, addDay, addHour, addMinute, addMonth, addSecond,
        Day, Hours, Minutes, Month, Seconds, Year
    } = params;
    const newDate = new Date(dateI);
    if (addDay !== undefined) newDate.setDate(newDate.getDate() + addDay);
    if (addHour !== undefined) newDate.setHours(newDate.getHours() + addHour);
    if (addMinute !== undefined) newDate.setMinutes(newDate.getMinutes() + addMinute);
    if (addMonth !== undefined) newDate.setMonth(newDate.getMonth() + addMonth);
    if (addSecond !== undefined) newDate.setSeconds(newDate.getSeconds() + addSecond);
    if (Day !== undefined) newDate.setDate(Day);
    if (Hours !== undefined) newDate.setHours(Hours);
    if (Minutes !== undefined) newDate.setMinutes(Minutes);
    if (Month !== undefined) newDate.setMonth(Month);
    if (Seconds !== undefined) newDate.setSeconds(Seconds);
    if (Year !== undefined) newDate.setFullYear(Year);
    return getDate(newDate);
};