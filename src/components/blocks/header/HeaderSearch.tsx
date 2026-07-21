import React, {useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";

import SearchIcon from "@icons/SearchIcon";
import CrossIcon from "@icons/CrossIcon";

import {useSearchStore} from "@store/useSearchStore";
import HeaderSearchHistory from "@header/HeaderSearchHistory.tsx";

function HeaderSearch() {
    const navigate = useNavigate()
    const location = useLocation()

    const {value, setValue, search} = useSearchStore()

    const [inFocus, setInFocus] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)


    const handleSearchText = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(event.target.value)
    }

    const clearSearchName = (): void => {
        setValue('')
    }

    const handleSearch = async () => {
        location.pathname === '/search' ? await search() : navigate("/search")
        inputRef.current?.blur()
    }

    return (
        <div className="header__search position-relative">
            <div className="header__search_wrapper flex overflow-hidden w-100 h-100 position-relative z-1">
                <input className="header__input input"
                       ref={inputRef}
                       onChange={handleSearchText}
                       onKeyDown={async (e) => {
                           if (e.key === "Enter") await handleSearch()
                       }}
                       onFocus={() => setInFocus(true)}
                       onBlur={() => setTimeout(() => setInFocus(false), 100)}
                       value={value}
                       type="text"
                       placeholder="Введите запрос"
                />

                <button className="header__btn flex-center recolor-svg"
                        type="button"
                        aria-label="Поиск"
                        title="Поиск"
                        onClick={handleSearch}
                >
                    <SearchIcon/>
                </button>
                {value && (
                    <button
                        className="header__clear recolor-svg button-width-svg flex-center hover-color-accent"
                        type="button"
                        aria-label="Очистить"
                        title="Очистить"
                        onClick={clearSearchName}
                    >
                        <CrossIcon/>
                    </button>
                )}
            </div>

            <HeaderSearchHistory inFocus={inFocus} handleSearch={handleSearch}/>
        </div>
    )
}

export default HeaderSearch;