import {create} from "zustand";

import {ChannelForList} from "@/types/channel";
import {VideoForList} from "@/types/video";
import {SearchResponse} from "@/types/search";

import {apiSearch, apiSetSearchHistory} from "@api/search/search";

import {useUserStore} from "@store/useUserStore.ts";

interface SearchState {
    value: string
    page: number
    isLoading: boolean
    total: number
    channels: ChannelForList[]
    videos: VideoForList[]
    hasMore: boolean
    history: string[]

    setValue: (value: string) => void
    search: () => Promise<void>
    addToHistory: (value: string) => void
    setHistory: (value: any) => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
    value: '',
    page: 1,
    isLoading: true,
    total: 0,
    channels: [],
    videos: [],
    hasMore: false,
    history: [],

    setValue: (value: string) => set({value}),
    search: async (page: number = 1) => {
        const value = get().value

        if (!value.trim()) return

        try {
            set({isLoading: true})

            const data: SearchResponse = await apiSearch(value, page)
            if (data) {
                set({
                    channels: data.channels,
                    videos: data.videos,
                    hasMore: data.has_more,
                    total: data.total,
                    page: data.page + 1
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            set({isLoading: false})
        }

        if (useUserStore.getState().isLogged) {
            await apiSetSearchHistory(value)
        } else {
            const rawHistory: string[] = JSON.parse(localStorage.getItem("search-history") ?? '[]')
            const historySet = new Set(rawHistory)
            historySet.delete(value)
            const newHistory = [value, ...Array.from(historySet)]
            localStorage.setItem('search-history', JSON.stringify(newHistory.slice(0, 10)))
        }

        get().addToHistory(value)
    },
    addToHistory: (value: string) => set((state) => {
        const historySet = new Set(state.history)
        historySet.delete(value)
        const newHistory = [value, ...Array.from(historySet)]
        return { history: newHistory.slice(0, 10) }
    }),
    setHistory: (value: string[]) => set({history: value}),
}))