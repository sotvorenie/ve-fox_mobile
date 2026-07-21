export interface UserBase {
    id: number
    name: string
    avatar_url: string
}

export interface User extends UserBase {
    router_map: string[]
    search_history: string[]
}

export interface UserWithToken {
    user: User
    token: string
}

export interface Token {
    access_token: string
    token_type: string
}

export interface UserAvatar {
    new_avatar_url: string
}

export interface UserRouterMap {
    router_map: string
}