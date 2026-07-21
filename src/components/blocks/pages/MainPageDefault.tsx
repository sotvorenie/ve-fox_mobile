import {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {VideoForList, VideosList} from "@/types/video";

import {apiGetHistory} from "@api/history/history";
import {apiGetListLikes} from "@api/like/like";
import {apiGetListWatchLater} from "@api/watch_later/watchLater";

import {videoListObserver} from "@composables/useVideoListObserver.ts";

import VideoItem from "@video/VideoItem";
import ListColumnSkeleton from "@ui/skeletons/ListColumnSkeleton";

import {usePagesStore} from "@store/usePagesStore";

interface Props {
    readonly name: string;
    readonly index: number;
}

function MainPageDefault({name, index}: Props) {
    const location = useLocation()

    const {setPage} = usePagesStore()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [videos, setVideos] = useState<VideoForList[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [responsePage, setResponsePage] = useState<number>(1);

    const getVideos = useCallback(async () => {
        try {
            setIsLoading(true)

            let data: VideosList

            switch (name) {
                case 'history':
                    data = await apiGetHistory(responsePage)
                    break
                case 'liked':
                    data = await apiGetListLikes(responsePage)
                    break
                case 'watch_later':
                    data = await apiGetListWatchLater(responsePage)
                    break
                default:
                    data = await apiGetHistory(responsePage)
            }

            if (data) {
                setVideos(prev => [...prev, ...data.videos])
                setHasMore(data.has_more)
                setTotal(data.total)
                setResponsePage(data.page + 1)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [name, responsePage])

    const clearData = () => {
        setVideos([])
        setHasMore(false)
        setTotal(0)
        setResponsePage(1)
    }

    const deleteFromWatchLater = (event: any) => {
        setVideos(prev => {
            const filtered = prev.filter(v => v.id !== event.detail.id)
            setTotal(filtered?.length)
            return filtered
        })
    }

    const lastElementRef = videoListObserver(getVideos, hasMore, isLoading)

    useEffect(() => {
        clearData()
        setPage(index)
        getVideos().catch(() => {})

        if (location.pathname === '/watch_later') {
            globalThis.addEventListener('watchLaterDelete', deleteFromWatchLater)

            return () => {
                globalThis.removeEventListener('watchLaterDelete', deleteFromWatchLater)
            }
        }
    }, [])

    return (
        <div className="margin-center-page">
            <p className="total h6">Найдено {total} видео</p>

            {!isLoading && (
                <ul className="w-100">
                    {videos?.map((video: VideoForList, mapIndex: number) => {
                        const isLast = mapIndex === videos.length - 2
                        return (
                            <VideoItem key={video.id}
                                       video={video}
                                       isRow={true}
                                       ref={isLast ? lastElementRef : null}
                            />
                        )
                    })}
                </ul>
            )}

            {isLoading && <ListColumnSkeleton isRecommended={false}/>}
        </div>
    )
}

export default MainPageDefault;