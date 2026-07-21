import React, {forwardRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {VideoForList} from "@/types/video";

import {viewsArr} from "@data/countArrays.ts";

import {BASE_URL} from "@api/url";

import {formatCount} from "@composables/useFormatCount.ts";
import {formatVideoName} from "@composables/useFormatVideoName";
import {formatDateAgo} from "@composables/useFormatDateAgo.ts";
import {formatVideoTime} from "@composables/useFormatVideoTime";

import VideoMenu from "@video/VideoMenu.tsx";

interface BaseVideoProps {
    video: VideoForList
}

interface Props extends BaseVideoProps {
    showAvatar?: boolean
    className?: string
    isRecommendation?: boolean
    isChannel?: boolean
}

interface PreviewProps extends BaseVideoProps {
    isRecommendation: boolean
}

interface AvatarProps extends BaseVideoProps {
    handleChannel: (event: any) => void
}

function Preview({video, isRecommendation}: Readonly<PreviewProps>) {
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

    return (
        <div className="video-item__preview img-container position-relative">
            <img src={`${BASE_URL}${video.preview_url}`} alt={video.name} loading="lazy"/>

            <span className="position-absolute">{formatVideoTime(video.duration)}</span>

            <VideoMenu id={video.id} isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} isSmall={isRecommendation}/>

            {!!(video.saved_time) && (
                <div className="video-item__timeline w-100 position-absolute bottom-0 z-10">
                    <div className="h-100"
                         style={{'width': `${video.saved_time / video.duration * 100}%`}}
                    />
                </div>
            )}
        </div>
    )
}

function Avatar({video, handleChannel}: Readonly<AvatarProps>) {

    return (
        <button className="video-item__avatar img-container radius-50 text-upper"
                title={video.channel.name}
                onClick={(event) => handleChannel(event)}
                type="button"
        >
            {video.channel.avatar_url ?
                (<img src={`${BASE_URL}${video.channel.avatar_url}`} alt={video.channel.name}/>) :
                (<span>{video.channel.name?.slice(0, 1)}</span>)
            }
        </button>
    )
}

const VideoItem = forwardRef(({
                                  video,
                                  showAvatar = true,
                                  className,
                                  isRecommendation = false,
                                  isChannel = false,
                              }: Props, ref: React.ForwardedRef<HTMLLIElement>) => {
    const navigate = useNavigate();

    const handleChannel = (event: React.MouseEvent): void => {
        event.stopPropagation()
        event.preventDefault()

        navigate(`/channel/${video.channel.id}`)
    }

    return (
        <li className={`
                 video-item w-100
                 ${className} ${isRecommendation ? 'is-recommended' : ''}
             `}
            ref={ref}
        >
            <Link to={`/video/${video.id}`} className="w-100 flex flex-column">
                <Preview video={video} isRecommendation={isRecommendation}/>

                <div className='video-item__info flex'>
                    {showAvatar && <Avatar video={video} handleChannel={handleChannel}/>}

                    <div className="video-item__text flex flex-column">
                        <span className="video-item__title two-lines">
                            {formatVideoName(video.name)}
                        </span>

                        <div className="flex gap-10 flex-align-center text-ellipsis">
                            {!isChannel && (
                                <>
                                        <span className="video-item__info-item">
                                            {video.channel.name}
                                        </span>
                                    <div className="video-item__dot"/>
                                </>
                            )}
                            <span className="video-item__info-item">{formatDateAgo(video.date)}</span>
                            <div className="video-item__dot"/>
                            <span className="video-item__info-item">{video.views} {formatCount(video.views, viewsArr)}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </li>
    )
})

export default VideoItem;