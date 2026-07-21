import {Video, VideosList} from "@/types/video";

import {apiGet} from "@api/index";


export const apiGetVideo = (id: number): Promise<Video> => {
    return apiGet(`/video/${id}`)
}

export const apiGetAllVideos = (page: number = 1, limit: number = 21, seed: number = 0.5): Promise<VideosList> => {
    return apiGet(`/video/all?page=${page}&limit=${limit}&seed=${seed}`)
}

export const apiGetRecommendedVideos = (video_id: number, page: number = 1, limit: number = 21): Promise<VideosList> => {
    return apiGet(`/video/recommended/${video_id}?page=${page}&limit=${limit}`)
}

export const apiGetVideosFromSection = (sectionId: number): Promise<VideosList> => {
    return apiGet(`/video/all_from_section/${sectionId}`)
}