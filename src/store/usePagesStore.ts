import {create} from "zustand";

interface PagesState {
    page: number

    setPage: (page: number) => void
}

export const usePagesStore = create<PagesState>((set) => ({
    page: -1,

    setPage: (page: number) => set({page})
}))