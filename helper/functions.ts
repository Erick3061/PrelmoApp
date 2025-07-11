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

export const getDate = (dateIn?: Date): formatDate => {
    try {
        const newDate = dateIn ?? new Date();
        const date = new Intl.DateTimeFormat("es-MX").format(newDate);
        const time = newDate.toTimeString().slice(0, 8);
        const Adate = date.split('/').map(value => +value);
        const Atime = time.split(':').map(value => +value);
        const daysInMonth = new Date(Adate[2], Adate[1], 0).getDate();
        const startDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1).getDay();
        return {
            DATE: newDate,
            daysInMonth,
            startDay,
            date: { date, day: Adate[0], month: Adate[1], year: Adate[2] },
            time: { time, hour: Atime[0], minute: Atime[1], second: Atime[2] },
        };
    } catch (error) {
        return getDate();
    }
}

export const modDate = ({ dateI, Day, Month, Year, Seconds, Minutes, Hours, addMonth, addDay, addSecond, addMinute, addHour }: ModDate): formatDate => {
    const newDate = dateI;
    (addDay !== undefined) && newDate.setDate(newDate.getDate() + addDay);
    (addHour !== undefined) && newDate.setHours(newDate.getHours() + addHour);
    (addMinute !== undefined) && newDate.setMinutes(newDate.getMinutes() + addMinute);
    (addMonth !== undefined) && newDate.setMonth(newDate.getMonth() + addMonth);
    (addSecond !== undefined) && newDate.setSeconds(newDate.getSeconds() + addSecond);
    (Day !== undefined) && newDate.setDate(Day);
    (Hours !== undefined) && newDate.setHours(Hours);
    (Minutes !== undefined) && newDate.setMinutes(Minutes);
    (Month !== undefined) && newDate.setMonth(Month);
    (Seconds !== undefined) && newDate.setSeconds(Seconds);
    (Year !== undefined) && newDate.setFullYear(Year);
    return getDate(newDate);
}