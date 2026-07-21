export interface ChannelForList {
    id: number
    name: string
    avatar_url: string
}

export interface Channel {
    id: number
    name: string
    path: string
    avatar_url: string
    date: string
}

export interface ChannelsListResponse {
    channels: ChannelForList[]
    total: number
}