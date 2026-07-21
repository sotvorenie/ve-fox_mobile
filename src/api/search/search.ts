import {SearchHistoryResponse, SearchResponse} from "@/types/search";
import {SuccessResponse} from "@/types/success.ts";

import {apiGet, apiPost} from "@api/index";

export const apiSearch = (title: string, page: number): Promise<SearchResponse> => {
    return apiGet(`/search?value=${title}&page=${page}`)
}

export const apiGetSearchHistory = (): Promise<SearchHistoryResponse> => {
    return apiGet(`/search/get_history`)
}

export const apiSetSearchHistory = (search: string): Promise<SuccessResponse> => {
    return apiPost(`/search/set_history`, {
        search
    })
}

export const apiDeleteFromSearchHistory = (search: string): Promise<SuccessResponse> => {
    return apiPost(`/search/delete_from_history`, {
        search
    })
}