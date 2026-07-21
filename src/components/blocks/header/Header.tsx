import {Link} from "react-router-dom";

import HeaderSearch from "@header/HeaderSearch";

import Logo from "@icons/Logo.tsx";

import {useSearchStore} from "@store/useSearchStore.ts";

function Header() {
    const {isOpen} = useSearchStore()

    return(
        <header className={`
                    header flex flex-align-center flex-between w-100 
                    ${isOpen ? 'search-is-open' : ''}
                `}
        >
            {!isOpen && (
                <Link className="header__logo flex flex-align-center gap-10" to={"/"}>
                    <Logo/>
                    <span className="h4">veFox</span>
                </Link>
            )}

            <HeaderSearch/>
        </header>
    )
}

export default Header;