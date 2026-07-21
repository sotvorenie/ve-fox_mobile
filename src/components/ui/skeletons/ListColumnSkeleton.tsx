import useWidthWatcher from "@composables/useWidthWatcher";

interface Props {
    isRecommended: boolean
}

function ListColumnSkeleton({isRecommended = false}: Readonly<Props>) {
    const skeletonItems = [...new Array(isRecommended ? 6 : 2).keys()]

    const isLaptop: boolean = useWidthWatcher('(max-width: 1440px)')

    return (
        <div className={`skeleton is-column ${isRecommended ? 'is-recommended' : ''}`}>
            {skeletonItems.map((item: number) => (
                <div key={item}
                     className="skeleton__item flex"
                >
                    <div className="skeleton__preview line"></div>

                    <div style={{width: '100%'}}>
                        <div className="skeleton__name line"></div>
                        {!isLaptop && <div className="skeleton__date line"></div>}

                        {!isRecommended && (
                            <div className="flex flex-align-center">
                                <div className="skeleton__avatar line"></div>

                                <div className="skeleton__channel line"></div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListColumnSkeleton;