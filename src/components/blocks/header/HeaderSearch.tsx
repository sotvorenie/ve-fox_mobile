import React, {useEffect, useRef} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {SpeechRecognition} from "@capacitor-community/speech-recognition";

import {showError} from "@utils/modals.ts";

import HeaderSearchHistory from "@header/HeaderSearchHistory.tsx";

import SearchIcon from "@icons/SearchIcon";
import CrossIcon from "@icons/CrossIcon";
import ArrowIcon from "@icons/ArrowIcon.tsx";
import MicrophoneIcon from "@icons/MicrophoneIcon.tsx";

import {useSearchStore} from "@store/useSearchStore";

function HeaderSearch() {
    const navigate = useNavigate()
    const location = useLocation()

    const {value, isOpen} = useSearchStore()
    const {setValue, search, setIsOpen} = useSearchStore()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleSearchText = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(event.target.value)
    }

    const clearSearchName = (): void => {
        setValue('')
    }

    const handleSearch = async () => {
        setIsOpen(false)
        location.pathname === '/search' ? await search() : navigate("/search")
        inputRef.current?.blur()
    }

    const handleVoiceSearch = async () => {
        try {
            const { available } = await SpeechRecognition.available();
            if (!available) {
                await showError(
                    'Ошибка голосового ввода',
                    'Распознавание речи не поддерживается на этом устройстве'
                )
                return
            }

            const permStatus = await SpeechRecognition.checkPermissions();
            if (permStatus.speechRecognition !== "granted") {
                const req = await SpeechRecognition.requestPermissions();
                if (req.speechRecognition !== "granted") {
                    await showError(
                        'Ошибка голосового ввода',
                        'Нет разрешений на использование микрофона/распознавания речи'
                    )
                    return
                }
            }

            const result = await SpeechRecognition.start({
                maxResults: 1,
                prompt: "Скажите поисковый запрос...",
                popup: true,
                partialResults: false,
            })

            if (result?.matches && result.matches.length > 0) {
                const spokenText = result.matches[0]
                setValue(spokenText)
                handleSearch().then()
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (isOpen) {
            SpeechRecognition.checkPermissions().then((status) => {
                if (status.speechRecognition !== 'granted') {
                    SpeechRecognition.requestPermissions().then()
                }
            })
        }
    }, [isOpen])

    return (
        <div className="header__search flex flex-align-center position-relative">
            {isOpen ? (
                <>
                    <button className="header__search_back button-width-svg recolor-svg flex-center"
                            type="button"
                            onClick={() => setIsOpen(false)}
                    >
                        <ArrowIcon/>
                    </button>

                    <div className="header__search_wrapper flex h-100 overflow-hidden position-relative z-1">
                        <input className="header__search_input input w-100"
                               ref={inputRef}
                               onChange={handleSearchText}
                               onKeyDown={async (e) => {
                                   if (e.key === "Enter") await handleSearch()
                               }}
                               value={value}
                               type="text"
                               placeholder="Введите запрос"
                        />

                        <button className="header__search_btn flex-center recolor-svg"
                                type="button"
                                aria-label="Поиск"
                                title="Поиск"
                                onClick={handleSearch}
                        >
                            <SearchIcon/>
                        </button>
                        {value && (
                            <button
                                className="header__search_clear recolor-svg button-width-svg flex-center hover-color-accent"
                                type="button"
                                aria-label="Очистить"
                                title="Очистить"
                                onClick={clearSearchName}
                            >
                                <CrossIcon/>
                            </button>
                        )}
                    </div>

                    <button className="header__search_voice button-width-svg recolor-svg flex-center"
                            type="button"
                            onClick={handleVoiceSearch}
                    >
                        <MicrophoneIcon/>
                    </button>

                    <HeaderSearchHistory handleSearch={handleSearch}/>
                </>
            ) : (
                <button className="header__search_open recolor-svg button-width-svg flex-center"
                        type="button"
                        onClick={() => setIsOpen(true)}
                >
                    <SearchIcon/>
                </button>
            )}
        </div>
    )
}

export default HeaderSearch;