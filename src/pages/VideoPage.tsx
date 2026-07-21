import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Video} from "@/types/video";

import {apiSetToHistory} from "@api/history/history";
import {apiCheckIsLiked} from "@api/like/like";
import {apiGetSavedTime} from "@api/save_time/saveTime";
import {apiGetVideo} from "@api/video/video";
import {apiCheckWatchLater} from "@api/watch_later/watchLater.ts";

import Header from "@header/Header";
import VideoMain from "@video/VideoMain";
import VideoRecommended from "@video/VideoRecommended";

import {useVideoStore} from "@store/useVideoStore";
import {usePlayerStore} from "@store/usePlayerStore";
import {useUserStore} from "@store/useUserStore";

function VideoPage() {
    const { id } = useParams<{ id: string }>();

    const {
        clearVideo,
        setVideo,
        setIsLoading,
        getRecommendedVideos,
    } = useVideoStore()
    const {setVolume} = usePlayerStore()
    const {isLogged} = useUserStore()

    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isWatchLater, setIsWatchLater] = useState<boolean>(false)
    const [savedTime, setSavedTime] = useState<number>(0)

    const getVideo = async () => {
        try {
            setIsLoading(true)
            clearVideo()
            if (id) {
                const data: Video = await apiGetVideo(+id)
                if (data) {
                    setVideo(data)
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const updateVideo = async (id: number) => {
        await getVideo()

        if (isLogged) {
            const [_, likeRes, saveTimeRes, watchLaterRes] =
                await Promise.all([
                    apiSetToHistory(id),
                    apiCheckIsLiked(id),
                    apiGetSavedTime(id),
                    apiCheckWatchLater(id)
                ])

            setIsLiked(likeRes.is_liked)
            setSavedTime(saveTimeRes.time)
            setIsWatchLater(watchLaterRes.is_watch_later)
        }

        await getRecommendedVideos(+id).then()
    }

    useEffect(() => {
        if (id) updateVideo(+id).catch(() => {})
    }, [id])

    useEffect(() => {
        const volume = JSON.parse(localStorage.getItem('volume') || '1')
        setVolume(volume)

        return () => {
            clearVideo()
        }
    }, [])

    return(
        <div className="video-page h-100">
            <Header visibleNavigation={true}/>

            <div className="video-page__content flex h-100">
                <VideoMain isLiked={isLiked}
                           setIsLiked={setIsLiked}
                           isWatchLater={isWatchLater}
                           setIsWatchLater={setIsWatchLater}
                           savedTime={savedTime}
                />

                <VideoRecommended id={id}/>
            </div>
        </div>
    );
}

export default VideoPage;