import {VideoForList} from "@/types/video";

import VideoItem from "@video/VideoItem";

interface VideoProps {
    videos: VideoForList[]
    hasMore: boolean
}

function ChannelVideos({videos, hasMore}: Readonly<VideoProps>) {

    return (
        <div className="channel__videos">
            <p className="channel__sub-title h6">Все видео</p>
            <ul className="channel__list row">
                {videos?.map((video: VideoForList) => (
                    <VideoItem key={video.id} className="col-4" video={video} isRow={false}/>
                ))}
            </ul>

            {hasMore && <button>Загрузить еще</button>}
        </div>
    )
}

export default ChannelVideos;