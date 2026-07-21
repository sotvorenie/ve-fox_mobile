import {useCallback, useEffect, useState} from "react";

import {VideoForList, VideosList} from "@/types/video";

import {apiGetAllVideos} from "@api/video/video";

import {videoListObserver} from "@composables/useVideoListObserver.ts";

import VideoItem from "@video/VideoItem";
import ListRowSkeleton from "@ui/skeletons/ListRowSkeleton";
import MainEmpty from "@ui/empty/mainEmpty";

import {usePagesStore} from "@store/usePagesStore";
import {useVideoSeedStore} from "@store/useVideoSeedStore.ts";

function MainPage() {
    const {setPage: setRouterPage} = usePagesStore()
    const {videoSeed} = useVideoSeedStore()

    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [videos, setVideos] = useState<VideoForList[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getAllVideos = useCallback(async (): Promise<void> => {
        if (isLoading || !hasMore) return

        try {
            setIsLoading(true)
            const data: VideosList = await apiGetAllVideos(page, 21, videoSeed)
            if (data) {
                setVideos(prev => [...prev, ...data.videos])
                setPage(prev => prev + 1)
                setHasMore(data.has_more)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [page, isLoading, hasMore])

    const lastElementRef = videoListObserver(getAllVideos, hasMore, isLoading)

    useEffect(() => {
        setRouterPage(0)

        getAllVideos().then(() => {})
    }, [])

    return (
        <div className="main-page__home h-100">
            {!isLoading && (
                <ul className="video-list row">
                    {videos?.map((video: VideoForList, index: number) => {
                        const isLast = index === videos.length - 2
                        return (<VideoItem key={video.id}
                                           className="col-4"
                                           video={video}
                                           isRow={false}
                                           ref={isLast ? lastElementRef : null}
                        />)
                    })}
                </ul>
            )}

            {!isLoading && !videos?.length && <MainEmpty/>}

            {isLoading && <ListRowSkeleton/>}
        </div>
    )
}

export default MainPage;