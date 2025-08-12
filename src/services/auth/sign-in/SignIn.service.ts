import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'
import { SignInRequest, SignInResponse } from './types/sign-in.type'

export function getAuthSignInQuery(builder: EndpointBuilderType) {
  return {
    signInAdmin: builder.mutation<SignInResponse, SignInRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        data: {
          username: credentials.username,
          password: credentials.password,
          grant_type: credentials.grant_type || '',
        },
      }),
    }),
  }
}
