import {useRef} from "react";

import InputUi from "@ui/InputUi";

import VideoFileIcon from "@icons/VideoFileIcon";
import PhotoFileIcon from "@icons/PhotoFileIcon";

interface Props {
    className: string
    video: File | null
    setVideo: (video: File | null) => void
    preview: File | null
    setPreview: (preview: File | null) => void
    title: string
    setTitle: (title: string) => void
}

function Upload2({className, video, setVideo, preview, setPreview, title, setTitle}: Readonly<Props>) {
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const previewInputRef = useRef<HTMLInputElement | null>(null);

    const changeVideo = () => {
        if (!videoInputRef.current?.files?.[0]) return
        setVideo(videoInputRef.current.files[0])
    }
    const changePreview = () => {
        if (!previewInputRef.current?.files?.[0]) return
        setPreview(previewInputRef.current.files[0])
    }

    return (
        <div className={className}>
            <InputUi
                className="mb-20"
                name="video"
                id="video"
                title="Название видео"
                value={title}
                setValue={setTitle}
                maxLength={100}
            />

            <div className="row">
                <button className="upload-video__file flex-center recolor-svg hover-color-accent col-6"
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                >
                    <input
                        type="file"
                        accept="video/*"
                        ref={videoInputRef}
                        className="visually-hidden"
                        onChange={changeVideo}
                    />

                    <div className="upload-video__file-info">
                        {video ? (
                            <div>{video.name}</div>
                        ) : (
                            <>
                                <VideoFileIcon/>
                                <p>Загрузить видео</p>
                            </>
                        )}
                    </div>
                </button>
                <button className="upload-video__file flex-center recolor-svg hover-color-accent col-6"
                        type="button"
                        onClick={() => previewInputRef.current?.click()}
                >
                    <input
                        type="file"
                        accept="image/*"
                        ref={previewInputRef}
                        className="visually-hidden"
                        onChange={changePreview}
                    />

                    <div className="upload-video__file-info">
                        {preview ? (
                            <div>{preview.name}</div>
                        ) : (
                            <>
                                <PhotoFileIcon/>
                                <p>Загрузить Превью</p>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    )
}

export default Upload2;