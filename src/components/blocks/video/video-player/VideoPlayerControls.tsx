import React, {useRef, forwardRef, useImperativeHandle} from "react";

import {formatVideoTime} from "@composables/useFormatVideoTime.ts";

import VideoPlayButton from "@video/VideoPlayButton.tsx";

import SettingsIcon from "@icons/video-player/SettingsIcon.tsx";
import ReduceIcon from "@icons/video-player/ReduceIcon.tsx";
import ExpandIcon from "@icons/video-player/ExpandIcon.tsx";

import {usePlayerStore} from "@store/usePlayerStore.ts";

interface Props {
    setIsShowSettings: (value: any) => void
    setIsMoving: (value: any) => void
    progress: number
    updateVideoTime: (value: any) => void
    videoRef: React.RefObject<HTMLVideoElement | null>
}
export interface ControlsHandles {
    timeline: HTMLDivElement | null
    settingsBtn: HTMLButtonElement | null
}

const VideoPlayerControls = forwardRef<ControlsHandles, Props>((props, ref) => {
    const { videoRef, progress, setIsMoving, updateVideoTime, setIsShowSettings } = props
    
    const timelineRef = useRef<HTMLDivElement>(null)
    const settingsBtnRef = useRef<HTMLButtonElement | null>(null)
    useImperativeHandle(ref, () => ({
        timeline: timelineRef.current,
        settingsBtn: settingsBtnRef.current,
    }), [])

    const {
        isPlaying,
        isFullscreen,
        currentTime,
        duration,
    } = usePlayerStore()
    const {toggleIsFullscreen, toggleIsPlaying} = usePlayerStore()

    const touchStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (!videoRef.current || !timelineRef.current) return

        setIsMoving(true)
        updateVideoTime(e)
    }

    return (
        <>
            <VideoPlayButton className='video-player__play-btn absolute-center'
                             isPlaying={isPlaying}
                             setIsPlaying={toggleIsPlaying}
            />

            <div className="video-player__bottom">
                <span className="video-player__duration text-nowrap position-absolute">
                    {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                </span>

                <button className="video-player__btn video-player__btn-settings recolor-svg i-svg z-1000 position-absolute"
                        type="button"
                        onClick={() => setIsShowSettings(true)}
                        ref={settingsBtnRef}
                >
                    <SettingsIcon/>
                </button>

                <button className="video-player__btn video-player__btn-fullscreen recolor-svg i-svg z-1000 position-absolute"
                        type="button"
                        onClick={() => toggleIsFullscreen()}
                >
                    {isFullscreen ? <ReduceIcon/> : <ExpandIcon/>}
                </button>

                <div className="video-player__timeline cursor-pointer w-100 position-absolute bottom-0 z-1000"
                     ref={timelineRef}
                     style={{'--progress': `${progress}%`} as React.CSSProperties}
                     onTouchStart={touchStart}
                >
                    <div className="video-player__timeline-inner position-relative">
                        <div className="line w-100"/>
                        <div className="thumb position-absolute"/>
                    </div>
                </div>
            </div>
        </>
    )
})

export default VideoPlayerControls;