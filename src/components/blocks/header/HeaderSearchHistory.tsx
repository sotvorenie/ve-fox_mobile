import {useEffect} from "react";

import {apiDeleteFromSearchHistory, apiGetSearchHistory} from "@api/search/search.ts";

import DeleteIcon from "@icons/DeleteIcon.tsx";

import {useUserStore} from "@store/useUserStore.ts";
import {useSearchStore} from "@store/useSearchStore.ts";

interface Props {
    inFocus: boolean
    handleSearch: () => void
}

function HeaderSearchHistory({inFocus, handleSearch}: Readonly<Props>) {
    const {isLogged} = useUserStore()

    const {history} = useSearchStore()
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

    const handleDelete = (item: string) => {
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
        console.log(useSearchStore.getState().value)
        handleSearch()
    }

    useEffect(() => {
        getHistory().then()
    }, [])

    return (
        <ul className={`
                search-history position-absolute w-100
                ${inFocus && history?.length ? 'is-active' : ''}
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
                        onClick={() => handleDelete(item)}
                    >
                        <DeleteIcon/>
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default HeaderSearchHistory;