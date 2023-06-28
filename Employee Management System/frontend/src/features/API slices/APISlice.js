// import { createAPI, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//  The base url of the api
const baseQuery = fetchBaseQuery({baseUrl : ''});

const apiSlice = createApi({
    baseQuery,
    tagTypes : [],
    endpoints : (builder) => ({})
});


export default apiSlice;