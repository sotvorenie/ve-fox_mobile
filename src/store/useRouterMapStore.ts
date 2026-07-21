import {create} from "zustand";

interface RouterMapState {
    routerMap: string[]
    currentIndex: number

    setRouterMap: (map: string[]) => void
    addRoute: (path: string) => void
    goBack: () => string | null
    goForward: () => string | null
}

export const useRouterMapStore = create<RouterMapState>((set, get) => ({
    routerMap: [],
    currentIndex: -1,

    setRouterMap: (routerMap: string[]) => set({
        routerMap,
        currentIndex: routerMap.length - 1
    }),
    addRoute: (path) => set((state) => {
        if (state.routerMap[state.currentIndex] === path) return state

        const newStack = [...state.routerMap.slice(0, state.currentIndex + 1), path]
        return {
            routerMap: newStack,
            currentIndex: newStack.length - 1
        }
    }),
    goBack: () => {
        const { currentIndex, routerMap } = get()
        if (currentIndex > 0) {
            const nextIndex = currentIndex - 1
            set({ currentIndex: nextIndex })
            return routerMap[nextIndex]
        }
        return '/'
    },
    goForward: () => {
        const { currentIndex, routerMap } = get()
        if (currentIndex < routerMap.length - 1) {
            const nextIndex = currentIndex + 1
            set({ currentIndex: nextIndex })
            return routerMap[nextIndex]
        }
        return null
    },
}))