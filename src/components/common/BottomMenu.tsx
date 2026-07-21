import {useNavigate} from "react-router-dom";

import {Menu} from "@/types/menu.ts";

import menuItems from "@data/menuLinks.ts";

import {useUserStore} from "@store/useUserStore.ts";
import {usePagesStore} from "@store/usePagesStore.ts";

function BottomMenu() {
    const navigate = useNavigate();

    const {isLogged} = useUserStore()
    const {page} = usePagesStore()

    const pages: string[] = [
        "/",
        "/history",
        "/liked",
        "/watch_later",
        "/user"
    ]

    const handleMenuItem = (index: number): void => {
        navigate(pages[index])
    }

    return (
        <div className="menu w-100">
            <ul className="menu__list flex flex-between flex-align-center">
                {menuItems.map((item: Menu, index: number) => (
                    <li key={item.title} className="menu__item">
                        <button
                            className={`
                                    menu__btn recolor-svg hover-color-accent flex-center
                                    ${index === page && 'is-active'}
                                    ${!isLogged && index > 0 ? 'pointer-none' : ''}
                                `}
                            type="button"
                            onClick={() => handleMenuItem(index)}
                        >
                            <item.icon/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BottomMenu;