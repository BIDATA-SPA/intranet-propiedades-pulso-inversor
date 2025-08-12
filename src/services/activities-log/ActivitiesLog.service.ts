import { EndpointBuilderType } from "../core-entities/paginated-result.entity";
import { Activities, GetActivities } from "./types/activities.type";

export function getActivitiesLog(builder: EndpointBuilderType){
    return {
        getActivities: builder.query<Activities, number>({
            query: () => ({
                url:'user-history',
                method:'get',
            }),
            providesTags: ['Activities'] as any,
        })
    }
}