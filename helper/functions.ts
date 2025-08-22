import { formatDate } from "@/interface/helpers.interface";
import { Events, Key, TypeReport } from "@/interface/hooks.interface";

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
    return { day, month, year, formatted: year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0') };
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

export const getKeys: (report: TypeReport) => Key<Events>[] = report => {
    return report === 'ap-ci'
        ? [
            {
                label: 'Fecha - Hora',
                key: ['FechaOriginal', 'Hora'],
                size: 115,
                center: true,
            },
            {
                label: 'Partición',
                key: 'Particion',
                size: 73,
                center: true,
            },
            {
                label: 'Evento',
                key: 'DescripcionEvent',
                size: 120,
                center: true,
            },
            {
                label: 'Usuario',
                key: 'CodigoUsuario',
                size: 62,
                center: true,
            },
            {
                label: 'Nombre usuario',
                key: 'NombreUsuario',
                size: 300,
                center: true,
            },
        ]
        : report === 'event-alarm'
            ? [
                {
                    label: 'Fecha - Hora',
                    key: ['FechaOriginal', 'Hora'],
                    size: 115,
                    center: true,
                },
                {
                    label: 'Partición',
                    key: 'Particion',
                    size: 73,
                    center: true,
                },
                {
                    label: 'Evento',
                    key: 'DescripcionEvent',
                    size: 120,
                    center: true,
                },
                {
                    label: 'Usuario',
                    key: 'CodigoUsuario',
                    size: 62,
                    center: true,
                },
                {
                    label: 'Zona',
                    key: 'CodigoZona',
                    size: 40,
                    center: true,
                },
                {
                    label: 'Nombre',
                    key: ['NombreUsuario', 'DescripcionZona'],
                    size: 300,
                    center: true,
                },
            ]
            : report === 'apci-week'
                ? []
                : report === 'state'
                    ? [
                        {
                            label: 'Fecha Hora',
                            key: ['FechaOriginal', 'Hora'],
                            size: 200,
                            center: true,
                        },
                        {
                            label: 'Estado',
                            key: 'DescripcionAlarm',
                            size: 200,
                            center: true,
                        },
                        {
                            label: 'Usuario',
                            key: 'NombreUsuario',
                            size: 200,
                            center: true,
                        },
                    ]
                    : [];
};