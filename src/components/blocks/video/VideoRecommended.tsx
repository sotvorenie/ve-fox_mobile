import {VideoForList} from "@/types/video";

import {videoListObserver} from "@composables/useVideoListObserver.ts";

import ListColumnSkeleton from "@ui/skeletons/ListColumnSkeleton";
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
        <div className="video-page__recommended w-100 h-100">
            <ul className="video-page__recommended_list">
                {videos?.map((video: VideoForList, index: number) => {
                    if (activeVideo.id === video.id) return
                    const isLast = index === videos.length - 2
                    return <VideoItem key={video.id}
                                      video={video}
                                      isRow={true}
                                      showAvatar={false}
                                      isSmall isRecommendation
                                      ref={isLast ? lastElementRef : null}
                    />
                })}
            </ul>

            {isLoading && <ListColumnSkeleton isRecommended={true}/>}
        </div>
    )
}

export default VideoRecommended;