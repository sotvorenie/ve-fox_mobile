import {useEffect} from "react";

import {usePagesStore} from "@store/usePagesStore.ts";

function SettingsPage() {
    const {setPage} = usePagesStore()

    useEffect(() => {
        setPage(5)
    }, [])

    return (
        <div className="settings-page">
            <div className="settings-page__head flex flex-align-center flex-between">
                <p className="h5">Настройки</p>
            </div>
        </div>
    )
}

export default SettingsPage;