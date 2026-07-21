import {useMemo, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/effect-fade';

import {VideoForList} from "@/types/video.ts";

import {BASE_URL} from "@api/url.ts";

import {randomArray} from "@composables/useRandomArray.ts";
import VideoItem from "@video/VideoItem.tsx";

interface Props {
    videos: VideoForList[]
}

function ChannelBanner({videos}: Readonly<Props>) {
    const [activeIndex, setActiveIndex] = useState(0)

    const bannerVideos = useMemo(() => {
        return randomArray(videos).map((video: VideoForList) => ({
            ...video,
            start: video.duration > 20 ? video.duration / 2 : 0,
            intervalTime: video.duration > 10 ? 10000 : video.duration * 1000,
        }))
    }, [videos])

    const activeVideo = bannerVideos[activeIndex]

    return (
        <div className="channel__banner img-container position-relative">
            <Swiper direction="vertical"
                    modules={[Autoplay]}
                    autoplay={{
                        delay: activeVideo?.intervalTime || 5000,
                        disableOnInteraction: false,
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className="h-100"
            >
                {bannerVideos?.map((video: VideoForList) => (
                    <SwiperSlide key={video.id}>
                        <VideoItem isRow={false}
                                   video={video}
                                   className="channel__active-video position-absolute left-0 top-0 h-100"
                                   showAvatar={false}
                                   isChannel
                                   hoverOn={false}
                                   hoverColorAccentOpacity={false}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/*eslint-disable jsx-a11y/media-has-caption*/}
            <video key={activeVideo?.id}
                   src={`${BASE_URL}${activeVideo?.video_url}?start=${activeVideo?.start}`}
                   autoPlay
                   muted
                   playsInline
                   className="position-absolute top-0 right-0"
            />
        </div>
    )
}

export default ChannelBanner;