
function CommentsSkeleton() {
    const skeletonItems = [...new Array(2).keys()]

    return (
        <div className="skeleton">
            {skeletonItems.map((item: number) => (
                <div key={item} className="skeleton__item flex gap-10 mb-20">
                    <div className="skeleton__avatar line"></div>

                    <div className="flex flex-column w-100">
                        <div className="skeleton__name line w-25"></div>
                        <div className="skeleton__name line w-50"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CommentsSkeleton;