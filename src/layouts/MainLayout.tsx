import {Outlet, useMatch} from "react-router-dom";

import Header from "@header/Header";
import BottomMenu from "../components/common/BottomMenu.tsx";
import Snowfall from "@ui/winter/Snowfall.tsx";

function MainLayout() {

    const isWinter = () => {
        const month = new Date().getMonth() + 1

        return month === 12 || month < 3
    }

    const isVideoPage = useMatch('/video/:id')

    return (
        <div className="main-layout flex flex-column h-100">
            {isWinter() && <Snowfall/>}

            <Header/>

            <div className={`main-layout__content w-100 h-100 ${isVideoPage ? 'is-video-page' : ''}`}>
                <Outlet/>
            </div>

            {!isVideoPage && <BottomMenu/>}
        </div>
    )
}

export default MainLayout;