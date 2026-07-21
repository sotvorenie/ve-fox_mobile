import {VideoForList} from "@/types/video";

import {videoListObserver} from "@composables/useVideoListObserver.ts";

import ListSkeleton from "@ui/skeletons/ListSkeleton.tsx";
import VideoItem from "@video/VideoItem.tsx";

import {useVideoStore} from "@store/useVideoStore";

interface Props {
    id: string | undefined
}

function VideoRecommended({id}: Readonly<Props>) {

    const {
        recommendedVideos: videos,
        recommendedIsLoading: isLoading,
        video: activeVideo,
        recommendedHasMore: hasMore,
    } = useVideoStore()
    const {
        getRecommendedVideos,
    } = useVideoStore()

    if (!id) return

    const lastElementRef = videoListObserver(() => getRecommendedVideos(+id), hasMore, isLoading)

    return (
        <>
            <ul className="video-list">
                {videos?.map((video: VideoForList, index: number) => {
                    if (activeVideo.id === video.id) return
                    const isLast = index === videos.length - 2
                    return <VideoItem key={video.id}
                                      video={video}
                                      showAvatar={false}
                                      ref={isLast ? lastElementRef : null}
                    />
                })}
            </ul>

            {isLoading && <ListSkeleton/>}
        </>
    )
}

export default VideoRecommended;