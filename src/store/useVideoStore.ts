import {create} from "zustand";

import {Video, VideoForList, VideosList} from "@/types/video";

import {apiGetRecommendedVideos} from "@api/video/video";

interface VideoState {
    video: Video
    isLoading: boolean
    recommendedVideos: VideoForList[]
    recommendedIsLoading: boolean
    recommendedHasMore: boolean
    recommendedPage: number

    clearVideo: () => void
    setVideo: (video: Video) => void
    setIsLoading: (isLoading: boolean) => void
    getRecommendedVideos: (id: number) => Promise<void>
}

const emptyVideo: Video = {
    id: -1,
    name: '',
    path: '',
    video_url: '',
    date: '',
    duration: 0,
    preview_url: '',
    subtitle_url: '',
    views: 0,
    likes: 0,
    channel: {
        id: -1,
        name: '',
        avatar_url: '',
    }
}

export const useVideoStore = create<VideoState>((set, get) => ({
    video: emptyVideo,
    isLoading: true,
    recommendedVideos: [],
    recommendedIsLoading: true,
    recommendedHasMore: false,
    recommendedPage: 1,

    clearVideo: () => set({
        video: emptyVideo,
        recommendedVideos: [],
        isLoading: true,
        recommendedIsLoading: true,
        recommendedHasMore: false,
        recommendedPage: 1,
    }),
    setVideo: (video: Video) => set({video}),
    setIsLoading: (isLoading: boolean) => set({isLoading}),
    getRecommendedVideos: async (id: number) => {
        try {
            set({recommendedIsLoading: true})
            const data: VideosList = await apiGetRecommendedVideos(id, get().recommendedPage)

            if (data) {
                set({
                    recommendedVideos: [...get().recommendedVideos, ...data.videos],
                    recommendedHasMore: data.has_more,
                    recommendedPage: data.page + 1,
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            set({recommendedIsLoading: false})
        }
    }
}))