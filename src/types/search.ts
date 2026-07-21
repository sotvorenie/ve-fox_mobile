import {VideoForList} from "./video.ts";
import {Channel} from "./channel.ts";
import {Meta} from "./meta.ts";

export interface SearchResponse extends Meta{
    channels: Channel[];
    videos: VideoForList[];
}

export interface SearchHistoryResponse {
    search_history: string[]
}