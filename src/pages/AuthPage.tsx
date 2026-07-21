import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import {UserWithToken} from "@/types/user";

import {apiAuth, apiRegister} from "@api/auth/auth";

import {onSubmit, onBlur, onInput} from "@composables/useFormValidation";
import {showWarning} from "@utils/modals";

import LoadingIcon from "@icons/LoadingIcon";

import {useUserStore} from "@store/useUserStore";

function AuthPage() {
    const navigate = useNavigate();

    const {logIn} = useUserStore()

    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [isAuth, setIsAuth] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const buttonText = isAuth ? 'Войти' : 'Зарегистрироваться';

    const clear = () => {
        setLogin('')
        setPassword('')
        setName('')

        document.querySelectorAll('.fields_error')?.forEach(el => el.textContent = '')
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (onSubmit(e.nativeEvent)) {
            try {
                setIsLoading(true)
                const data: UserWithToken = isAuth ?
                    await apiAuth(login, password)
                    : await apiRegister(login, password, name)
                logIn(data)
                navigate('/')
            } catch (err: any) {
                await showWarning(
                    'Ошибка аутентификации',
                    err.message
                )
            } finally {
                setIsLoading(false)
            }
        }
    }

    const goWithoutLogin = () => {
        navigate('/')
    }

    return (
        <div className="auth flex-center flex-column h-100">

            <div className="auth__header flex flex-align-center">
                <button className={`auth__btn hover-color-accent ${isAuth ? 'is-active' : ''}`}
                        type="button"
                        onClick={() => {
                            clear()
                            setIsAuth(true)
                        }}
                        disabled={isLoading}
                >
                    Авторизация
                </button>
                <button className={`auth__btn hover-color-accent ${isAuth ? '' : 'is-active'}`}
                        type="button"
                        onClick={() => {
                            clear()
                            setIsAuth(false)
                        }}
                        disabled={isLoading}
                >Регистрация
                </button>
            </div>

            <form className="auth__form flex flex-column"
                  noValidate
                  method="post"
                  data-js-form=""
                  onSubmit={(e) => {
                      e.preventDefault()
                      submit(e).then(() => {})
                  }}
            >
                <label htmlFor="login" className="auth__label position-relative">
                    <span className="visually-hidden">Логин</span>
                    <input type="text"
                           id="login"
                           className="auth__input input w-100"
                           placeholder="Логин"
                           required
                           aria-describedby="login-error"
                           value={login}
                           onChange={(e) => setLogin(e.target.value)}
                           autoComplete="username"
                           onBlur={(e) => onBlur(e.nativeEvent)}
                           onInput={(e) => onInput(e.nativeEvent)}
                           minLength={4}
                           maxLength={15}
                           readOnly={isLoading}
                    />
                    <span className="auth__error fields_error position-absolute"
                          id="login-error"
                          data-js-form-field-errors=""
                    />
                </label>
                <label htmlFor="password" className="auth__label position-relative">
                    <span className="visually-hidden">Пароль</span>
                    <input type="text"
                           id="password"
                           className="auth__input input w-100"
                           placeholder="Пароль"
                           required
                           aria-describedby="password-error"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           onBlur={(e) => onBlur(e.nativeEvent)}
                           onInput={(e) => onInput(e.nativeEvent)}
                           minLength={4}
                           maxLength={15}
                           readOnly={isLoading}
                    />
                    <span className="auth__error fields_error position-absolute"
                          id="password-error"
                          data-js-form-field-errors=""
                    />
                </label>

                {!isAuth && (
                    <label htmlFor="name" className="auth__label position-relative">
                        <span className="visually-hidden">Имя пользователя</span>
                        <input type="text"
                               id="name"
                               className="auth__input input w-100"
                               placeholder="Имя пользователя"
                               required={!isAuth}
                               aria-describedby="name-error"
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               onBlur={(e) => onBlur(e.nativeEvent)}
                               onInput={(e) => onInput(e.nativeEvent)}
                               minLength={4}
                               maxLength={15}
                               readOnly={isLoading}
                        />
                        <span className="auth__error fields_error position-absolute"
                              id="name-error"
                              data-js-form-field-errors=""
                        />
                    </label>
                )}

                <button className="auth__submit hover-color-accent flex-center recolor-svg"
                        type="submit"
                        disabled={isLoading}
                >
                    {isLoading ? (<LoadingIcon/>) : buttonText}
                </button>

                <button className="auth__submit hover-color-accent"
                        type="button"
                        onClick={goWithoutLogin}
                >Войти как Гость
                </button>
            </form>

        </div>
    )
}

export default AuthPage;