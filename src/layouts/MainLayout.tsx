import {useState} from "react";
import {Outlet} from "react-router-dom";

import Header from "@header/Header";
import Aside from "@common/Aside.tsx";
import Snowfall from "@ui/winter/Snowfall.tsx";

function MainLayout() {
    const isWinter = () => {
        const month = new Date().getMonth() + 1

        return month === 12 || month < 3
    }

    const [headerOptions, setHeaderOptions] = useState({ visibleNavigation: false, isOnlyBack: false });

    return (
        <div className="main-layout flex h-100">
            {isWinter() && <Snowfall/>}

            <Aside/>

            <div className="main-layout__right w-100 flex flex-column">
                <Header {...headerOptions}/>

                <div className="main-layout__content">
                    <Outlet context={{setHeaderOptions}}/>
                </div>
            </div>
        </div>
    )
}

export default MainLayout;