import {Video} from "@/types/video";

import {apiPost} from "@api/index";

export const apiUploadVideo = (
    video: File,
    title: string,
    tags: string[],
    channelId: number,
    sectionId?: number,
    preview?: File,
    signal?: AbortSignal,
    onProgress?: (percent: number) => void,
): Promise<Video> => {
    const formData = new FormData()
    formData.append('video', video)
    formData.append('title', title)
    formData.append('channel_id', String(channelId))
    tags.forEach((tag: string) => formData.append('tags', tag))

    if (sectionId) formData.append('section_id', String(sectionId))
    if (preview) formData.append('preview', preview)

    return apiPost(`/upload/video`, formData, undefined, signal, onProgress)
}