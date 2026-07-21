import React, {useEffect, useRef, useState} from "react";

import {BASE_URL} from "@api/url";

import {apiDeleteSavedTime, apiSaveTime} from "@api/save_time/saveTime";

import VideoPlayerSettings from "@video/video-player/VideoPlayerSettings.tsx";
import VideoPlayerControls, {ControlsHandles} from "@video/video-player/VideoPlayerControls.tsx";
import VideoPlayerRecommended from "@video/video-player/VideoPlayerRecommended.tsx";

import {useVideoStore} from "@store/useVideoStore";
import {usePlayerStore} from "@store/usePlayerStore";
import {useUserStore} from "@store/useUserStore";

interface Props {
    savedTime: number
}

function VideoPlayer({savedTime}: Readonly<Props>) {
    const {video} = useVideoStore()

    const {
        isPlaying,
        isShowSettings,
        isShowControls,
        isFullscreen,
        duration,
        isMiniPlayer,
    } = usePlayerStore();
    const {
        setIsPlaying,
        toggleIsPlaying,
        setDuration,
        setCurrentTime,
        setIsShowControls,
        setIsShowSettings,
        clearData
    } = usePlayerStore();
    const {isLogged} = useUserStore();

    const [isMoving, setIsMoving] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)

    const [isRecommendedOpen, setIsRecommendedOpen] = useState<boolean>(false)

    const sectionRef = useRef<HTMLElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const controlsRef = useRef<ControlsHandles>(null)

    const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const cursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const saveTimeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const isPlayingRef = useRef(isPlaying)

    // при загрузке метаданных видео
    const loadedMetadata = () => {
        if (!videoRef.current) return

        setDuration(videoRef.current.duration)
    }

    // обновляем progress для timeline
    const updateTimeline = (e: React.SyntheticEvent<HTMLVideoElement, Event>): void => {
        if (!videoRef.current || !controlsRef.current?.timeline) return
        if (isMoving) return

        setCurrentTime(e.currentTarget.currentTime)
        setProgress((e.currentTarget.currentTime / videoRef.current.duration) * 100)
    }

    // перемещение timeline
    const updateVideoTime = (e: TouchEvent) => {
        if (!controlsRef.current?.timeline || !videoRef.current) return

        const rect = controlsRef.current.timeline.getBoundingClientRect()
        const clientX = e.touches[0].clientX
        let percent: number = (clientX - rect.left) / rect.width
        percent = Math.min(Math.max(percent, 0), 1)
        setProgress(percent * 100)
        videoRef.current.currentTime = percent * duration
    }

    useEffect(() => {
        clearData()

        if (videoRef.current) {
            const timerTime: number = video.duration >= 600 ? 60000 : 30000

            if (saveTimeTimer.current) clearTimeout(saveTimeTimer.current)

            saveTimeTimer.current = setInterval(() => {
                if (isPlayingRef.current && isLogged) {
                    apiSaveTime(video.id, videoRef.current!.currentTime).then()
                }
            }, timerTime)

            return () => {
                if (saveTimeTimer.current) clearTimeout(saveTimeTimer.current)
                if (video.id >= 0) {
                    const duration = +usePlayerStore.getState().duration
                    const currentTime = +usePlayerStore.getState().currentTime

                    const differenceTime = duration - currentTime
                    const threshold = Math.max(duration * 0.07, 30)
                    const isFinished = differenceTime < threshold
                    if (isFinished) {
                        apiDeleteSavedTime(video.id).then()
                    } else {
                        apiSaveTime(video.id, currentTime).then()
                    }
                }
            }
        }
    }, [video.id])

    useEffect(() => {
        if (!videoRef.current) return

        const videoElement = videoRef.current
        const playVideo = async () => {
            try {
                if (videoElement.paused && isPlaying) {
                    await videoElement.play()
                } else if (!videoElement.paused && !isPlaying) {
                    videoElement.pause()
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error("Video playback error:", err)
                }
            }
        }
        playVideo().then()

        setIsShowControls(true)

        const moveCursor = () => {
            setIsShowControls(true)

            if (cursorTimer.current) clearTimeout(cursorTimer.current)
            cursorTimer.current = setTimeout(() => {
                setIsShowControls(false)
            }, 2000)
        }

        if (isPlaying && !isShowSettings) {
            if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
            hideControlsTimer.current = setTimeout(() => {
                setIsShowControls(false)
            }, 2000)

            sectionRef.current?.addEventListener('click', moveCursor)
        } else {
            setIsShowControls(true)
        }

        return () => {
            if (hideControlsTimer.current && cursorTimer.current) {
                clearTimeout(hideControlsTimer.current)
                clearTimeout(cursorTimer.current)
            }
            sectionRef.current?.removeEventListener('click', moveCursor)
        }
    }, [isPlaying, isShowSettings, isFullscreen, video.id])

    useEffect(() => {
        const touchMove = (e: TouchEvent) => {
            if (!videoRef.current || !controlsRef.current?.timeline) return
            if (!isMoving) return

            updateVideoTime(e)
        }
        const touchEnd = () => {
            if (!videoRef.current || !controlsRef.current?.timeline) return

            setIsMoving(false)
            setCurrentTime(videoRef.current.currentTime)
        }

        if (isMoving) {
            globalThis.addEventListener('touchmove', touchMove)
            globalThis.addEventListener('touchend', touchEnd)
        }

        return () => {
            globalThis.removeEventListener('touchmove', touchMove)
            globalThis.removeEventListener('touchend', touchEnd)
        }
    }, [isMoving])

    useEffect(() => {
        const closeSettings = () => {
            setIsShowSettings(false)
        }

        if (isShowSettings) {
            const timer = setTimeout(() => {
                globalThis.addEventListener('click', closeSettings)
            }, 0)

            return () => {
                clearTimeout(timer)
                globalThis.removeEventListener('click', closeSettings)
            }
        } else if (controlsRef.current?.settingsBtn) {
            controlsRef.current.settingsBtn.blur()
        }
    }, [isShowSettings])

    useEffect(() => {
        isPlayingRef.current = isPlaying
    }, [isPlaying])

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = savedTime
        }
    }, [savedTime])

    return (
        <section className={
                    `video-player position-relative
                    ${isFullscreen ? 'is-fullscreen' : ''}
                    ${isShowControls ? '' : 'controls-hidden'}`
                 }
                 ref={sectionRef}
                 aria-label="Видео-плеер"
        >
            {!isMiniPlayer && (
                <button className="video-player__hidden position-absolute inset-0 z-100 cursor-pointer"
                        onClick={toggleIsPlaying}
                />
            )}

            {/*eslint-disable jsx-a11y/media-has-caption*/}
            <video src={`${BASE_URL}${video?.video_url}`}
                   className="w-100 h-100"
                   autoPlay
                   crossOrigin="anonymous"
                   ref={videoRef}
                   onLoadedMetadata={loadedMetadata}
                   onTimeUpdate={updateTimeline}
                   onEnded={() => setIsPlaying(false)}
            >
                {video.subtitle_url && (
                    <track src={video.subtitle_url}
                           kind="captions"
                           srcLang="ru"
                           label="Русские субтитры"
                           default
                    />
                )}
            </video>

            {!isMiniPlayer && <VideoPlayerSettings isVisible={isShowSettings}/>}

            <VideoPlayerControls setIsShowSettings={setIsShowSettings}
                                 progress={progress}
                                 setIsMoving={setIsMoving}
                                 updateVideoTime={updateVideoTime}
                                 videoRef={videoRef}
                                 ref={controlsRef}
            />

            {isFullscreen && <VideoPlayerRecommended isOpen={isRecommendedOpen} setIsOpen={setIsRecommendedOpen}/>}
        </section>
    )
}

export default VideoPlayer;