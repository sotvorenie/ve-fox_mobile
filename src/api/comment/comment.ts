import {CommentsListResponse, CommentForListResponse, CommentDeletedCount} from "@/types/comment";
import {LikeResponse} from "@/types/like.ts";

import { apiGet, apiPost, apiPatch } from "@api/index";

export const apiGetVideoComments = (
    videoId: number,
    page: number = 1,
    limit: number = 21,
    isNew: boolean = true
): Promise<CommentsListResponse> => {
    return apiGet(`/comment/${videoId}?page=${page}&limit=${limit}&is_new=${isNew}`)
}

export const apiGetCommentAnswers = (
    commentId: number,
    page: number = 1,
    limit: number = 21
): Promise<CommentsListResponse> => {
    return apiGet(`/comment/answers/${commentId}?page=${page}&limit=${limit}`)
}

export const apiAddNewComment = (
    videoId: number,
    text: string,
    parentId?: number
): Promise<CommentForListResponse> => {
    return apiPost(`/comment/add/${videoId}`, { text, parent_id: parentId })
}

export const apiEditComment = (
    commentId: number,
    text: string
): Promise<CommentForListResponse> => {
    return apiPatch(`/comment/redact/${commentId}`, { text })
}

export const apiDeleteComment = (commentId: number): Promise<CommentDeletedCount> => {
    return apiPost(`/comment/delete/${commentId}`)
}

export const apiLikeComment = (commentId: number): Promise<LikeResponse> => {
    return apiPost(`/comment/like/${commentId}`)
}