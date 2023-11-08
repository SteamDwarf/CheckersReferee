export function formatDate(dateString: string) {
    if(!dateString) return "Дата не указана";

    const date = new Date(dateString);
    const day = dateAddZero(date.getDate());
    const month = dateAddZero(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

function dateAddZero(number: number) {
    if(number < 10) return `0${number}`;
    return number;
}
