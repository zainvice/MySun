import { apiSlice } from "../../app/api/apiSlice"
import { logOut } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        loginC: builder.mutation({
            query: credentials => ({
                url: '/auth/loginC',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        resetRequest: builder.mutation({
            query: credentials => ({
                url: '/api/v1/auth/requestResetPassword',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        signup: builder.mutation({
            query: credentials => ({
                url: '/auth/signup',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    //const { data } = await queryFulfilled
                    await queryFulfilled
                    //cosole.log(data)
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
                }catch(err){
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation ({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            })
        }),
        refreshC: builder.mutation ({
            query: () => ({
                url: '/auth/refreshC',
                method: 'GET'
            })
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useLoginCMutation,
    useSignupMutation,
    useRefreshCMutation,
    useResetRequestMutation
} = authApiSlice