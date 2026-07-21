function ListSkeleton() {
    const skeletonItems = [...new Array(2).keys()]

    return (
        <div className="skeleton">
            {skeletonItems.map((item: number) => (
                <div key={item}
                     className="skeleton__item mb-15"
                >
                    <div className="skeleton__preview line w-100"></div>

                    <div className="flex gap-10">
                        <div className="skeleton__avatar line radius-50"></div>

                        <div className="w-100">
                            <div className="skeleton__info line"></div>
                            <div className="skeleton__info line"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListSkeleton;