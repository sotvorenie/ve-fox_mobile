import {useEffect, useState} from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";

import MainPage from "@pages/MainPage";
import VideoPage from "@pages/VideoPage";
import MainLayout from "@/layouts/MainLayout";
import SearchPage from "@pages/SearchPage";
import ChannelPage from "@pages/ChannelPage";
import HistoryPage from "@pages/HistoryPage";
import LikedPage from "@pages/LikedPage";
import WatchLaterPage from "@pages/WatchLaterPage";
import AuthPage from "@pages/AuthPage";
import UserPage from "@pages/UserPage.tsx";
import SettingsPage from "@pages/SettingsPage.tsx";

import {useUserStore} from "@store/useUserStore";
import {useVideoSeedStore} from "@store/useVideoSeedStore.ts";

function App() {
    const location = useLocation();

    const {checkMe} = useUserStore()
    const {setVideoSeed} = useVideoSeedStore()

    const [isLoading, setIsLoading] = useState(true)

    const loadApp = async () => {
        setVideoSeed(Math.random() * 2 - 1)

        try {
            setIsLoading(true)
            await checkMe()
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadApp().then()
    }, [])

    useEffect(() => {
        if (isLoading) return

        setTimeout(() => {
            document.querySelector('.main-layout__content')?.scrollTo(0,0)
        }, 0)

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
                <Route path="/user" element={<UserPage/>}/>
                <Route path="/settings" element={<SettingsPage/>}/>
                <Route path="/video/:id" element={<VideoPage />}/>
            </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
  )
}

export default App;
