import axios from 'axios'

import {useUserStore} from "@store/useUserStore.ts";

const client = axios.create({
    baseURL: 'http://localhost:5557',
    timeout: 10000,
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})
client.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.data?.detail) {
            error.message = error.response.data.detail;
        }

        if (error.response?.status === 401) useUserStore.getState().logOut()

        return Promise.reject(error)
    }
)

export const apiGet = async <T>(url: string, params?: any, signal?: AbortSignal): Promise<T> => {
    const res = await client.get(url, { params, signal })
    return res.data as T
}

export const apiPost = async <T>(
    url: string,
    data?: any,
    config?: any,
    signal?: AbortSignal,
    onUploadProgress?: (percent: number) => void
): Promise<T> => {
    const finalConfig = {
        ...config,
        signal,
        onUploadProgress: (progressEvent: any) => {
            if (!progressEvent.total) return
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onUploadProgress?.(percent)
        },
    }
    const res = await client.post(url, data, finalConfig)
    return res.data as T
}

export const apiPatch = async <T>(
    url: string,
    data?: any,
    config?: any,
    signal?: AbortSignal
): Promise<T> => {
    const finalConfig = {
        ...config,
        signal,
    }
    const res = await client.patch(url, data, finalConfig)
    return res.data as T
}