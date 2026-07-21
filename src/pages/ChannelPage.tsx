import {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";

import {BASE_URL} from "@api/url";

import {VideoForList, VideosList} from "@/types/video";
import {Channel} from "@/types/channel";

import {apiGetChannel, apiGetVideosFromChannel} from "@api/channel/channel";

import ChannelMain from "@channel/ChannelMain";
import ChannelVideos from "@channel/ChannelVideos";
import ChannelAbout from "@channel/ChannelAbout";
import ChannelTabs from "@channel/ChannelTabs";
import ChannelBanner from "@channel/ChannelBanner.tsx";

function ChannelPage() {
    const { setHeaderOptions } = useOutletContext<{ setHeaderOptions: any }>();
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState(0)

    const [channel, setChannel] = useState<Channel | null>(null)

    const [videos, setVideos] = useState<VideoForList[]>([])
    const [newVideos, setNewVideos] = useState<VideoForList[]>([])
    const [popularVideos, setPopularVideos] = useState<VideoForList[]>([])

    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(false)

    const getNewChannelVideos = async () => {
        try {
            const data: VideosList = await apiGetVideosFromChannel(+id!, page)

            if (data) {
                setVideos(data.videos)

                if (page === 1) {
                    setNewVideos(data.videos?.slice(0, 8))
                }

                setPage(page + 1)
                setHasMore(data.has_more)
                setTotal(data.total)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getPopularChannelVideos = async () => {
        try {
            const data: VideosList = await apiGetVideosFromChannel(+id!, 1, 8, false, true)

            if (data) setPopularVideos(data.videos)
        } catch (err) {
            console.error(err)
        }
    }

    const getChannel = async () => {
        try {
            const data: Channel = await apiGetChannel(+id!)

            if (data.name) {
                setChannel(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (id) Promise.all([getChannel(), getNewChannelVideos(), getPopularChannelVideos()]).then()
    }, [id])

    useEffect(() => {
        setHeaderOptions({ visibleNavigation: true, isOnlyBack: true })
    }, [])

    return (
        <div className="main-page__channel channel m-auto">
            <ChannelBanner videos={videos}/>

            <div className="channel__info flex flex-align-center">
                <div className="channel__avatar img-container flex-center">
                    {channel?.avatar_url ?
                        <img src={`${BASE_URL}${channel.avatar_url}`} alt={channel.name}/>
                        : <span className="text-center">{channel?.name?.[0]}</span>
                    }
                </div>
                <p className="h5">{channel?.name}</p>
            </div>

            <ChannelTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

            <div style={{display: activeTab === 0 ? 'block' : 'none'}}>
                <ChannelMain newVideos={newVideos} popularVideos={popularVideos}/>
            </div>

            <div style={{display: activeTab === 1 ? 'block' : 'none'}}>
                <ChannelVideos videos={videos} hasMore={hasMore}/>
            </div>

            <div style={{display: activeTab === 2 ? 'block' : 'none'}}>
                <ChannelAbout total={total} date={channel?.date}/>
            </div>
        </div>
    )
}

export default ChannelPage;