import {SuccessResponse} from "@/types/success";
import {SaveTime} from "@/types/saveTime";

import {apiGet, apiPost} from "@api/index";

export const apiSaveTime = (videoId: number, time: number): Promise<SuccessResponse> => {
    return apiPost(`/save_time/set/${videoId}`, {time})
}

export const apiGetSavedTime = (videoId: number): Promise<SaveTime> => {
    return apiGet(`/save_time/get/${videoId}`)
}

export const apiDeleteSavedTime = (videoId: number): Promise<SuccessResponse> => {
    return apiPost(`/save_time/delete/${videoId}`)
}