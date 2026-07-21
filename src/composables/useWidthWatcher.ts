import {useState, useEffect} from "react";

const useWidthWatcher = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = globalThis.matchMedia(query);

        const updateMatches = () => {
            setMatches(media.matches);
        };

        updateMatches();

        media.addEventListener('change', updateMatches);

        return () => {
            media.removeEventListener('change', updateMatches);
        };
    }, [query]);

    return matches;
}

export default useWidthWatcher;