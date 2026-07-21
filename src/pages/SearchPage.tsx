import {useEffect} from "react";
import {Link} from "react-router-dom";

import {BASE_URL} from "@api/url.ts";

import {ChannelForList} from "@/types/channel";
import {VideoForList} from "@/types/video";

import VideoItem from "@video/VideoItem";
import ListColumnSkeleton from "@ui/skeletons/ListColumnSkeleton";

import {useSearchStore} from "@store/useSearchStore";
import {usePagesStore} from "@store/usePagesStore";

function SearchPage() {
    const {
        isLoading,
        total,
        channels,
        videos,
        search
    } = useSearchStore()
    const {setPage} = usePagesStore()

    useEffect(() => {
        if (!videos?.length) {
            setPage(-1)
            search().then()
        }
    }, [])

    return (
        <div className="margin-center-page search-page">
            <p className="total h6 mb-30">Найдено {total} видео</p>

            {!isLoading && (
                <ul className="search-page__channels flex flex-column mb-20">
                    {channels?.map((channel: ChannelForList) => (
                        <li className="search-page__channel" key={channel.id}>
                            <Link to={`/channel/${channel.id}`} className="flex flex-align-center">
                                <div className="search-page__channel-avatar img-container radius-50">
                                    <img src={`${BASE_URL}${channel?.avatar_url}`} alt={channel?.name}/>
                                </div>
                                <span className="search-page__channel-name h4">{channel?.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && (
                <ul className="">
                {videos?.map((video: VideoForList) => (
                        <VideoItem key={video.id} video={video} isRow={true}/>
                    ))}
                </ul>
            )}

            {isLoading && <ListColumnSkeleton isRecommended={false}/>}
        </div>
    )
}

export default SearchPage;