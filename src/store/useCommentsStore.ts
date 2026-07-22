import {create} from "zustand";

import {CommentDeletedCount, CommentForListResponse} from "@/types/comment.ts";

import {
    apiAddNewComment,
    apiDeleteComment,
    apiGetPopularVideoComment,
    apiGetVideoComments
} from "@api/comment/comment.ts";

import {useVideoStore} from "@store/useVideoStore.ts";

interface CommentsState {
    total: number
    page: number
    hasMore: boolean
    comments: CommentForListResponse[]
    popularComment: CommentForListResponse
    isLoading: boolean
    isAdding: boolean
    isPopular: boolean
    commentText: string
    isOpen: boolean

    setTotal: (total: any) => void
    setPage: (page: number) => void
    setHasMore: (hasMore: boolean) => void
    setComments: (comments: CommentForListResponse[]) => void
    setIsLoading: (isLoading: boolean) => void
    setIsAdding: (isAdding: boolean) => void
    setIsPopular: (isPopular: boolean) => void
    setCommentText: (text: string) => void
    setIsOpen: (isOpen: boolean) => void

    clear: (setLoading?: boolean) => void

    getComments: (setLoading?: boolean) => Promise<void>
    getPopularComment: () => Promise<void>
    addNewComment: () => Promise<void>
    deleteComment: (id: number) => Promise<void>
}

const popularComment: CommentForListResponse = {
    id: -1,
    text: '',
    date: '',
    is_redacted: false,
    is_liked: false,
    likes: 0,
    question_comments_count: 0,
    user: {
        id: -1,
        name: '',
        avatar_url: '',
    },
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
    total: 0,
    page: 0,
    hasMore: true,
    comments: [],
    popularComment: popularComment,
    isLoading: true,
    isAdding: false,
    isPopular: false,
    commentText: '',
    isOpen: false,

    setTotal: (total: number) => set({total: total}),
    setPage: (page: number) => set({page}),
    setHasMore: (hasMore: boolean) => set({hasMore: hasMore}),
    setComments: (comments: CommentForListResponse[]) => set({comments: comments}),
    setIsLoading: (isLoading: boolean) => set({isLoading}),
    setIsAdding: (isAdding: boolean) => set({isAdding: isAdding}),
    setIsPopular: (isPopular: boolean) => set({isPopular: isPopular}),
    setCommentText: (text: string) => set({commentText: text}),
    setIsOpen: (isOpen: boolean) => set({isOpen: isOpen}),

    clear: (setLoading = true) => set((state) => ({
        comments: [],
        popularComment: popularComment,
        isLoading: setLoading,
        commentText: '',
        page: 0,
        isPopular: setLoading ? false : state.isPopular,
        isOpen: false,
    })),

    getComments: async (setLoading = true) => {
        const {video} = useVideoStore.getState()

        try {
            if (setLoading) set({isLoading: true})

            const response = await apiGetVideoComments(
                video.id,
                get().page + 1,
                21,
                !get().isPopular
            )
            if (response?.comments) set((state) => ({
                comments: [...state.comments, ...response.comments],
                total: response.total,
                page: response.page,
                hasMore: response.has_more
            }))
        } catch (err) {
            console.error(err)
        } finally {
            set({isLoading: false})
        }
    },
    getPopularComment: async () => {
        const {video} = useVideoStore.getState()

        try {
            const response = await apiGetPopularVideoComment(video.id,)
            if (response?.comments) set(({
                popularComment: response.comments[0],
                total: response.total,
                page: response.page,
                hasMore: response.has_more
            }))
        } catch (err) {
            console.error(err)
        } finally {
            set({isLoading: false})
        }
    },
    addNewComment: async () => {
        const {video} = useVideoStore.getState()

        try {
            set({isAdding: true})

            const response: CommentForListResponse = await apiAddNewComment(video.id, get().commentText)
            if (response) set((state) => ({
                comments: [response, ...state.comments],
                total: state.total + 1,
                commentText: '',
            }))
        } catch (err) {
            console.error(err)
        } finally {
            set({isAdding: false})
        }
    },
    deleteComment: async (id) => {
        try {
            const response: CommentDeletedCount = await apiDeleteComment(id)
            if (response) {
                set((state) => ({
                    comments: state.comments.filter((c) => c.id !== id),
                    total: state.total - response.deleted_count
                }))
            }
        } catch (err) {
            console.error(err)
        }
    },
}))