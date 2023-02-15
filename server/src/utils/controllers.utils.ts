export const paginateData = (dataArray: any[], limit: number, page: number) => {
    const startInd = (page - 1) * limit;
    const endInd = limit * page;
    return dataArray.slice(startInd, endInd)
}