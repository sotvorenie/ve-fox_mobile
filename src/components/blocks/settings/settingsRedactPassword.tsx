import {useEffect, useState} from "react";

import {SuccessResponse} from "@/types/success";

import {apiCheckUserPassword, apiRedactUserPassword} from "@api/user/user";

import {showError} from "@utils/modals";

import ButtonUi from "@ui/ButtonUi";
import Modal from "@common/Modal";
import InputUi from "@ui/InputUi";

function SettingsRedactPassword() {
    const [password, setPassword] = useState<string>("")
    const [duplicatePassword, setDuplicatePassword] = useState<string>("")

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false)
    const [isActiveBtn, setIsActiveBtn] = useState<boolean>(false)

    const [isOldMode, setIsOldMode] = useState<boolean>(true)

    const subtitleText = isOldMode
        ? 'В целях безопасности введите актуальный пароль:'
        : 'Придумайте новый пароль:'

    const clear = () => {
        setIsVisibleModal(false)
        setIsOldMode(true)
        setPassword('')
        setDuplicatePassword('')
    }

    const checkPassword = async () => {
        try {
            setIsLoading(true)

            const response: SuccessResponse = await apiCheckUserPassword(password)

            if (response.success) {
                setIsOldMode(false)
                setPassword('')
            } else {
                await showError(
                    'Ошибка редактирования пароля',
                    'Неверный пароль'
                )
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const redactPassword = async () => {
        try {
            setIsLoading(true)

            await apiRedactUserPassword(password)

            clear()
        } catch (err: any) {
            console.error(err)

            await showError(
                'Ошибка редактирования пароля',
                `${err.message}`
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setIsActiveBtn(isOldMode ? password?.length > 0 : password?.length > 0 && duplicatePassword?.length > 0 && password === duplicatePassword)
    }, [password, duplicatePassword])

    return (
        <>
            <ButtonUi func={() => setIsVisibleModal(true)} className="w-100 mb-20">Изменить пароль</ButtonUi>

            <Modal visible={isVisibleModal}
                   setVisible={setIsVisibleModal}
                   closeActive={!isLoading}
            >
                <form>
                    <p className="h6 mb-15">Смена пароля</p>
                    <p className="mb-20">{subtitleText}</p>
                    <InputUi
                        name="password"
                        id="password"
                        title="Пароль"
                        visibleCounter={true}
                        value={password}
                        setValue={setPassword}
                        className={isOldMode ? 'mb-30' : 'mb-20'}
                    />

                    {!isOldMode && (
                        <>
                            <p className="mb-20">Повторите пароль:</p>
                            <InputUi
                                name="duplicate-password"
                                id="duplicate-password"
                                title="Повтор пароля"
                                visibleCounter={true}
                                value={duplicatePassword}
                                setValue={setDuplicatePassword}
                                className="mb-30"
                            />
                        </>
                    )}

                    <div className="row gap-20">
                        <ButtonUi
                            className="col-6"
                            func={clear}
                            isLoading={isLoading}
                        >
                            Отмена
                        </ButtonUi>
                        <ButtonUi
                            className="col-6"
                            func={isOldMode ? checkPassword : redactPassword}
                            isLoading={isLoading}
                            isDisabled={!isActiveBtn}
                        >
                            Отправить
                        </ButtonUi>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default SettingsRedactPassword;