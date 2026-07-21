
function ListRowSkeleton() {
    const skeletonItems = [...new Array(6).keys()];

    return (
        <div className="skeleton row">
            {skeletonItems.map((item: number) => (
                <div key={item}
                     className="skeleton__item col-4"
                >
                    <div className="skeleton__preview line"></div>

                    <div className="flex">
                        <div className="skeleton__avatar line"></div>

                        <div style={{width:'100%'}}>
                            <div className="skeleton__name line"></div>

                            <div className="skeleton__channel line"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListRowSkeleton;