import React, {useEffect, useRef, useState} from "react";

import VideoPlayer from "@video/video-player/VideoPlayer.tsx";

import {usePlayerStore} from "@store/usePlayerStore.ts";

interface Props {
    savedTime: number,
}

function VideoIntersect({savedTime}: Readonly<Props>) {
    const {
        isMiniPlayer,
        isMoving,
        isFullscreen,
    } = usePlayerStore()
    const {
        setIsMiniPlayer,
        setIsMoving,
        setIsPlaying
    } = usePlayerStore()

    const [transformStyle, setTransformStyle] = useState<string>('')
    const [savedTransformStyle, setSavedTransformStyle] = useState<string>('')
    const [oldIsPlaying, setOldIsPlaying] = useState<boolean>(false)

    const dragRef = useRef({
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
    })

    const intersectRef = useRef<HTMLDivElement | null>(null)

    const handleTouchStart = (e: React.MouseEvent) => {
        if (!isMiniPlayer) return

        setIsMoving(true)
        setOldIsPlaying(usePlayerStore.getState().isPlaying)
        setIsPlaying(false)
        dragRef.current.startX = e.clientX
        dragRef.current.startY = e.clientY
    }

    useEffect(() => {
        const intersectBlock = intersectRef.current
        if (!intersectBlock) return

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setIsMiniPlayer(!entry.isIntersecting)
            })
        }, {
            threshold: 0,
            rootMargin: '-100px 0px 0px 0px'
        })
        observer.observe(intersectBlock)

        return () => {
            if (intersectBlock) observer.unobserve(intersectBlock)
            setIsMiniPlayer(false)
        }
    }, [])

    useEffect(() => {
        if (!isMoving) return

        const handleDragMove = (e: MouseEvent) => {
            const deltaX = e.clientX - dragRef.current.startX
            const deltaY = e.clientY - dragRef.current.startY
            const currentX = dragRef.current.offsetX + deltaX
            const currentY = dragRef.current.offsetY + deltaY

            setTransformStyle(`translate(${currentX}px, ${currentY}px)`)
            setSavedTransformStyle(`translate(${currentX}px, ${currentY}px)`)
        }

        const handleDragEnd = (e: MouseEvent) => {
            setIsMoving(false)
            setIsPlaying(oldIsPlaying)
            dragRef.current.offsetX += e.clientX - dragRef.current.startX
            dragRef.current.offsetY += e.clientY - dragRef.current.startY
        }

        globalThis.addEventListener('mousemove', handleDragMove)
        globalThis.addEventListener('mouseup', handleDragEnd)

        return () => {
            globalThis.removeEventListener('mousemove', handleDragMove)
            globalThis.removeEventListener('mouseup', handleDragEnd)
        }
    }, [isMoving])

    useEffect(() => {
        setTransformStyle(isMiniPlayer && !isFullscreen ? savedTransformStyle : 'translate(0, 0)')
    }, [isMiniPlayer, isFullscreen])

    return (
        <div className={`video__intersect w-100 ${isMiniPlayer ? 'mini-player' : ''}`} ref={intersectRef}>
            <div className="video__intersect_wrapper z-1001"
                 onMouseDown={handleTouchStart}
                 style={{
                     transform: transformStyle,
                     cursor: isMoving ? 'grabbing' : 'grab'
                 }}
            >
                <VideoPlayer savedTime={savedTime}/>
            </div>
        </div>
    )
}

export default VideoIntersect;