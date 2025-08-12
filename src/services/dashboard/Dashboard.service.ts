import { EndpointBuilderType } from "../core-entities/paginated-result.entity";
import {Dashboard, GetDashboard}from './types/dashboard.type';

export function getDashboardQuery(builder: EndpointBuilderType){
    return{
        getDashboard: builder.query<Dashboard, number>({
            query: () => ({
                url:'dashboard',
                method:'get',
            }),
            providesTags: ['Dashboard'] as any,
        })
    }
}