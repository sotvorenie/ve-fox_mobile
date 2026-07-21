import React from "react";

import {formatVideoTime} from "@composables/useFormatVideoTime.ts";

import VideoPlayButton from "@video/VideoPlayButton.tsx";

import SoundOnIcon from "@icons/video-player/SoundOnIcon.tsx";
import SoundOffIcon from "@icons/video-player/SoundOffIcon.tsx";
import TimePrevIcon from "@icons/video-player/TimePrevIcon.tsx";
import TimeNextIcon from "@icons/video-player/TimeNextIcon.tsx";

import {usePlayerStore} from "@store/usePlayerStore.ts";

interface Props {
    videoRef: React.RefObject<HTMLVideoElement | null>
}

function VideoPlayerButtons({videoRef}: Readonly<Props>) {
    const {
        isPlaying,
        volume,
        oldVolume,
        currentTime,
        duration
    } = usePlayerStore()
    const {
        setIsPlaying,
        setOldVolume,
        setVolume
    } = usePlayerStore()

    // изменение уровня громкости
    const handleVolume = () => {
        if (volume > 0) {
            localStorage.setItem('volume', '0')
            setOldVolume(volume)
            setVolume(0)
        } else {
            localStorage.setItem('volume', JSON.stringify(oldVolume))
            setVolume(oldVolume)
        }
    }
    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem('volume', JSON.stringify(e.target.value))
        setVolume(Number.parseFloat(e.target.value))
    }

    // +- 10 секунд
    const setPlus10Sec = () => {
        if (!videoRef?.current) return

        videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
    }
    const setMinus10Sec = () => {
        if (!videoRef.current) return

        videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
    }

    return (
        <div className="video-player__left flex flex-align-center">
            <VideoPlayButton className="video-player__line-play video-player__line-item"
                             isPlaying={isPlaying}
                             setIsPlaying={setIsPlaying}
            />

            <div className="video-player__volume video-player__background flex">
                <button className="video-player__line-item recolor-svg i-svg"
                        type="button"
                        title="Настройки звука"
                        onClick={handleVolume}
                >
                    {volume > 0 ? <SoundOnIcon/> : <SoundOffIcon/>}
                </button>

                <input type="range"
                       min={0}
                       max={1}
                       step={0.1}
                       value={volume}
                       onChange={changeVolume}
                       style={{'--fill-percent': `${volume * 100}%`} as React.CSSProperties}
                />
            </div>

            <button
                className="video-player__prev-10 video-player__line-item video-player__background recolor-svg i-svg"
                type="button"
                title="На 10 секунд назад"
                onClick={setMinus10Sec}
            >
                <TimePrevIcon/>
            </button>

            <button
                className="video-player__next-10 video-player__line-item video-player__background recolor-svg i-svg"
                type="button"
                title="На 10 секунд вперед"
                onClick={setPlus10Sec}
            >
                <TimeNextIcon/>
            </button>

            <span
                className="video-player__duration video-player__line-item video-player__background">
                                {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                            </span>
        </div>
    )
}

export default VideoPlayerButtons;