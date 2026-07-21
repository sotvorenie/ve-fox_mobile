import HeaderSearch from "@header/HeaderSearch";
import HeaderNavigation from "@header/HeaderNavigation";
import HeaderUser from "@header/HeaderUser";


interface Props {
    visibleNavigation?: boolean
    isOnlyBack?: boolean
}

function Header({visibleNavigation = false, isOnlyBack = false}: Readonly<Props>) {

    return(
        <header className={`header flex flex-align-center flex-justify-center top-0 position-sticky ${!visibleNavigation}`}>
            {visibleNavigation && <HeaderNavigation isOnlyBack={isOnlyBack}/>}

            <HeaderSearch/>

            <HeaderUser/>
        </header>
    )
}

export default Header;