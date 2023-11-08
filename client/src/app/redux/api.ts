import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endpoints: builder => ({}),
    tagTypes: ['Tournament']
});