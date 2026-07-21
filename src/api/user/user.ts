import {SuccessResponse} from "@/types/success";
import {UserAvatar, UserRouterMap} from "@/types/user";

import {apiGet, apiPost} from "@api/index";


export const apiRedactUserName = (name: string): Promise<SuccessResponse> => {
    return apiPost('/user/redact_name', {name})
}

export const apiCheckUserPassword = (password: string): Promise<SuccessResponse> => {
    return apiPost('/user/check_password', {password})
}

export const apiRedactUserPassword = (password: string): Promise<SuccessResponse> => {
    return apiPost('/user/redact_password', {password})
}

export const apiRedactUserAvatar = (file: File): Promise<UserAvatar> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiPost(`/user/redact_avatar`, formData)
}

export const apiSetUserRouterMap = (routerMap: string[]): Promise<SuccessResponse> => {
    return apiPost(`/user/set_router_map`, {
        router_map: JSON.stringify(routerMap)
    })
}

export const apiGetUserRouterMap = (): Promise<UserRouterMap> => {
    return apiGet(`/user/get_router_map`)
}