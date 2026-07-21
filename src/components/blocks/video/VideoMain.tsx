import {useState} from "react";
import {Link} from "react-router-dom";

import {viewsArr} from "@data/countArrays.ts";

import {BASE_URL} from "@api/url";
import {apiLike} from "@api/like/like";
import {apiDeleteFromWatchLater, apiSetWatchLater} from "@api/watch_later/watchLater.ts";

import {formatCount} from "@composables/useFormatCount.ts";
import {formatDateAgo} from "@composables/useFormatDateAgo.ts";

import Comments from "@video/comments/Comments.tsx";
import VideoIntersect from "@video/VideoIntersect.tsx";

import LikeIcon from "@icons/LikeIcon";

import {useVideoStore} from "@store/useVideoStore";

interface Props {
    isLiked: boolean
    setIsLiked: (value: any) => void
    isWatchLater: boolean
    setIsWatchLater: (value: any) => void
    savedTime: number
}

function VideoMain({isLiked, setIsLiked, isWatchLater, setIsWatchLater, savedTime}: Readonly<Props>) {
    const {video} = useVideoStore()

    const [likeIsActive, setLikeIsActive] = useState<boolean>(true)
    const [watchLaterIsActive, setWatchLaterIsActive] = useState<boolean>(true)

    const handleLike = async () => {
        if (!likeIsActive) return

        setLikeIsActive(false)
        await apiLike(video.id)
        setLikeIsActive(true)

        const change = isLiked ? -1 : 1
        video.likes += change

        setIsLiked((prev: any) => !prev)
    }
    const handleWatchLater = async () => {
        if (!watchLaterIsActive) return

        try {
            setWatchLaterIsActive(false)

            isWatchLater ? await apiDeleteFromWatchLater(video.id) : await apiSetWatchLater(video.id)
            setIsWatchLater((prev: any) => !prev)
        } catch (err) {
            console.error(err)
        } finally {
            setWatchLaterIsActive(true)
        }
    }

    return (
        <div className="video">
            <VideoIntersect savedTime={savedTime}/>

            <p className="video__title text-w700 one-line mb-20">{video?.name}</p>

            <div className="video__actions flex flex-align-center mb-30">
                <Link to={`/channel/${video.channel.id}`}
                      state={{
                          channel: {
                              name: video.channel.name,
                              avatar: video.channel.avatar_url,
                          }
                      }}
                      className="video__channel flex flex-align-center cursor-pointer hover-color-accent"
                >
                    <div className="video__channel-avatar img-container"
                    >
                        {video.channel.avatar_url ?
                            (<img src={`${BASE_URL}${video.channel.avatar_url}`} alt={video.channel.name}/>) :
                            (<span>{video?.channel.name?.slice(0, 1)}</span>)
                        }
                    </div>
                    <span className="video__channel-name text-w700">{video.channel.name}</span>
                </Link>

                {video?.video_url ? (
                    <div className="video__buttons flex">
                        <button className={`video__button video__like recolor-svg flex flex-align-center gap-10 ${isLiked ? 'fill' : ''}`}
                                type="button"
                                disabled={!likeIsActive}
                                onClick={handleLike}
                        >
                            <span>{video.likes}</span>
                            <LikeIcon/>
                        </button>
                        <button className={`video__button ${isWatchLater ? 'fill' : ''}`}
                                type="button"
                                disabled={!watchLaterIsActive}
                                onClick={handleWatchLater}
                        >
                            {isWatchLater ? 'Удалить из "Смотреть позже"' : 'Смотреть позже'}
                        </button>
                    </div>
                ) : null}

                <div className="video__info flex flex-align-center gap-10">
                    <span>{video.views} {formatCount(video.views, viewsArr)}</span>
                    <div className="video-item__dot"/>
                    <span>{formatDateAgo(video.date)}</span>
                </div>
            </div>

            <Comments/>
        </div>
    )
}

export default VideoMain;