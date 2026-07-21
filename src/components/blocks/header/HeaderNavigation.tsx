import {useNavigate, Link} from "react-router-dom";

import useWidthWatcher from "@composables/useWidthWatcher";

import ArrowIcon from "@icons/ArrowIcon";
import Logo from "@icons/Logo.tsx";

import {useRouterMapStore} from "@store/useRouterMapStore.ts";

interface Props {
    isOnlyBack?: boolean
}

function HeaderNavigation({isOnlyBack = false}: Readonly<Props>) {
    const navigate = useNavigate();

    const {goBack, goForward} = useRouterMapStore()

    const isLaptop: boolean = useWidthWatcher('(max-width: 1440px)')

    const handleBack = () => {
        const path = goBack()
        if (path) navigate(path)
    }

    const handleForward = () => {
        const path = goForward()
        if (path) navigate(path)
    }
    return (
        <div className="header__btn-bar flex flex-align-center position-absolute">
            {!isOnlyBack && (
                <Link to="/" className="header__logo button-width-svg flex-center">
                    <Logo/>
                </Link>
            )}

            <button className="header__back flex flex-align-center recolor-svg hover-color-accent z-1000"
                    onClick={handleBack}
                    title={isLaptop ? 'Назад' : ''}
                    type="button"
            >
                <ArrowIcon/>
                <span className="h5">Назад</span>
            </button>

            {!isOnlyBack && (
                <button className="header__forward flex flex-align-center recolor-svg hover-color-accent z-1000"
                        onClick={handleForward}
                        title={isLaptop ? 'Вперед' : ''}
                        type="button"
                >
                    <ArrowIcon/>
                    <span className="h5">Вперед</span>
                </button>
            )}
        </div>
    )
}

export default HeaderNavigation;