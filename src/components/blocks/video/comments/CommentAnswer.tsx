import {useEffect, useState} from "react";

import {CommentDeletedCount, CommentForListResponse, CommentsListResponse} from "@/types/comment.ts";

import {commentAnswersArr} from "@data/countArrays.ts";

import {BASE_URL} from "@api/url.ts";
import {apiAddNewComment, apiDeleteComment, apiGetCommentAnswers} from "@api/comment/comment.ts";

import {formatCount} from "@composables/useFormatCount.ts";

import CommentsInput from "@video/comments/CommentsInput.tsx";
import Comment from "@video/comments/Comment.tsx";
import CommentsSkeleton from "@ui/skeletons/CommentsSkeleton.tsx";

import SelectArrowIcon from "@icons/SelectArrowIcon.tsx";

import {useVideoStore} from "@store/useVideoStore.ts";
import {useUserStore} from "@store/useUserStore.ts";
import {useCommentsStore} from "@store/useCommentsStore.ts";

interface Props {
    comment: CommentForListResponse
    isVisibleInputAnswer: boolean
    setIsVisibleInputAnswer: (isVisibleInputAnswer: boolean) => void
    answerLevel: number
}

function CommentAnswer({
                           comment,
                           isVisibleInputAnswer,
                           setIsVisibleInputAnswer,
                           answerLevel,
}: Readonly<Props>) {
    const {video} = useVideoStore()
    const {user} = useUserStore()
    const {total: commentsTotal} = useCommentsStore()
    const {setTotal: setCommentsTotal} = useCommentsStore()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [answerText, setAnswerText] = useState<string>('')
    const [answerComments, setAnswerComments] = useState<CommentForListResponse[]>([])
    const [isVisibleAnswers, setIsVisibleAnswers] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0)
    const [total, setTotal] = useState<number>(comment.question_comments_count)
    const [hasMore, setHasMore] = useState<boolean>(true)

    const cancel = () => {
        setIsVisibleInputAnswer(false)
        setAnswerText('')
    }

    const getAnswers = async () => {
        if (!hasMore) return

        try {
            setIsLoading(true)
            const response: CommentsListResponse = await apiGetCommentAnswers(comment.id, page + 1)
            if (response?.comments?.length) {
                setAnswerComments(prev => [...prev, ...response.comments])
                setHasMore(response.has_more)
                setPage(response.page)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const addAnswer = async (text: string) => {
        try {
            setIsAdding(true)

            const response: CommentForListResponse = await apiAddNewComment(video.id, text, comment.id)
            if (response) {
                setAnswerComments(prev => [response, ...prev])
                setTotal(prev => prev + 1)
                setCommentsTotal(commentsTotal + 1)
                setAnswerText('')
            }
            setIsVisibleInputAnswer(false)
        } catch (err) {
            console.error(err)
        } finally {
            setIsAdding(false)
        }
    }

    const deleteAnswer = async (id: number) => {
        try {
            const response: CommentDeletedCount = await apiDeleteComment(id)
            if (response) {
                setAnswerComments(prev => prev?.filter(c => c.id !== id))
                setTotal(prev => prev - response.deleted_count)
                setCommentsTotal(commentsTotal - response.deleted_count)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (isVisibleAnswers) getAnswers().then()
    }, [isVisibleAnswers])

    return (
        <>
            {isVisibleInputAnswer && (
                <div className="comment__input flex flex-align-center gap-10">
                    <div className="comment__avatar img-container radius-50">
                        <img src={`${BASE_URL}${user?.avatar_url}`} alt={comment.user?.name}/>
                    </div>
                    <CommentsInput commentText={answerText}
                                   setCommentText={setAnswerText}
                                   addNewComment={() => addAnswer(answerText)}
                                   cancel={cancel}
                                   isLoading={isAdding}
                                   hideButton={false}
                                   ref={(element) => element?.focus()}
                    />
                </div>
            )}

            {/* старое условие вывода скрытия: чтобы кнопка "скрыть" бал только на 1-м уровне */}
            {/* total > 0 && (!isVisibleAnswers || (isVisibleAnswers && answerLevel === 1)) */}
            {total > 0 && (
                <button className={`
                            comment__answer-count mb-10 flex flex-align-center fs-16 text-w500 recolor-svg hover-color-accent line-height-1
                            ${isVisibleAnswers ? 'is-active' : ''}
                        `}
                        type="button"
                        title={isVisibleAnswers ? 'Скрыть ответы' : 'Показать ответы'}
                        onClick={() => setIsVisibleAnswers(prev => !prev)}
                >
                    {isVisibleAnswers ? (
                        <span>Скрыть</span>
                    ) : (
                        <>
                            <span>{total}</span>
                            <span>{formatCount(total, commentAnswersArr)}</span>
                        </>
                    )}

                    <SelectArrowIcon/>
                </button>
            )}

            {isVisibleAnswers && (
                <ul className="comment__answers mb-10">
                    {answerComments?.map(answer => (
                        <Comment key={answer.id}
                                 initialComment={answer}
                                 deleteComment={deleteAnswer}
                                 answerLevel={answerLevel + 1}
                        />
                    ))}
                </ul>
            )}

            {total > answerComments?.length && answerLevel > 1 && isVisibleAnswers && !isLoading && (
                <button
                    className="comment__answer-count mb-10 flex flex-align-center fs-16 text-w500 recolor-svg hover-color-accent line-height-1"
                    type="button"
                    onClick={getAnswers}
                >
                    <span>Другие ответы</span>
                    <SelectArrowIcon/>
                </button>
            )}

            {isLoading && <CommentsSkeleton/>}
        </>
    )
}

export default CommentAnswer;