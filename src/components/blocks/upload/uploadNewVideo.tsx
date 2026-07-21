import {BASE_URL} from "@api/url.ts";
import {Link} from "react-router-dom";

import {Video} from "@/types/video.ts";

interface Props {
    newVideo: Video
}

function UploadNewVideo({newVideo}: Readonly<Props>) {

    return (
        <div className="uploaded-video h-100">
            <div className="uploaded-video__top">
                <div className="uploaded-video__preview flex-center">
                    <div className="img-container h-100">
                        <img src={`${BASE_URL}${newVideo.preview_url}`} alt={newVideo.name}/>
                    </div>
                </div>

                <div className="uploaded-video__info">
                    <Link to={`/video/${newVideo.id}`}
                          className="uploaded-video__name h5 text-w600"
                    >
                        {newVideo.name}
                    </Link>

                    <div className="uploaded-video__channel flex flex-align-center">
                        <div className="uploaded-video__channel-avatar img-container radius-50">
                            <img src={`${BASE_URL}${newVideo.channel.avatar_url}`} alt={newVideo.channel.name}/>
                        </div>
                        <p className="uploaded-video__channel-name text-w500">{newVideo.channel.name}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadNewVideo;