import {useEffect} from "react";

import {usePagesStore} from "@store/usePagesStore.ts";

function UserPage() {
    const {setPage} = usePagesStore()

    useEffect(() => {
        setPage(4)
    }, [])

    return (
        <div>

        </div>
    )
}

export default UserPage;