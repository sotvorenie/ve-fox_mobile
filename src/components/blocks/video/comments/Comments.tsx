import {useEffect} from "react";

import {commentsArr} from "@data/countArrays.ts";

import {formatCount} from "@composables/useFormatCount.ts";
import {videoListObserver} from "@composables/useVideoListObserver.ts";

import Comment from "@video/comments/Comment.tsx";
import CommentsSort from "@video/comments/CommentsSort.tsx";
import CommentsForm from "@video/comments/CommentsForm.tsx";
import CommentsSkeleton from "@ui/skeletons/CommentsSkeleton.tsx";

import {useVideoStore} from "@store/useVideoStore.ts";
import {useUserStore} from "@store/useUserStore.ts";
import {useCommentsStore} from "@store/useCommentsStore.ts";
import {CommentForListResponse} from "@/types/comment.ts";

function Comments() {
    const {video} = useVideoStore()
    const {isLogged} = useUserStore()
    const {
        comments,
        isLoading,
        isPopular,
        total,
        hasMore,
    } = useCommentsStore()
    const {
        setIsPopular,
        clear,
        getComments,
        deleteComment
    } = useCommentsStore()

    const lastElementRef = videoListObserver(() => getComments(true), hasMore, isLoading)

    useEffect(() => {
        if (video.id < 0) return
        clear()
        getComments().then()
    }, [video.id])

    useEffect(() => {
        if (video.id < 0) return
        clear(false)
        getComments(false).then()
    }, [isPopular])

    return (
        <div className="comments">
            <div className="comments__head flex flex-align-center mb-30">
                <span className="comments__number h6">{total} {formatCount(total, commentsArr)}</span>

                <CommentsSort isPopular={isPopular} setIsPopular={setIsPopular}/>
            </div>

            {isLogged && <CommentsForm/>}

            {isLoading && <CommentsSkeleton/>}

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
        </div>
    )
}

export default Comments;