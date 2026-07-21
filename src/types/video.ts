import {ChannelForList} from "./channel.ts";
import {Meta} from "./meta.ts";

export interface VideoForList {
    id: number
    name: string
    date: string
    duration: number
    video_url: string
    preview_url: string
    subtitle_url: string
    channel: ChannelForList
    saved_time: number
    views: number
}

export interface Video {
    id: number
    name: string
    path: string
    video_url: string
    date: string
    duration: number
    preview_url: string
    subtitle_url: string
    channel: ChannelForList
    views: number
    likes: number
}

export interface VideosList extends Meta {
    videos: VideoForList[]
}