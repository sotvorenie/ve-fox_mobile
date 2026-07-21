export const formatVideoName = (name: string) => {
    return name?.replaceAll(" ! ", " | ")
        .replaceAll(" !! ", " || ")
        .replaceAll("№", "#")
}