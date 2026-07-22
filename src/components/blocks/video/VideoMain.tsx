import {useState} from "react";
import {Link} from "react-router-dom";

import {viewsArr} from "@data/countArrays.ts";

import {BASE_URL} from "@api/url";
import {apiLike} from "@api/like/like";
import {apiDeleteFromWatchLater, apiSetWatchLater} from "@api/watch_later/watchLater.ts";

import {formatCount} from "@composables/useFormatCount.ts";
import {formatDateAgo} from "@composables/useFormatDateAgo.ts";

import Comments from "@video/comments/Comments.tsx";
import VideoPlayer from "@video/video-player/VideoPlayer.tsx";

import LikeIcon from "@icons/LikeIcon";

import {useVideoStore} from "@store/useVideoStore";
import {useUserStore} from "@store/useUserStore.ts";
import {useCommentsStore} from "@store/useCommentsStore.ts";

interface Props {
    isLiked: boolean
    setIsLiked: (value: any) => void
    isWatchLater: boolean
    setIsWatchLater: (value: any) => void
    savedTime: number
}

function VideoMain({isLiked, setIsLiked, isWatchLater, setIsWatchLater, savedTime}: Readonly<Props>) {
    const {video} = useVideoStore()
    const {isLogged} = useUserStore()
    const {isOpen} = useCommentsStore()

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
            <VideoPlayer savedTime={savedTime}/>

            {!isOpen && (
                <>
                    <p className="text-w700 two-lines mb-5">{video?.name}</p>

                    <div className="flex flex-align-center gap-8 fs-14 mb-10">
                        <span>{video.views} {formatCount(video.views, viewsArr)}</span>
                        <div className="video-item__dot"/>
                        <span>{formatDateAgo(video.date)}</span>
                    </div>

                    {video?.video_url ? (
                        <div className="flex gap-10 mb-15">
                            <button
                                className={`video__button video__like recolor-svg flex flex-align-center gap-10 ${isLiked ? 'fill' : ''}`}
                                type="button"
                                disabled={!likeIsActive || !isLogged}
                                onClick={handleLike}
                            >
                                <span>{video.likes}</span>
                                <LikeIcon/>
                            </button>
                            {isLogged && (
                                <button className={`video__button ${isWatchLater ? 'fill' : ''}`}
                                        type="button"
                                        disabled={!watchLaterIsActive}
                                        onClick={handleWatchLater}
                                >
                                    {isWatchLater ? 'Удалить из "Смотреть позже"' : 'Смотреть позже'}
                                </button>
                            )}
                        </div>
                    ) : null}

                    <Link to={`/channel/${video.channel.id}`}
                          state={{
                              channel: {
                                  name: video.channel.name,
                                  avatar: video.channel.avatar_url,
                              }
                          }}
                          className="video__channel h5 flex gap-10 flex-align-center hover-color-accent mb-15"
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
                </>
            )}

            <Comments/>
        </div>
    )
}

export default VideoMain;