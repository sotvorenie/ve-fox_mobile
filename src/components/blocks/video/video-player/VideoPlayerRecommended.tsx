import VideoItem from "@video/VideoItem.tsx";

import SelectArrowIcon from "@icons/SelectArrowIcon.tsx";

import {useVideoStore} from "@store/useVideoStore.ts";

interface Props {
    isOpen: boolean,
    setIsOpen: (isOpen: any) => void,
}

function VideoPlayerRecommended({isOpen, setIsOpen}: Readonly<Props>) {
    const {recommendedVideos: videos} = useVideoStore()

    return (
        <div className="video-player__recommended">

            <button className="video-player__recommended_open recolor-svg button-width-svg hover-color-accent radius-50 flex-center z-1000"
                    type="button"
                    onClick={() => setIsOpen(true)}
                    title="Рекомендованные видео"
            >
                <SelectArrowIcon/>
            </button>

            <div className={`video-player__recommended_content position-absolute w-100 z-1001 bottom-0 ${isOpen ? 'is-open' : ''}`}>
                <button className={`
                        video-player__recommended_close button-width-svg recolor-svg hover-color-accent radius-50 flex-center
                        ${isOpen ? 'is-open' : ''}
                    `}
                        type="button"
                        onClick={() => setIsOpen(false)}
                        title="Закрыть"
                >
                <span className="flex-center radius-50">
                    <SelectArrowIcon/>
                </span>
                </button>

                {videos?.length > 0 && (
                    <ul className="video-player__recommended_list z-10000 row row-cols-5">
                        {videos.map((video) => (
                            <VideoItem key={video.id} className="col" video={video} isRow={false} showAvatar={false} isSmall/>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default VideoPlayerRecommended;