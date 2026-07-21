import React, {useRef, useState} from "react";
import {Area} from "react-easy-crop";

import {BASE_URL} from "@api/url";

import {UserAvatar} from "@/types/user";

import {apiRedactUserAvatar} from "@api/user/user";

import {cropPhoto} from "@composables/useCropPhoto.ts";

import {showConfirm, showError} from "@utils/modals";
import SettingsCropAvatar from "@settings/settingsCropAvatar.tsx";

import UserIcon from "@icons/UserIcon";
import RedactIcon from "@icons/RedactIcon";

import {useUserStore} from "@store/useUserStore";

interface Props {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

function SettingsRedactAvatar({isLoading, setIsLoading}: Readonly<Props>) {
    const {user} = useUserStore()
    const {updateUser} = useUserStore()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const avatarInputRef = useRef<HTMLInputElement | null>(null)

    const handleAvatar = () => {
        if (isLoading) return
        avatarInputRef.current?.click()
    }

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setSelectedFile(file)
    }

    const updateAvatar = async () => {
        if (!selectedFile || !croppedAreaPixels) return

        const confirm = await showConfirm(
            'Изменить фото профиля',
            'Ваша текущая аватарка будет заменена. Продолжить?'
        )
        if (!confirm) return

        setIsLoading(true)
        const imageUrl = URL.createObjectURL(selectedFile)
        try {
            const croppedPhoto = await cropPhoto(imageUrl, croppedAreaPixels)

            const response: UserAvatar = await apiRedactUserAvatar(croppedPhoto)
            if (response.new_avatar_url) updateUser({avatar_url: response.new_avatar_url})

        } catch (err) {
            console.error(err)
            await showError(
                'Ошибка загрузки фото',
                'Не удалось загрузить аватар..'
            )
        } finally {
            URL.revokeObjectURL(imageUrl)
            setIsLoading(false)
            setSelectedFile(null)
        }
    }

    return (
        <>
            {selectedFile && (
                <SettingsCropAvatar setCroppedAreaPixels={setCroppedAreaPixels}
                                    selectedFile={selectedFile}
                                    setSelectedFile={setSelectedFile}
                                    updateAvatar={updateAvatar}
                                    isLoading={isLoading}
                />
            )}

            <div
                className="redact-user__img-container img-container position-relative recolor-svg col-6 aspect-1 flex-center"
                title="Редактировать аватар"
                onClick={handleAvatar}
            >
                {user.avatar_url ? (<img src={`${BASE_URL}/${user.avatar_url}`} alt=""/>) : (<UserIcon/>)}

                <RedactIcon className="absolute-center tr-opacity z-1 pointer-none"/>

                <input
                    type="file"
                    className="visually-hidden"
                    accept="image/*"
                    onChange={onFileSelect}
                    ref={avatarInputRef}
                />
            </div>
        </>
    )
}

export default SettingsRedactAvatar;