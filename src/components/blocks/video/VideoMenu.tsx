import React from "react";
import {useLocation} from "react-router-dom";

import {apiDeleteFromWatchLater, apiSetWatchLater} from "@api/watch_later/watchLater.ts";

import EllipsisIcon from "@icons/EllipsisIcon.tsx";

interface Props {
    id: number
    isOpenMenu: boolean
    setIsOpenMenu: (isVisible: any) => void
    isSmall?: boolean
}

function VideoMenu({id, isOpenMenu = false, setIsOpenMenu, isSmall = false}: Readonly<Props>) {
    const location = useLocation()

    const handleMenuOpen = (event: React.MouseEvent): void => {
        event.stopPropagation()
        event.preventDefault()
        setIsOpenMenu((prev: boolean) => !prev)
    }

    const buttons = [
        {
            title: 'Смотреть позже',
            func: async () => {
                await apiSetWatchLater(id)
                setIsOpenMenu(false)
            },
            notIn: '/watch_later',
        },
        {
            title: 'Удалить из "Смотреть позже"',
            func: async () => {
                await apiDeleteFromWatchLater(id)
                const event = new CustomEvent('watchLaterDelete', {
                    detail: {id}
                })
                globalThis.dispatchEvent(event)
                setIsOpenMenu(false)
            },
            in: '/watch_later',
        },
    ]

    const handleButtonFunc = (event: React.MouseEvent, func: Function) => {
        event.stopPropagation()
        event.preventDefault()
        func()
    }

    const titleText = isOpenMenu ? 'Закрыть меню' : 'Действия с видео'

    return (
        <div className={`video-menu ${isOpenMenu ? 'is-active' : ''} ${isSmall ? 'is-small' : ''}`}>
            <button
                className="video-menu__open recolor-svg button-width-svg flex-center radius-50 position-absolute z-10"
                type="button"
                onClick={handleMenuOpen}
                title={titleText}
            >
                <EllipsisIcon/>
            </button>

            <div className="video-menu__content position-absolute text-nowrap flex flex-column gap-10 z-10">
                {buttons?.map(button => {
                    if (location.pathname === button.notIn || (button.in && location.pathname !== button.in)) return
                    return (
                        <button key={button.title}
                                className="hover-color-accent"
                                type="button"
                                onClick={(e) => handleButtonFunc(e, button.func)}
                        >
                            {button.title}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default VideoMenu;