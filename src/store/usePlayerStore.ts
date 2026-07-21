import {create} from "zustand";

interface PlayerState {
    isPlaying: boolean
    volume: number
    oldVolume: number
    isShowSettings: boolean
    isShowControls: boolean
    duration: number
    currentTime: number
    isFullscreen: boolean
    isMiniPlayer: boolean
    isMoving: boolean

    setIsPlaying: (value: boolean) => void
    toggleIsPlaying: () => void
    setVolume: (volume: number) => void
    setOldVolume: (volume: number) => void
    setDuration: (duration: number) => void
    setCurrentTime: (currentTime: number) => void
    setIsShowSettings: (value: boolean) => void
    setIsShowControls: (value: boolean) => void
    setIsFullscreen: (value: boolean) => void
    toggleIsFullscreen: () => void
    setIsMiniPlayer: (value: boolean) => void
    setIsMoving: (value: boolean) => void

    clearData: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    volume: 1,
    oldVolume: 1,
    isShowSettings: false,
    isShowControls: true,
    duration: 0,
    currentTime: 0,
    isFullscreen: false,
    isMiniPlayer: false,
    isMoving: false,

    setIsPlaying: (value: boolean) => set({isPlaying: value}),
    toggleIsPlaying: () => set((state) => ({isPlaying: !state.isPlaying})),
    setVolume: (volume: number) => set({volume: volume}),
    setOldVolume: (volume: number) => set({oldVolume: volume}),
    setDuration: (duration: number) => set({duration: duration}),
    setCurrentTime: (currentTime: number) => set({currentTime: currentTime}),
    setIsShowSettings: (value: boolean) => set({isShowSettings: value}),
    setIsShowControls: (value: boolean) => set({isShowControls: value}),
    setIsFullscreen: (value: boolean) => set({isFullscreen: value}),
    toggleIsFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
    clearData: () => {
        set({
            isPlaying: true,
            currentTime: 0,
            isShowControls: true,
            isShowSettings: false
        })
    },
    setIsMiniPlayer: (value: boolean) => set({isMiniPlayer: value}),
    setIsMoving: (value: boolean) => set({isMoving: value}),
}))