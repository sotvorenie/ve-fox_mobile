import {forwardRef, RefObject, KeyboardEvent} from "react";

import InputUi from "@ui/InputUi.tsx";
import ButtonUi from "@ui/ButtonUi.tsx";

interface Props {
    commentText: string
    setCommentText: (commentText: string) => void
    addNewComment: () => Promise<void>
    cancel: () => void
    isLoading: boolean
    hideButton?: boolean
}

const CommentsInput = forwardRef<HTMLInputElement, Props>(({
    commentText,
    setCommentText,
    addNewComment,
    cancel,
    isLoading,
    hideButton = true,
}, ref) => {
    const inputRef = ref as RefObject<HTMLInputElement | null>

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') if (commentText?.trim() && !isLoading) addNewComment().then()
    }

    return (
        <>
            <InputUi name="comment"
                     className="w-100"
                     id="comment"
                     placeholder="Введите комментарий.."
                     title=""
                     value={commentText}
                     setValue={setCommentText}
                     maxLength={1000}
                     visibleCounter={false}
                     hasCross
                     isTransparent
                     ref={inputRef}
                     onKeyDown={handleKeyDown}
            />

            <div className={`comments__btn-bar row gap-10 ${commentText?.length || !hideButton ? 'is-active' : ''}`}>
                <ButtonUi func={addNewComment}
                          className="comments__btn col-6 is-small"
                          isDisabled={!commentText || isLoading}
                >
                    Отправить
                </ButtonUi>
                <ButtonUi func={() => {
                              cancel()
                              inputRef.current?.blur()
                          }}
                          className="comments__btn col-6"
                          isDisabled={isLoading}
                >
                    Отмена
                </ButtonUi>
            </div>
        </>
    )
})

export default CommentsInput;