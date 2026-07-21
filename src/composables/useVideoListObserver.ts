import {useCallback, useRef} from "react";

export const videoListObserver = (fetchData: () => Promise<void>, hasMore: boolean, isLoading: boolean) => {
    const observer = useRef<IntersectionObserver | null>(null)

    return useCallback((node: HTMLLIElement | null) => {
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                fetchData().then()
            }
        })

        if (node) observer.current.observe(node)
    }, [isLoading, hasMore, fetchData])
}