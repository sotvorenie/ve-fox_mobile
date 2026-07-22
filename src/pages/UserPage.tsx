import {useEffect} from "react";
import {Link} from "react-router-dom";

import ButtonUi from "@ui/ButtonUi.tsx";

import SettingsIcon from "@icons/video-player/SettingsIcon.tsx";
import EmptyIcon from "@icons/EmptyIcon.tsx";

import {usePagesStore} from "@store/usePagesStore.ts";
import {useUserStore} from "@store/useUserStore.ts";

function UserPage() {
    const {setPage} = usePagesStore()
    const {isLogged} = useUserStore();

    useEffect(() => {
        setPage(4)
    }, [])

    return (
        <div className="user-page h-100">
            <div className="user-page__head flex flex-align-center flex-between">
                <p className="h5">Профиль</p>

                <Link to="/settings">
                    <button className="user-page__btn button-width-svg recolor-svg flex-center hover-color-accent"
                            type="button"
                    >
                        <SettingsIcon/>
                    </button>
                </Link>
            </div>

            {isLogged ? (
                <>

                </>
            ) : (
                <div className="user-page__empty absolute-center flex-center flex-column">
                    <span className="recolor-svg">
                        <EmptyIcon/>
                    </span>

                    <p className="mb-15">Вы не авторизованы</p>

                    <Link to="/auth" className="w-100">
                        <ButtonUi className="w-100" func={() => {}}>
                            Войти
                        </ButtonUi>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default UserPage;