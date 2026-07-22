import {useEffect} from "react";

import {CommentForListResponse} from "@/types/comment.ts";

import {commentsArr} from "@data/countArrays.ts";

import {formatCount} from "@composables/useFormatCount.ts";
import {videoListObserver} from "@composables/useVideoListObserver.ts";

import Comment from "@video/comments/Comment.tsx";
import CommentsSort from "@video/comments/CommentsSort.tsx";
import CommentsForm from "@video/comments/CommentsForm.tsx";
import CommentsSkeleton from "@ui/skeletons/CommentsSkeleton.tsx";

import SelectArrowIcon from "@icons/SelectArrowIcon.tsx";
import CrossIcon from "@icons/CrossIcon.tsx";

import {useVideoStore} from "@store/useVideoStore.ts";
import {useUserStore} from "@store/useUserStore.ts";
import {useCommentsStore} from "@store/useCommentsStore.ts";

function Comments() {
    const {video} = useVideoStore()
    const {isLogged} = useUserStore()
    const {
        comments,
        isLoading,
        isPopular,
        total,
        hasMore,
        popularComment,
        isOpen,
    } = useCommentsStore()
    const {
        setIsPopular,
        clear,
        getComments,
        getPopularComment,
        deleteComment,
        setIsOpen
    } = useCommentsStore()

    const lastElementRef = videoListObserver(() => getComments(true), hasMore, isLoading)

    const handleClickToComments = () => {
        if (isOpen) return
        setIsOpen(true)
    }

    useEffect(() => {
        if (video.id < 0) return
        clear()
        getPopularComment().then()
    }, [video.id])

    useEffect(() => {
        if (video.id < 0) return
        clear(false)
        getComments(false).then()
    }, [isPopular])

    useEffect(() => {
        document.documentElement.classList.toggle('is-lock', isOpen)
        if (isOpen && !comments?.length) getComments().then()
    }, [isOpen])

    return (
        <div className={`comments ${isOpen ? 'is-open h-100' : ''}`} onClick={handleClickToComments}>
            <div className="comments__head flex flex-align-center flex-between mb-10">
                <span className="comments__number text-w600 fs-14">{total} {formatCount(total, commentsArr)}</span>

                {!isOpen && (
                    <div className="comments__open button-width-svg recolor-svg flex-center">
                        <SelectArrowIcon/>
                    </div>
                )}

                {isOpen && total > 0 && <CommentsSort isPopular={isPopular} setIsPopular={setIsPopular}/>}

                {isOpen && (
                    <button className="comments__close button-width-svg recolor-svg flex-center"
                            type="button"
                            onClick={() => setIsOpen(false)}
                    >
                        <CrossIcon/>
                    </button>
                )}
            </div>

            {isLogged && isOpen && <CommentsForm/>}

            {isLoading && isOpen && <CommentsSkeleton/>}

            {popularComment?.id >= 0 && (
                <>
                    {isOpen ? (
                        <ul className="comments__list">
                            {comments?.map((comment: CommentForListResponse, index: number) => {
                                const isLast = index === comments.length - 2
                                return (
                                    <Comment key={comment.id}
                                             initialComment={comment}
                                             deleteComment={() => deleteComment(comment.id)}
                                             ref={isLast ? lastElementRef : null}
                                    />
                                )
                            })}
                        </ul>
                    ) : (
                        <Comment initialComment={popularComment}
                                 deleteComment={() => deleteComment(popularComment.id)}
                                 isOnePopular
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default Comments;