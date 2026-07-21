import React, {useEffect} from "react";

import {apiDeleteFromSearchHistory, apiGetSearchHistory} from "@api/search/search.ts";

import DeleteIcon from "@icons/DeleteIcon.tsx";

import {useUserStore} from "@store/useUserStore.ts";
import {useSearchStore} from "@store/useSearchStore.ts";

interface Props {
    handleSearch: () => void
}

function HeaderSearchHistory({handleSearch}: Readonly<Props>) {
    const {isLogged} = useUserStore()

    const {history, isOpen} = useSearchStore()
    const {setHistory, setValue} = useSearchStore()

    const getHistory = async () => {
        if (isLogged) {
            try {
                const response = await apiGetSearchHistory()
                if (response.search_history) setHistory(response.search_history)
            } catch (err) {
                console.error(err)
            }
        } else {
            const history = JSON.parse(localStorage.getItem("search-history") ?? '[]')
            setHistory(history)
        }
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, item: string) => {
        e.stopPropagation()
        const newHistory = history.filter((s) => s !== item)
        setHistory(newHistory)
        if (isLogged) {
            apiDeleteFromSearchHistory(item).catch(console.error)
        } else {
            localStorage.setItem('search-history', JSON.stringify(newHistory))
        }
    }

    const handleSearchFromHistory = (item: string) => {
        setValue(item)
        handleSearch()
    }

    useEffect(() => {
        getHistory().then()
    }, [])

    return (
        <ul className={`
                search-history position-absolute z-10000
                ${isOpen ? 'is-active' : ''}
            `}
        >
            {history?.map((item) => (
                <li key={item}
                    className="search-history__item hover-color-accent w-100 text-left flex gap-10 cursor-pointer"
                    onClick={() => handleSearchFromHistory(item)}
                >
                    <span className="text-ellipsis">{item}</span>

                    <button
                        className="search-history__delete button-width-svg recolor-svg hover-color-accent radius-50 flex-center"
                        type="button"
                        title="Удалить запрос"
                        onClick={(e) => handleDelete(e, item)}
                    >
                        <DeleteIcon/>
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default HeaderSearchHistory;