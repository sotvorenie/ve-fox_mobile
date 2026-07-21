import React, {forwardRef, useEffect, useState} from "react";
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
    isRow: boolean
    showAvatar?: boolean
    isSmall?: boolean
    className?: string
    isRecommendation?: boolean
    isChannel?: boolean
    hoverOn?: boolean
    hoverColorAccentOpacity?: boolean
}

interface PreviewProps extends BaseVideoProps {
    isRecommendation: boolean
    isHovered: boolean
    isReady: boolean
    setIsReady: (isReady: any) => void
}

interface AvatarProps extends BaseVideoProps {
    handleChannel: (event: any) => void
}

interface InfoInRowProps extends AvatarProps, Pick<Props, 'showAvatar'| 'isRecommendation'>{
    isRecommendation: boolean
    showAvatar: boolean
}

function Preview({
                     video,
                     isHovered,
                     isReady,
                     setIsReady,
                     isRecommendation
}: Readonly<PreviewProps>) {
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
    const [previewTime] = useState(() => {
        if (video.duration < 15) return 0
        const maxTime = video.duration - 5
        return Math.floor(Math.random() * (maxTime - 10)) + 10
    })

    return (
        <div className="video-item__preview img-container position-relative">
            {isHovered ? (
                <>
                    <img src={`${BASE_URL}${video.preview_url}`}
                         alt={video.name}
                         loading="lazy"
                         className={`${isReady ? 'is-hidden' : ''}`}
                    />
                    <video src={`${BASE_URL}${video.video_url}?start=${previewTime}`}
                           autoPlay
                           muted
                           loop
                           playsInline
                           onCanPlay={() => setIsReady(true)}
                           className={`absolute-center h-100 w-100 ${isReady ? 'z-10' : 'z-0'}`}
                    />
                </>
            ) : (
                <img src={`${BASE_URL}${video.preview_url}`} alt={video.name} loading="lazy"/>
            )}

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

function Avatar({
                    video,
                    handleChannel
}: Readonly<AvatarProps>) {

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

function InfoInRow({
                       video,
                       isRecommendation = false,
                       handleChannel,
                       showAvatar = true
}: Readonly<InfoInRowProps>) {

    return (
        <>
            <div className={`${isRecommendation ? 'line-height-1' : 'flex gap-10 flex-align-center'}`}>
                <span className="video-item__info-item video-item__channel">
                    {video.channel.name}
                </span>

                {!isRecommendation && <div className="video-item__dot"/>}

                <div className={`flex gap-10 ${isRecommendation ? 'flex-align-center' : 'flex-align-center mb-10'}`}>
                    <span className="video-item__info-item">{formatDateAgo(video.date)}</span>
                    <div className="video-item__dot"/>
                    <span className="video-item__info-item">{video.views} {formatCount(video.views, viewsArr)}</span>
                </div>
            </div>

            <button className="video-item__row-channel flex flex-align-center gap-10"
                    type="button"
                    onClick={(event) => handleChannel(event)}
            >
                {showAvatar && (
                    <div className="video-item__avatar img-container radius-50 text-upper">
                        {video.channel.avatar_url ?
                            (<img src={`${BASE_URL}${video.channel.avatar_url}`}
                                  alt={video.channel.name}/>) :
                            (<span>{video.channel.name.slice(0, 1)}</span>)
                        }
                    </div>
                )}
                {!isRecommendation && <span className="video-item__channel">{video.channel.name}</span>}
            </button>
        </>
    )
}

const VideoItem = forwardRef(({
                                  video,
                                  isRow = false,
                                  showAvatar = true,
                                  isSmall = false,
                                  className,
                                  isRecommendation = false,
                                  isChannel = false,
                                  hoverOn = true,
                                  hoverColorAccentOpacity = true,
                              }: Props, ref: React.ForwardedRef<HTMLLIElement>) => {
    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [isReady, setIsReady] = useState(false)

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

    const handleChannel = (event: React.MouseEvent): void => {
        event.stopPropagation()
        event.preventDefault()

        navigate(`/channel/${video.channel.id}`)
    }

    const handleMouseEnter = () => {
        if (!hoverOn) return
        const t = setTimeout(() => setIsHovered(true), 500)
        setTimer(t)
    }

    const handleMouseLeave = () => {
        if (!hoverOn) return
        if (timer) clearTimeout(timer)
        setIsHovered(false)
        setIsReady(false)
    }

    useEffect(() => {
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [timer])

    return (
        <li className={`
                 video-item w-100
                 ${isSmall ? 'is-small' : ''}
                 ${className} ${isRecommendation ? 'is-recommended' : ''}
                 ${hoverColorAccentOpacity ? 'hover-opacity' : ''}
             `}
            ref={ref}
        >
            <Link to={`/video/${video.id}`}
                  className={isRow ? 'video-item__row-item flex flex-align-start w-100' : 'w-100 flex flex-column'}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
            >
                <Preview isHovered={isHovered}
                         isReady={isReady}
                         setIsReady={setIsReady}
                         video={video}
                         isRecommendation={isRecommendation}
                />

                <div className={isRow ? 'video-item__info flex flex-column' : 'video-item__info flex'}>
                    {!isRow && showAvatar && <Avatar video={video} handleChannel={handleChannel}/>}

                    <div className="video-item__text flex flex-column">
                        <span className="video-item__title two-lines">
                            {formatVideoName(video.name)}
                        </span>

                        {!isRow && (
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
                        )}
                    </div>

                    {isRow && (
                        <InfoInRow video={video}
                                   handleChannel={handleChannel}
                                   isRecommendation={isRecommendation}
                                   showAvatar={showAvatar}
                        />
                    )}
                </div>
            </Link>
        </li>
    )
})

export default VideoItem;