interface date {
    date: string;
    day: number;
    month: number;
    year: number;
}

interface time {
    time: string;
    hour: number;
    minute: number;
    second: number;
}

export interface formatDate {
    DATE: Date;
    daysInMonth: number;
    startDay: number;
    date: date;
    time: time;
}