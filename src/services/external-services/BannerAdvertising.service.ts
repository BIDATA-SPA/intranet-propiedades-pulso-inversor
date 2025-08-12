import { EndpointBuilderType } from '../core-entities/paginated-result.entity';
import { BannerAdvertising } from './types/banner-advertising.type';

export function getBannerAdvertisingQuery(builder: EndpointBuilderType) {
    return {
   
        getAllBanners: builder.query<BannerAdvertising[], void>({
            query: () => ({
                url: `banner-advertising`,
                method: 'get',
            }),
            providesTags: ['BannerAdvertising'] as any,
        }),
       
        getBannerById: builder.query<BannerAdvertising, string>({
            query: (id: string) => ({
                url: `banner-advertising/${id}`,
                method: 'get',
            }),
            providesTags: ['BannerAdvertising'] as any,
        }),

        getBannerImageByName: builder.query<string, string>({
            query: (name: string) => ({
                url: `banner-advertising/image/${name}`,
                method: 'get',
                responseHandler: (response) => response.blob().then((blob) => URL.createObjectURL(blob)),
            }),
            providesTags: ['BannerAdvertising'] as any,
        }),
    };
}
