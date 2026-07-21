import {UserWithToken} from "@/types/user";

import {apiPost, apiGet} from "@api/index";

export const apiAuth = (login: string, password: string): Promise<UserWithToken> => {
    return apiPost(`/auth/login`, {
        login,
        password
    })
}

export const apiRegister = (login: string, password: string, name: string): Promise<UserWithToken> => {
    return apiPost(`/auth/register`, {
        login,
        password,
        name
    })
}

export const apiCheckMe = (): Promise<UserWithToken> => {
    return apiGet('/auth/me')
}