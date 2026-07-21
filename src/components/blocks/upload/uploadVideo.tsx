import {useEffect, useState} from "react";

import {Video} from "@/types/video";
import {ChannelForList} from "@/types/channel";
import {Section} from "@/types/section";

import {apiUploadVideo} from "@api/upload/upload";

import {showError} from "@utils/modals.ts";

import SettingsBlock from "@settings/settingsBlock";
import Upload1 from "@upload/upload-1";
import Upload2 from "@upload/upload-2";
import Upload3 from "@upload/upload-3";
import UploadLoading from "@upload/uploadLoading.tsx";
import UploadNewVideo from "@upload/uploadNewVideo.tsx";

import ButtonUi from "@ui/ButtonUi";

interface Props {
    isVisible: boolean
    setIsVisible: (value:boolean) => void
}

function UploadVideo({isVisible, setIsVisible}: Readonly<Props>) {
    const controller = new AbortController()

    const [activeTab, setActiveTab] = useState<number>(0)
    const [progress, setProgress] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [newVideo, setNewVideo] = useState<Video | null>(null)

    const [video, setVideo] = useState<File | null>(null)
    const [preview, setPreview] = useState<File | null>(null)
    const [title, setTitle] = useState<string>("")
    const [activeChannel, setActiveChannel] = useState<ChannelForList | null>(null)
    const [activeSection, setActiveSection] = useState<Section | null>(null)
    const [tags, setTags] = useState<string[]>([])

    const tabs = [
        {
            title: 'Канал и плейлист'
        },
        {
            title: 'Основная информация'
        },
        {
            title: 'Теги'
        },
    ]

    const clear = () => {
        setActiveTab(0)
        setProgress(0)
        setVideo(null)
        setPreview(null)
        setTitle('')
        setActiveChannel(null)
        setTags([])
    }

    const uploadVideo = async () => {
        if (!video || !title || !tags?.length || !activeChannel) return

        try {
            setIsLoading(true)

            const response: Video = await apiUploadVideo(
                video,
                title,
                tags,
                activeChannel.id,
                activeSection?.id,
                preview ?? undefined,
                controller.signal,
                (percent) => setProgress(percent)
            )

            setNewVideo(response)

            clear()
        } catch (err) {
            console.error(err)

            await showError(
                'Ошибка загрузки видео',
                'Не удалось загрузить видео'
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!isVisible && newVideo) setNewVideo(null)
    }, [isVisible])

    const renderUploadVideo = () => (
        <>
            <div className="upload-video__tabs flex flex-between mb-30">
                {tabs?.map((tab, index) => (
                    <button
                        className={`upload-video__tab hover-color-accent text-w500 ${activeTab === index ? 'is-active pointer-none' : ''}`}
                        key={tab.title}
                        type="button"
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            <Upload1 className={activeTab === 0 ? '' : 'visually-hidden'}
                     activeChannel={activeChannel}
                     setActiveChannel={setActiveChannel}
                     activeSection={activeSection}
                     setActiveSection={setActiveSection}
            />
            <Upload2 className={activeTab === 1 ? '' : 'visually-hidden'}
                     video={video}
                     setVideo={setVideo}
                     preview={preview}
                     setPreview={setPreview}
                     title={title}
                     setTitle={setTitle}
            />
            <Upload3 className={activeTab === 2 ? '' : 'visually-hidden'}
                     tags={tags}
                     setTags={setTags}
            />
        </>
    )

    return (
        <SettingsBlock isVisible={isVisible} setIsVisible={setIsVisible}>
            <SettingsBlock.Title>Загрузка видео</SettingsBlock.Title>

            <SettingsBlock.Content className="upload-video flex flex-column">
                {!isLoading && (newVideo ? <UploadNewVideo newVideo={newVideo}/> : renderUploadVideo())}

                {isLoading && <UploadLoading progress={progress}/>}

                {!newVideo && (
                    <div className="row mt-auto">
                        <ButtonUi func={() => setIsVisible(false)}
                                  className='col-6'
                        >
                            Отмена
                        </ButtonUi>
                        <ButtonUi func={uploadVideo}
                                  className='col-6'
                                  isLoading={isLoading}
                        >
                            Загрузить
                        </ButtonUi>
                    </div>
                )}
            </SettingsBlock.Content>
        </SettingsBlock>
    )
}

export default UploadVideo;