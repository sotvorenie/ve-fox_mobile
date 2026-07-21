import {useEffect, useState} from "react";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

import {apiDeleteSavedTime, apiSaveTime} from "@api/save_time/saveTime.ts";
import {apiGetUserRouterMap, apiSetUserRouterMap} from "@api/user/user.ts";

import {showConfirm} from "@utils/modals.ts";

import MainPage from "@pages/MainPage";
import VideoPage from "@pages/VideoPage";
import MainLayout from "@/layouts/MainLayout";
import SearchPage from "@pages/SearchPage";
import ChannelPage from "@pages/ChannelPage";
import HistoryPage from "@pages/HistoryPage";
import LikedPage from "@pages/LikedPage";
import WatchLaterPage from "@pages/WatchLaterPage";
import AuthPage from "@pages/AuthPage";

import {useUserStore} from "@store/useUserStore";
import {useVideoStore} from "@store/useVideoStore.ts";
import {usePlayerStore} from "@store/usePlayerStore.ts";
import {useRouterMapStore} from "@store/useRouterMapStore.ts";
import {useVideoSeedStore} from "@store/useVideoSeedStore.ts";

function App() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        checkMe,
    } = useUserStore()
    const {
        routerMap,
        currentIndex,
    } = useRouterMapStore()
    const {
        setRouterMap,
        addRoute,
    } = useRouterMapStore()
    const {setVideoSeed} = useVideoSeedStore()

    const [isLoading, setIsLoading] = useState(true)

    const loadApp = async () => {
        let finalMap: string[] = []
        const getMapFromLocStore = () => {
            const rawData = localStorage.getItem('router-map')
            if (!rawData) return

            try {
                const parsed = JSON.parse(rawData)
                if (Array.isArray(parsed)) finalMap = parsed
            } catch (e) {
                console.warn("Невалидный JSON в localStorage, очистка:", e)
                localStorage.removeItem('router-map')
            }
        }

        setVideoSeed(Math.random() * 2 - 1)

        try {
            setIsLoading(true)
            await checkMe()

            if (useUserStore.getState().isLogged) {
                const hasRouterMap: boolean = localStorage.getItem('has-router-map') === 'true'
                if (hasRouterMap) {
                    const response = await apiGetUserRouterMap()
                    if (response?.router_map) finalMap = JSON.parse(response.router_map)
                }
            } else getMapFromLocStore()
        } catch (err) {
            console.error(err)
            getMapFromLocStore()
        } finally {
            if (finalMap.length > 0) {
                setRouterMap(finalMap)
                const lastPath = finalMap[finalMap.length - 1]
                navigate(lastPath, { replace: true })
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadApp().then()
    }, [])

    useEffect(() => {
        let unListen: () => void

        const initListener = async () => {
            unListen = await listen('request-close', async () => {
                const check = await showConfirm(
                    'Выход из приложения',
                    'Вы действительно хотите выйти?'
                )
                if (check) {
                    const video = useVideoStore.getState().video
                    const currentTime = +usePlayerStore.getState().currentTime
                    if (video && video.id > 0 && useUserStore.getState().isLogged) {
                        const duration = +usePlayerStore.getState().duration

                        const differenceTime = duration - currentTime
                        const threshold = Math.max(duration * 0.07, 30)
                        const isFinished = differenceTime < threshold
                        if (isFinished) {
                            await apiDeleteSavedTime(video.id).then()
                        } else {
                            await apiSaveTime(video.id, currentTime).then()
                        }
                    }

                    let routerForSave = useRouterMapStore.getState().routerMap.slice(0, useRouterMapStore.getState().currentIndex + 1)
                    if (useUserStore.getState().isLogged) {
                        await apiSetUserRouterMap(routerForSave)
                        localStorage.setItem('has-router-map', JSON.stringify(routerForSave?.length > 0))
                    } else {
                        localStorage.setItem('router-map', JSON.stringify(routerForSave))
                    }

                    await getCurrentWindow().destroy()
                }
            })
        }

        initListener().then()

        return () => {
            if (unListen) unListen()
        }
    }, [])

    useEffect(() => {
        if (isLoading) return
        if (location.pathname !== routerMap[currentIndex]) {
            if (location.pathname.startsWith('/video/') || location.pathname.startsWith('/channel/')) {
                addRoute(location.pathname)
            } else {
                setRouterMap([])
            }
        }
        if (location.pathname === '/auth') useUserStore.getState().logOut()
    }, [location])


    if (isLoading) {
        return <></>
    }

  return (
      <main className="main">
        <Routes>
            <Route path="/auth" element={<AuthPage/>} />
            <Route element={<MainLayout />}>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/search" element={<SearchPage/>}/>
                <Route path="/channel/:id" element={<ChannelPage/>}/>
                <Route path="/history" element={<HistoryPage/>}/>
                <Route path="/liked" element={<LikedPage/>}/>
                <Route path="/watch_later" element={<WatchLaterPage/>}/>
            </Route>
          <Route path="/video/:id" element={<VideoPage />}/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
  )
}

export default App;
