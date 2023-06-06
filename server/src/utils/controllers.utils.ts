//TODO удалить
export const paginateData = <T>(dataArray: T[], limit: number, page: number) => {
    const startInd = (page - 1) * limit;
    const endInd = limit * page;
    return dataArray.slice(startInd, endInd)
}