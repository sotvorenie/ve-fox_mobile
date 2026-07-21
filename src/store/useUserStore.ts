import {create} from "zustand";

import {User, UserWithToken} from "@/types/user";

import {apiCheckMe} from "@api/auth/auth";

interface UserState {
    isLogged: boolean
    user: User
    token: string

    updateUser: (fields: Partial<User>) => void
    setToken: (token: string) => void
    setIsLogged: (isLogged: boolean) => void

    logIn: (data: UserWithToken) => void
    logOut: () => void
    checkMe: () => Promise<void>
}

const emptyUser: User = {
    id: -1,
    name: '',
    avatar_url: '',
    router_map: [],
    search_history: [],
}

export const useUserStore = create<UserState>((set, get) => ({
    isLogged: false,
    user: emptyUser,
    token: '',

    setToken: (token: string) => set({token}),
    setIsLogged: (isLogged: boolean) => set({isLogged}),
    updateUser: (fields: Partial<User>) => set((state) => ({
        user: { ...state.user, ...fields }
    })),

    logIn: (data: UserWithToken) => {
        localStorage.setItem("token", data.token)
        set({
            user: data.user,
            token: data.token,
            isLogged: true
        })
    },
    logOut: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('router-map')
        localStorage.removeItem('has-router-map')
        set({
            user: {
                id: -1,
                name: '',
                avatar_url: '',
                router_map: [],
                search_history: [],
            },
            isLogged: false,
            token: ''
        })
    },
    checkMe: async () => {
        const token: string = localStorage.getItem("token") || ''
        if (!token) {
            set({isLogged: false})
            return
        }
        try {
            const data: UserWithToken = await apiCheckMe()
            get().logIn(data)
        } catch (err) {
            console.error(err)
            set({isLogged: false})
        }
    }
}))