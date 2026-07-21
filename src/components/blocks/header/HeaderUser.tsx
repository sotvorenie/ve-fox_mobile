import {ComponentType, SVGProps, useState, useEffect, MouseEvent} from "react";
import { emit } from '@tauri-apps/api/event';

import {BASE_URL} from "@api/url";

import Portal from "@common/Portal";
import SettingsRedactUser from "@settings/settingsRedactUser";
import UploadVideo from "@upload/uploadVideo";

import SettingsIcon from "@icons/video-player/SettingsIcon";
import UploadIcon from "@icons/UploadIcon";
import FilmIcon from "@icons/FilmIcon";
import UserIcon from "@icons/UserIcon";
import OffIcon from "@icons/OffIcon.tsx";

import {useUserStore} from "@store/useUserStore";

interface Button {
    title: string
    icon: ComponentType<SVGProps<SVGSVGElement>>
    activeElement: boolean
    func: () => void
}

function HeaderUser() {
    const {isLogged, user} = useUserStore()

    const [isVisibleSettings, setIsVisibleSettings] = useState<boolean>(false);

    const [isVisibleRedactUser, setIsVisibleRedactUser] = useState<boolean>(false)
    const [isVisibleUploadVideo, setIsVisibleUploadVideo] = useState<boolean>(false)

    const settingsButtons: Button[] = [
        {
            title: 'Загрузить видео',
            icon: UploadIcon,
            activeElement: isVisibleUploadVideo,
            func: () => {setIsVisibleUploadVideo(prev => !prev)},
        },
        {
            title: 'Кино',
            icon: FilmIcon,
            activeElement: false,
            func: () => {},
        },
        {
            title: 'Редактировать профиль',
            icon: UserIcon,
            activeElement: isVisibleRedactUser,
            func: () => {setIsVisibleRedactUser(prev => !prev)},
        },
        {
            title: 'Настройки',
            icon: SettingsIcon,
            activeElement: false,
            func: () => {},
        },
    ]

    const closeAllBlock = () => {
        setIsVisibleUploadVideo(false)
        setIsVisibleRedactUser(false)
    }

    const handleButton = (e: MouseEvent<HTMLButtonElement>, button: Button): void => {
        e.stopPropagation()
        closeAllBlock()

        if (!button.activeElement) button.func()
    }

    const handleCloseApp = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        emit('request-close').then()
    }

    useEffect(() => {
        if (!isVisibleSettings) closeAllBlock()
    }, [isVisibleSettings])

    return (
        <div className={`settings ${isVisibleSettings ? 'is-active' : ''}`}>
            <Portal>
                <button
                    className={`
                        header__avatar img-container cursor-pointer position-absolute recolor-svg flex-center radius-50 
                        ${isVisibleSettings ? 'is-active' : ''}
                    `}
                    type="button"
                    onClick={() => setIsVisibleSettings(prev => !prev)}
                    title={user.name}
                >
                    {user.avatar_url ? (<img src={`${BASE_URL}/${user.avatar_url}`} alt=""/>) : (<UserIcon/>)}
                </button>
            </Portal>

            <Portal>
                <div
                    className={`
                        settings__inner position-fixed inset-0 z-10000 tr-opacity 
                        ${isVisibleSettings ? 'is-active' : ''}
                    `}
                    onClick={() => setIsVisibleSettings(false)}

                >
                    {settingsButtons.map((button: Button, index: number) => {
                        if (index === 0 && !isLogged) return

                        return (
                            <button
                                className={
                                    `settings__btn recolor-svg button-width-svg hover-color-accent position-absolute radius-50
                                    ${isVisibleSettings ? 'is-visible' : ''} 
                                    ${button.activeElement ? 'is-active' : ''}`
                                }
                                key={button.title}
                                title={button.title}
                                type="button"
                                onClick={(e) => {
                                    handleButton(e, button)
                                }}
                            >
                                <div className="pointer-none flex-center">
                                    <button.icon/>
                                </div>
                            </button>
                        )
                    })}

                    <button className="settings__off position-absolute recolor-svg hover-color-accent button-width-svg"
                            type="button"
                            title="Выйти из приложения"
                            onClick={handleCloseApp}
                    >
                        <OffIcon/>
                    </button>

                    <SettingsRedactUser isVisible={isVisibleRedactUser} setIsVisible={setIsVisibleRedactUser}/>

                    <UploadVideo isVisible={isVisibleUploadVideo} setIsVisible={setIsVisibleUploadVideo}/>
                </div>
            </Portal>
        </div>
    )
}

export default HeaderUser;