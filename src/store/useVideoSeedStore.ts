import {create} from "zustand";

interface VideoSeedState {
    videoSeed: number

    setVideoSeed: (seed: number) => void
}

export const useVideoSeedStore = create<VideoSeedState>((set) => ({
    videoSeed: 0,

    setVideoSeed: (seed: number) => set({ videoSeed: seed }),
}))