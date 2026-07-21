import {SuccessResponse} from "@/types/success";
import {VideosList} from "@/types/video";

import {apiGet, apiPost} from "@api/index";

export const apiSetToHistory = (videoId: number): Promise<SuccessResponse> => {
    return apiPost(`/history/set/${videoId}`)
}

export const apiGetHistory = (page: number = 1, limit: number = 21): Promise<VideosList> => {
    return apiGet(`/history/all?page=${page}&limit=${limit}`)
}