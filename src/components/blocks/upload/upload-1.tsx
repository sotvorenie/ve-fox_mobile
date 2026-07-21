import {useEffect, useRef, useState} from "react";

import {BASE_URL} from "@api/url";

import {ChannelForList, ChannelsListResponse} from "@/types/channel";
import {Section, SectionResponse} from "@/types/section";
import {SuccessResponse} from "@/types/success";

import {
    apiGetChannels,
    apiGetChannelSections,
    apiCheckHasChannelSections,
    apiCreateNewSection
} from "@api/channel/channel";

import ButtonUi from "@ui/ButtonUi";
import Modal from "@common/Modal";
import UploadModal from "@upload/uploadModal";
import InputUi from "@ui/InputUi";

import LoadingIcon from "@icons/LoadingIcon";

interface Props {
    className: string
    activeChannel: ChannelForList | null
    setActiveChannel: (channel: ChannelForList | null) => void
    activeSection: Section | null
    setActiveSection: (section: Section | null) => void
}

function Upload1({className, activeChannel, setActiveChannel, activeSection, setActiveSection}: Readonly<Props>) {
    const [isVisibleChannels, setIsVisibleChannels] = useState<boolean>(false)
    const [isVisibleSections, setIsVisibleSections] = useState<boolean>(false)
    const [isVisibleCreateSection, setIsVisibleCreateSection] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [channelsArray, setChannelsArray] = useState<ChannelForList[]>([])
    const [channelsTotal, setChannelsTotal] = useState<number>(0)

    const [hasSections, setHasSections] = useState<boolean>(false)
    const [sectionsArray, setSectionsArray] = useState<Section[]>([])
    const [sectionsTotal, setSectionsTotal] = useState<number>(0)

    const [newSectionName, setNewSectionName] = useState<string>('')
    const newSectionNameRef = useRef<HTMLInputElement>(null)

    const getChannels = async () => {
        try {
            if (channelsArray?.length) return

            const response: ChannelsListResponse = await apiGetChannels()

            if (response.channels?.length) {
                setChannelsArray(response.channels)
                setChannelsTotal(response.total)
            }
        } catch (err) {
            console.error(err)
        }
    }
    const changeChannel = async (id: number) => {
        if (activeChannel?.id === id) {
            setActiveChannel(null)
            return
        }

        const channel = channelsArray.find((c: ChannelForList) => c?.id === id)

        if (channel) {
            setActiveChannel(channel)
            setIsVisibleChannels(false)

            try {
                setIsLoading(true)

                const check: SuccessResponse = await apiCheckHasChannelSections(channel.id)

                setHasSections(check.success ?? false)
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const getSections = async () => {
        try {
            if (!activeChannel?.id) return

            const response: SectionResponse = await apiGetChannelSections(activeChannel.id)

            if (response.sections?.length) {
                setSectionsArray(response.sections)
                setSectionsTotal(response.total)
            }
        } catch (err) {
            console.error(err)
        }
    }
    const changeSection = (id: number) => {
        if (activeSection?.id === id) {
            setActiveSection(null)
            return
        }

        const section = sectionsArray.find((s: Section) => s.id === id)

        if (section) {
            setActiveSection(section)
            setIsVisibleSections(false)
        }
    }

    const handleCancelInCreateSection = () => {
        setIsVisibleCreateSection(false)
        setNewSectionName('')
    }

    const createSection = async () => {
        try {
            setIsLoading(true)

            const section: Section = await apiCreateNewSection(activeChannel!.id, newSectionName)

            setActiveSection(section)
            setIsVisibleCreateSection(false)
            setSectionsArray(prev => [...prev, section])
            setHasSections(true)
            setSectionsTotal(prev => prev + 1)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const sectionTitleText = () => {
        if (activeSection) return `Выбранный плейлист: ${activeSection.name}`
        return hasSections ? 'Выберите плейлист или создайте новый' : 'Создайте новый плейлист'
    }

    useEffect(() => {
        if (isVisibleCreateSection && newSectionNameRef.current) {
            newSectionNameRef.current.focus()
        }
    }, [isVisibleCreateSection])

    return (
        <div className={className}>
            <div className="mb-10 text-w500 flex flex-align-center">
                {activeChannel
                    ? (
                        <div className="upload-video__changed-channel flex flex-align-center">
                            <p>Выбран канал:</p>
                            <div className="upload-video__changed-channel_right flex flex-align-center">
                                <div className="upload-video__changed-channel_img-container img-container radius-50">
                                    <img src={`${BASE_URL}/${activeChannel.avatar_url}`} alt={activeChannel.name}/>
                                </div>
                                <p>{activeChannel.name}</p>
                            </div>
                        </div>
                    )
                    : <p>Выберите канал:</p>
                }
            </div>
            <ButtonUi
                func={() => setIsVisibleChannels(true)}
                className="w-100 mb-20"
            >
                {activeChannel ? 'Изменить..' : 'Выбрать'}
            </ButtonUi>
            <Modal visible={isVisibleChannels} setVisible={setIsVisibleChannels}>
                <UploadModal
                    apiFunc={getChannels}
                    changeFunc={changeChannel}
                    listArr={channelsArray}
                    activeItem={activeChannel}
                    total={channelsTotal}
                    emptyText="Список каналов пуст.."
                />
            </Modal>

            {isLoading && (
                <div className="recolor-svg w-100 h-100 flex-center">
                    <LoadingIcon size={50}/>
                </div>
            )}

            {!isLoading && activeChannel && (
                <>
                    <p className="mb-10 text-w500">{sectionTitleText()}</p>
                    <div className="row">
                        {hasSections && (
                            <ButtonUi
                                func={() => setIsVisibleSections(true)}
                                className="col-6"
                            >
                                {activeSection ? 'Изменить..' : 'Выбрать..'}
                            </ButtonUi>
                        )}
                        <ButtonUi
                            func={() => setIsVisibleCreateSection(true)}
                            className={hasSections ? 'col-6' : 'col-12'}
                        >
                            {activeSection ? 'Создать плейлист' : 'Создать'}
                        </ButtonUi>
                    </div>
                    <Modal visible={isVisibleSections} setVisible={setIsVisibleSections}>
                        <UploadModal
                            apiFunc={getSections}
                            changeFunc={changeSection}
                            listArr={sectionsArray}
                            activeItem={activeSection}
                            total={sectionsTotal}
                            emptyText="Список плейлистов пуст.."
                        />
                    </Modal>
                    <Modal visible={isVisibleCreateSection}
                           setVisible={setIsVisibleCreateSection}
                           closeVisible={!isLoading}
                    >
                        <>
                            <p className="mb-15 text-w500">Создать новый плейлист:</p>
                            <InputUi
                                ref={newSectionNameRef}
                                className="mb-20"
                                name="section"
                                id="section"
                                title="Название"
                                value={newSectionName}
                                setValue={setNewSectionName}
                            />

                            <div className="row gap-10">
                                <ButtonUi
                                    func={handleCancelInCreateSection}
                                    className="col-6"
                                    isDisabled={isLoading}
                                >
                                    Отмена
                                </ButtonUi>
                                <ButtonUi
                                    func={createSection}
                                    className="col-6"
                                    isLoading={isLoading}
                                >
                                    Создать плейлист
                                </ButtonUi>
                            </div>
                        </>
                    </Modal>
                </>
            )}
        </div>
    )
}

export default Upload1;