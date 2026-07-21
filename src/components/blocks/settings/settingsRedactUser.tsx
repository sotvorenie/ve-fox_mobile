import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {apiRedactUserName} from "@api/user/user";

import {showConfirm} from "@utils/modals";

import SettingsBlock from "@settings/settingsBlock";
import SettingsRedactPassword from "@settings/settingsRedactPassword";
import SettingsRedactAvatar from "@settings/settingsRedactAvatar";

import InputUi from "@ui/InputUi";
import ButtonUi from "@ui/ButtonUi";

import {useUserStore} from "@store/useUserStore";

interface Props {
    isVisible: boolean
    setIsVisible: (value:boolean) => void
}

function SettingsRedactUser({isVisible, setIsVisible}: Readonly<Props>) {
    const navigate = useNavigate();

    const {user, isLogged} = useUserStore()
    const {updateUser} = useUserStore()

    const [name, setName] = useState<string>("")

    const [isVisibleRedact, setIsVisibleRedact] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const titleText = () => isLogged ? 'Редактирование профиля' : 'Необходима авторизация'

    const handleRedact = async () => {
        const confirm = await showConfirm(
            'Редактирование имени пользователя',
            'Вы действительно хотите редактировать имя пользователя?'
        )

        if (confirm) {
            try {
                setIsLoading(true)

                await apiRedactUserName(name)

                updateUser({name: name})
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleLogout = async () => {
        const confirm = await showConfirm(
            'Выход из профиля',
            'Вы действительно хотите выйти?'
        )

        if (confirm) navigate('/auth')
    }

    useEffect(() => {
        setName(user.name)
    }, [user])

    useEffect(() => {
        setIsVisibleRedact(name !== user.name && name?.length > 0)
    }, [name])

    const renderIfIsLogged = () => (
        <>
            <SettingsRedactAvatar isLoading={isLoading} setIsLoading={setIsLoading}/>

            <div className="redact-user__right col-6 flex flex-column">
                <InputUi
                    name="name"
                    id="name"
                    title="Имя пользователя"
                    visibleCounter={true}
                    value={name}
                    setValue={setName}
                    className="mb-30"
                />

                <SettingsRedactPassword/>

                <ButtonUi
                    className="redact-user__redact w-100 mb-20"
                    func={handleRedact}
                    isDisabled={!isVisibleRedact}
                    isLoading={isLoading}
                >
                    Редактировать
                </ButtonUi>

                <ButtonUi
                    className="redact-user__logout w-100"
                    func={handleLogout}
                    isLoading={isLoading}
                >
                    Выйти
                </ButtonUi>
            </div>
        </>
    )

    const renderIfNotIsLogged = () => (
        <>
            <span className="col-3"></span>
            <Link to="/auth" className="col-5">
                <ButtonUi func={() => {}} className="w-100">Войти</ButtonUi>
            </Link>
        </>
    )

    return (
        <SettingsBlock isVisible={isVisible} setIsVisible={setIsVisible}>
            <SettingsBlock.Title>{titleText()}</SettingsBlock.Title>

            <SettingsBlock.Content className="redact-user row">
                {isLogged ? renderIfIsLogged() : renderIfNotIsLogged()}
            </SettingsBlock.Content>
        </SettingsBlock>
    )
}

export default SettingsRedactUser;