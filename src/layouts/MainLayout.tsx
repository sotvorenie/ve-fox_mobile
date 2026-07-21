import {useState} from "react";
import {Outlet} from "react-router-dom";

import Header from "@header/Header";
import BottomMenu from "../components/common/BottomMenu.tsx";
import Snowfall from "@ui/winter/Snowfall.tsx";

function MainLayout() {
    const isWinter = () => {
        const month = new Date().getMonth() + 1

        return month === 12 || month < 3
    }

    const [headerOptions, setHeaderOptions] = useState({ visibleNavigation: false, isOnlyBack: false });

    return (
        <div className="main-layout flex flex-column h-100">
            {isWinter() && <Snowfall/>}

            <Header {...headerOptions}/>

            <div className="main-layout__content w-100">
                <Outlet context={{setHeaderOptions}}/>
            </div>

            <BottomMenu/>
        </div>
    )
}

export default MainLayout;