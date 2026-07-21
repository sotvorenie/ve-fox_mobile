import {LikeResponse} from "@/types/like";
import {VideosList} from "@/types/video";

import {apiGet, apiPost} from "@api/index";

export const apiLike = (videoId: number): Promise<LikeResponse> => {
    return apiPost(`/like/${videoId}`)
}

export const apiCheckIsLiked = (videoId: number): Promise<LikeResponse> => {
    return apiGet(`/like/is_liked/${videoId}`)
}

export const apiGetListLikes = (page: number = 1, limit: number = 21): Promise<VideosList> => {
    return apiGet(`/like/all?page=${page}&limit=${limit}`)
}