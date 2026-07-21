import {Link, useNavigate} from "react-router-dom";

import {Menu} from "@/types/menu.ts";

import menuItems from "@data/menuLinks.ts";

import Logo from "@icons/Logo.tsx";
import CrossIcon from "@icons/CrossIcon.tsx";

import {useUserStore} from "@store/useUserStore.ts";
import {usePagesStore} from "@store/usePagesStore.ts";

interface Props {
    className?: string
    isAbsolute?: boolean
    closeFunc?: () => void
}

function Aside({className, isAbsolute = false, closeFunc = () => {}}: Readonly<Props>) {
    const navigate = useNavigate();

    const {isLogged} = useUserStore()
    const {page} = usePagesStore()

    const pages: string[] = [
        "/",
        "/history",
        "/liked",
        "/watch_later"
    ]

    const handleMenuItem = (index: number): void => {
        navigate(pages[index])
    }

    return (
        <aside className={`main-layout__menu menu h-100 z-1000 ${className}`}>
            {isAbsolute && (
                <button className="menu__close button-width-svg recolor-svg hover-color-accent flex-center"
                        type="button"
                        onClick={closeFunc}
                >
                    <CrossIcon/>
                    Закрыть
                </button>
            )}

            <Link to="/"
                  className="menu__logo button-width-svg flex flex-align-center"
                  type="button"
            >
                <Logo/>
                <p className="h4">veFox</p>
            </Link>

            <ul className="menu__list">
                {menuItems.map((item: Menu, index: number) => (
                    <li key={item.title} className="menu__item">
                        <button
                            className={`
                                    menu__btn w-100 flex flex-align-center recolor-svg hover-color-accent text-nowrap
                                    ${index === page && 'is-active'}
                                    ${!isLogged && index > 0 ? 'pointer-none' : ''}
                                `}
                            type="button"
                            onClick={() => handleMenuItem(index)}
                        >
                            <item.icon style={{fill: 'currentColor'}}></item.icon>
                            <span>{item.title}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default Aside;