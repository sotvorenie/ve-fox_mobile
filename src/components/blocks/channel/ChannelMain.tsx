import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import {VideoForList} from "@/types/video";

import VideoItem from "@video/VideoItem";

import SelectArrowIcon from "@icons/SelectArrowIcon.tsx";

interface Props {
    newVideos: VideoForList[]
    popularVideos: VideoForList[]
}

function ChannelMain({ newVideos, popularVideos }: Readonly<Props>) {

    return (
        <div className="channel__main">
            <div className="channel__video-block mb-20">
                <p className="h6 mb-10">Новинки</p>

                <div className="channel__slider-wrapper position-relative">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: '.new-video-arrow.prev',
                            nextEl: '.new-video-arrow.next',
                        }}
                        allowTouchMove={false}
                        simulateTouch={false}
                        slidesPerView={4}
                    >
                        {newVideos?.map((video: VideoForList) => (
                            <SwiperSlide key={video.id}>
                                <VideoItem video={video} isRow={false} isChannel/>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className="channel__arrow new-video-arrow prev button-width-svg recolor-svg flex-center radius-50 z-1 position-absolute"
                            type="button"
                    >
                        <SelectArrowIcon/>
                    </button>
                    <button className="channel__arrow new-video-arrow next button-width-svg recolor-svg flex-center radius-50 z-1 position-absolute"
                            type="button"
                    >
                        <SelectArrowIcon/>
                    </button>
                </div>
            </div>

            {popularVideos?.length > 1 && (
                <div className="channel__video-block mb-20">
                    <p className="h6 mb-10">Популярные</p>

                    <div className="channel__slider-wrapper position-relative">
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                prevEl: '.popular-video-arrow.prev',
                                nextEl: '.popular-video-arrow.next',
                            }}
                            allowTouchMove={false}
                            simulateTouch={false}
                            slidesPerView={4}
                        >
                            {popularVideos?.map((video: VideoForList) => (
                                <SwiperSlide key={video.id}>
                                    <VideoItem video={video} isRow={false} isChannel/>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            className="channel__arrow popular-video-arrow prev button-width-svg recolor-svg flex-center radius-50 z-1 position-absolute"
                            type="button"
                        >
                            <SelectArrowIcon/>
                        </button>
                        <button
                            className="channel__arrow popular-video-arrow next button-width-svg recolor-svg flex-center radius-50 z-1 position-absolute"
                            type="button"
                        >
                            <SelectArrowIcon/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChannelMain;