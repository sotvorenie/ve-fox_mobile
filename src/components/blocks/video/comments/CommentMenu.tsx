import {useEffect, useRef, useState} from "react";

import {showConfirm} from "@utils/modals.ts";

import EllipsisIcon from "@icons/EllipsisIcon.tsx";
import RedactIcon from "@icons/RedactIcon.tsx";
import DeleteIcon from "@icons/DeleteIcon.tsx";

interface Props {
    handleRedact: () => void
    deleteComment: () => void
}

function CommentMenu({handleRedact, deleteComment}: Readonly<Props>) {
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)

    const openMenuBtnRef = useRef<HTMLButtonElement | null>(null)

    const handleDelete = async () => {
        const confirm = await showConfirm(
            'Удаление комментария',
            'Вы действительно хотите удалить комментарий?'
        )

        if (confirm) deleteComment()
    }

    const menuButtons = [
        {
            title: 'Изменить',
            icon: RedactIcon,
            func: handleRedact,
        },
        {
            title: 'Удалить',
            icon: DeleteIcon,
            func: handleDelete,
        },
    ]

    useEffect(() => {
        const handleFunc = (event: MouseEvent) => {
            if (openMenuBtnRef.current?.contains(event.target as Node)) return
            setMenuIsOpen(false)
        }
        globalThis.addEventListener('click', handleFunc)

        return () => globalThis.removeEventListener('click', handleFunc)
    }, [])

    return (
        <div className="comment__menu position-absolute right-0">
            <button
                className="comment__menu-open button-width-svg recolor-svg hover-color-accent flex-center"
                title={menuIsOpen ? 'Закрыть' : 'Действия с комментарием'}
                onClick={() => setMenuIsOpen(prev => !prev)}
                ref={openMenuBtnRef}
                type="button"
            >
                <EllipsisIcon/>
            </button>

            <div className={`comment__menu-block flex flex-column z-1 tr-opacity ${menuIsOpen ? 'is-active' : ''}`}>
                {menuButtons.map(button => (
                    <button key={button.title}
                            className="comment__menu-btn hover-color-accent fs-16 text-left text-nowrap recolor-svg flex flex-align-center"
                            type="button"
                            onClick={button.func}
                    >
                        <button.icon/>
                        {button.title}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CommentMenu;