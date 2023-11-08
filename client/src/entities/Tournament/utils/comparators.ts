import { ITournament } from "../types/interfaces";

export const compareByEndDate = (t1: ITournament, t2:ITournament) => {
    if(!t1.endDate || !t2.endDate) return compareByStartDate(t1, t2);

    return t2.endDate.localeCompare(t1.endDate);
}

export const compareByStartDate = (t1: ITournament, t2: ITournament) => {
    if(!t1.startDate || !t2.startDate) return compareByTitle(t1, t2);

    return t2.startDate.localeCompare(t1.startDate);
}

export const compareByTitle = (t1: ITournament, t2: ITournament) => {
    return t2.title.localeCompare(t1.title);
}