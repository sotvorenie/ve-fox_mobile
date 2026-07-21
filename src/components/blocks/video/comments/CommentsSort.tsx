import {useEffect, useRef, useState} from "react";

import SortIcon from "@icons/SortIcon.tsx";

interface Props {
    isPopular: boolean
    setIsPopular: (isPopular: boolean) => void
}

function CommentsSort({isPopular, setIsPopular}: Readonly<Props>) {
    const [sortIsOpen, setSortIsOpen] = useState<boolean>(false)

    const commentsSortRef = useRef<HTMLDivElement | null>(null)

    const handleSortBtn = (popularValue: boolean) => {
        setIsPopular(popularValue)
        setSortIsOpen(false)
    }

    useEffect(() => {
        const handleFunc = (event: MouseEvent) => {
            if (commentsSortRef.current?.contains(event.target as Node)) return
            setSortIsOpen(false)
        }
        globalThis.addEventListener('click', handleFunc)

        return () => globalThis.removeEventListener('click', handleFunc)
    }, [])

    return (
        <div className="comments__sort position-relative" ref={commentsSortRef}>
            <button className="comments__sort-open recolor-svg hover-color-accent flex gap-10"
                    type="button"
                    onClick={() => setSortIsOpen(prev => !prev)}
            >
                <SortIcon/>
                <span className="text-w500">Упорядочить</span>
            </button>

            <div className={`
                            comments__sort-block flex flex-column position-absolute z-1 text-nowrap tr-opacity fs-16
                            ${sortIsOpen ? 'is-active' : ''}
                        `}>
                <button className={`comments__sort-btn hover-color-accent text-left ${isPopular ? '' : 'is-active'}`}
                        type="button"
                        onClick={() => handleSortBtn(false)}
                >
                    Сначала новые
                </button>
                <button className={`comments__sort-btn hover-color-accent text-left ${isPopular ? 'is-active' : ''}`}
                        type="button"
                        onClick={() => handleSortBtn(true)}
                >
                    Сначала популярные
                </button>
            </div>
        </div>
    )
}

export default CommentsSort;