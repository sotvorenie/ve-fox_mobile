import {forwardRef, useState} from "react";

import {CommentForListResponse} from "@/types/comment.ts";
import {LikeResponse} from "@/types/like.ts";

import {BASE_URL} from "@api/url.ts";
import {apiEditComment, apiLikeComment} from "@api/comment/comment.ts";

import {formatDateAgo} from "@composables/useFormatDateAgo.ts";

import CommentMenu from "@video/comments/CommentMenu.tsx";
import CommentsInput from "@video/comments/CommentsInput.tsx";
import CommentAnswer from "@video/comments/CommentAnswer.tsx";

import LikeIcon from "@icons/LikeIcon.tsx";

import {useUserStore} from "@store/useUserStore.ts";

interface Props {
    initialComment: CommentForListResponse
    deleteComment: (id: number) => Promise<void>
    answerLevel?: number
}

const Comment = forwardRef<HTMLLIElement, Props>(({
    initialComment,
    deleteComment,
    answerLevel = 1
}, ref) => {
    const {user} = useUserStore()

    const [comment, setComment] = useState<CommentForListResponse>(initialComment)

    const [isRedact, setIsRedact] = useState<boolean>(false)
    const [newText, setNewText] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isVisibleInputAnswer, setIsVisibleInputAnswer] = useState<boolean>(false)

    const clear = () => {
        setIsRedact(false)
        setNewText('')
    }

    const handleRedact = () => {
        setNewText(comment.text)
        setIsRedact(true)
    }

    const saveRedact = async () => {
        try {
            setIsLoading(true)
            const response: CommentForListResponse = await apiEditComment(comment.id, newText)
            if (response) setComment(response)
            clear()
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLike = async () => {
        try {
            setIsLoading(true)
            const response: LikeResponse = await apiLikeComment(comment.id)
            if (response) setComment(prev => ({
                ...prev,
                is_liked: response.is_liked,
                likes: response.is_liked ? prev.likes + 1 : prev.likes - 1
            }))
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <li className="comments__item comment flex gap-10 mb-15 position-relative" ref={ref}>
            <div className="comment__avatar img-container radius-50">
                <img src={`${BASE_URL}${comment.user?.avatar_url}`} alt={comment.user?.name}/>
            </div>

            {isRedact ? (
                <CommentsInput commentText={newText}
                               setCommentText={setNewText}
                               addNewComment={saveRedact}
                               cancel={() => {
                                   setNewText('')
                                   setIsRedact(false)
                               }}
                               hideButton={false}
                               isLoading={isLoading}
                               ref={(element) => element?.focus()}
                />
            ) : (
                <>
                    <div className="comment__right w-100">
                        <div className="comment__head flex gap-10 flex-align-center line-height-1 fs-14">
                            <span className="comment__name text-w700">{comment.user.name}</span>

                            <div className="comment__date flex">
                                <span className="comment__info">{formatDateAgo(comment.date)}</span>
                                {comment.is_redacted && <span className="comment__info">(изменено)</span>}
                            </div>
                        </div>

                        <p className="comment__text fs-16">{comment.text}</p>

                        {comment.user.id !== user.id && (
                            <div className="comment__actions flex flex-align-center gap-20 line-height-1 mb-15">
                                <button className={`
                                            comment__like recolor-svg button-width-svg hover-color-accent flex flex-align-center fs-14
                                            ${comment.is_liked ? 'is-liked' : ''}
                                        `}
                                        type="button"
                                        title={comment.is_liked ? 'Убрать оценку' : 'Оценить комментарий'}
                                        onClick={handleLike}
                                        disabled={isLoading}
                                >
                                    <LikeIcon/>
                                    {comment.likes > 0 && <span>{comment.likes}</span>}
                                </button>

                                {answerLevel <= 5 && (
                                    <button className="text-w500 fs-14 hover-color-accent"
                                            type="button"
                                            onClick={() => setIsVisibleInputAnswer(true)}
                                    >
                                        Ответить
                                    </button>
                                )}
                            </div>
                        )}

                        <CommentAnswer comment={comment}
                                       isVisibleInputAnswer={isVisibleInputAnswer}
                                       setIsVisibleInputAnswer={setIsVisibleInputAnswer}
                                       answerLevel={answerLevel}
                        />
                    </div>

                    {comment.user.id === user.id && !isLoading && (
                        <CommentMenu handleRedact={handleRedact}
                                     deleteComment={() => deleteComment(comment.id)}
                        />
                    )}
                </>
            )}
        </li>
    )
})

export default Comment;