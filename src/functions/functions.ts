
import Values from 'values.js';
import { formatDate, Events, Key, Account, TonalPalette } from '../interface/interface';
import { TypeReport } from "../types/types";
import Color from 'color';

export const hextToRgb = (hex: string) => {
    const con: RegExpMatchArray | null = hex.replace('#', '').match(/.{1,2}/g);
    if (!con) return '0,0,0';

    return `${parseInt(con[0], 16)},${parseInt(con[1], 16)},${parseInt(con[2], 16)}`
}

export const getDate = (): formatDate => {
    const newDate: Date = new Date();
    const [day, month, year]: Array<string> = newDate.toLocaleDateString("es-MX", {
        year: 'numeric', month: 'numeric', day: 'numeric'
    }).split('/');
    const date: string = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const time: string = `${newDate.toTimeString().slice(0, 8)}`;
    const [hour, minute, second]: Array<number> = time.split(':').map(m => parseInt(m));
    const json: string = `${date}T${time}.000Z`;
    const dateGenerated: Date = new Date(json);
    const weekday = dateGenerated.getDay();
    return {
        DATE: dateGenerated,
        date: { date, day: parseInt(day), month: parseInt(month), year: parseInt(year) },
        time: { time, hour, minute, second },
        weekday
    };
}

export const modDate = ({ hours, minutes, seconds, dateI, days, months }: { dateI?: Date, seconds?: number, minutes?: number, hours?: number, days?: number, months?: number }): formatDate => {
    const newDate = (dateI) ? new Date(dateI.toJSON()) : getDate().DATE;
    (hours) && newDate.setHours(newDate.getHours() + hours);
    (minutes) && newDate.setMinutes(newDate.getMinutes() + minutes);
    (seconds) && newDate.setSeconds(newDate.getSeconds() + seconds);
    (days) && newDate.setDate(newDate.getDate() + days);
    (months) && newDate.setMonth(newDate.getMonth() + months);
    const [date, time] = newDate.toJSON().split('.')[0].split('T');
    const [year, month, day]: Array<number> = date.split('-').map(m => parseInt(m));
    const [hour, minute, second]: Array<number> = time.split(':').map(m => parseInt(m));
    const weekday = newDate.getDay();
    return {
        DATE: newDate,
        date: { date, day, month, year },
        time: { time, hour, minute, second },
        weekday
    };
}

export const getDay: (day: number) => string = (day) => {
    switch (day) {
        case 0: return 'lunes';
        case 1: return 'martes';
        case 2: return 'miércoles';
        case 3: return 'jueves';
        case 4: return 'viernes';
        case 5: return 'sábado';
        case 6: return 'domingo';
        default: 'no existe';
    }
    return 'no existe';
}

export const getKeysAccount: (report: TypeReport) => Array<Key<Account>> = (report) => {
    return (report === 'batery')
        ?
        [
            {
                label: 'Nombre',
                key: 'nombre',
                size: 102,
                center: true
            },
            {
                label: 'Número de eventos',
                key: 'numeroEventos',
                size: 102,
                center: true
            },
            {
                label: 'Estado',
                key: 'estado',
                size: 102,
                center: true
            },
        ] : []
}

export const getKeys: (report: TypeReport) => Array<Key<Events>> = (report) => {
    return (report === 'ap-ci')
        ?
        [
            {
                label: 'Fecha - Hora',
                key: ['FechaOriginal', 'Hora'],
                size: 115,
                center: true
            },
            {
                label: 'Partición',
                key: 'Particion',
                size: 73,
                center: true
            },
            {
                label: 'Evento',
                key: 'DescripcionEvent',
                size: 120,
                center: true
            },
            {
                label: 'Usuario',
                key: 'CodigoUsuario',
                size: 62,
                center: true
            },
            {
                label: 'Nombre usuario',
                key: 'NombreUsuario',
                size: 300,
                center: true
            },
        ]
        : (report === 'event-alarm')
            ?
            [
                {
                    label: 'Fecha - Hora',
                    key: ['FechaOriginal', 'Hora'],
                    size: 115,
                    center: true
                },
                {
                    label: 'Partición',
                    key: 'Particion',
                    size: 73,
                    center: true
                },
                {
                    label: 'Evento',
                    key: 'DescripcionEvent',
                    size: 120,
                    center: true
                },
                {
                    label: 'Usuario',
                    key: 'CodigoUsuario',
                    size: 62,
                    center: true
                },
                {
                    label: 'Zona',
                    key: 'CodigoZona',
                    size: 40,
                    center: true
                },
                {
                    label: 'Nombre',
                    key: ['NombreUsuario', 'DescripcionZona'],
                    size: 300,
                    center: true
                },
            ]
            : (report === 'apci-week')
                ?
                [

                ]
                : (report === 'state')
                    ?
                    [
                        {
                            label: 'Fecha Hora',
                            key: ['FechaOriginal', 'Hora'],
                            size: 200,
                            center: true
                        },
                        {
                            label: 'Estado',
                            key: 'DescripcionAlarm',
                            size: 200,
                            center: true
                        },
                        {
                            label: 'Usuario',
                            key: 'NombreUsuario',
                            size: 200,
                            center: true
                        },
                    ]
                    : [];
}
/**
 * 
 * @param color Color a obtener tonos Material Desing 3
 * @returns Retorna un objeto de tipo TonalPalette o un arreglo de stings de tamaño 13
 */
export const getMD3 = (color: string): { arrTonals: Array<string>, tonals: TonalPalette } => {
    let tonals: any = {};
    const values = new Values(color);
    const colorValues: Array<string> = values.all(20).reverse().map(c => c.hexString());
    let test: Array<string> = new Array(11).fill(0).map((_, idx) => Color(color).lightness(idx * 10).hexa().toString());
    let arrTonals: Array<string> = [...colorValues.slice(0, 6), ...test.slice(4, test.length)];
    arrTonals[arrTonals.length - 3] = Color(arrTonals[arrTonals.length - 3]).lightness(82).hexa().toString();
    arrTonals[arrTonals.length - 2] = Color(arrTonals[arrTonals.length - 2]).lightness(97).hexa().toString();
    arrTonals.forEach((color, idx) => tonals[`T-${(idx === 10) ? 95 : (idx === 11) ? 99 : (idx === 12) ? 100 : idx * 10}`] = color);
    return {
        arrTonals,
        tonals
    }
}