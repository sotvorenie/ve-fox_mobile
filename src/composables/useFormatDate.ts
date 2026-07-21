import {months} from "@data/months";

export const formatDate = (str: string) => {
    if (!str) return "Неизвестно"

    const date = new Date(str);

    if (Number.isNaN(date.getTime())) {
        return "Неизвестно";
    }

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}г.`;
};