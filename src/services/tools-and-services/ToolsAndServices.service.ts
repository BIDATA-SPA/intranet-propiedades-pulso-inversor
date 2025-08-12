import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import {
  CreateToolsAndServicesBody,
  CreateToolsAndServicesFileBody,
  ToolsAndServives,
} from './types/tools-and-services'

export function getToolsAndServicesQuery(builder: EndpointBuilderType) {
  return {
    // Get all root folders
    getAllRootFolders: builder.query<
      PaginateResult<ToolsAndServives>,
      PaginateSearch & { paginated: boolean }
    >({
      query: ({ limit, page, paginated }) => ({
        url: `tools-and-services?limit=${limit}&page=${page}&paginated=${paginated}`,
        method: 'get',
      }),
      providesTags: ['ToolsAndServices'] as any,
    }),

    // create root folder
    createRootFolder: builder.mutation<
      ToolsAndServives,
      CreateToolsAndServicesBody | FormData
    >({
      query: (body) => ({
        url: 'tools-and-services',
        method: 'post',
        data: body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['ToolsAndServices'] as any,
    }),

    // create root file
    createRootFile: builder.mutation<
      ToolsAndServives,
      CreateToolsAndServicesFileBody | FormData
    >({
      query: (body) => ({
        url: 'tools-and-services/files',
        method: 'post',
        data: body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['ToolsAndServices'] as any,
    }),

    updateRootFolder: builder.mutation<
      ToolsAndServives,
      { id: string; data: Partial<CreateToolsAndServicesBody> | FormData }
    >({
      query: ({ id, data }) => {
        return {
          url: `tools-and-services/${id}`,
          method: 'patch',
          data: data,
          headers:
            data instanceof FormData
              ? { 'Content-Type': 'multipart/form-data' }
              : undefined,
        }
      },
      invalidatesTags: ['ToolsAndServices'] as any,
    }),

    getRootFolderById: builder.query<ToolsAndServives, string>({
      query: (id: string) => ({
        url: `tools-and-services/${id}`,
        method: 'get',
      }),
      providesTags: ['ToolsAndServices'] as any,
    }),
  }
}
