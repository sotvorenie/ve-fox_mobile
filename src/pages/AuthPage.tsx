import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import {UserWithToken} from "@/types/user";

import {apiAuth, apiRegister} from "@api/auth/auth";

import {onSubmit, onBlur, onInput} from "@composables/useFormValidation";
import {showWarning} from "@utils/modals";

import InputUi from "@ui/InputUi.tsx";
import ButtonUi from "@ui/ButtonUi.tsx";

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
        <div className="auth flex-center h-100">
            <form className="auth__form flex flex-column w-100 position-relative"
                  noValidate
                  method="post"
                  data-js-form=""
                  onSubmit={(e) => {
                      e.preventDefault()
                      submit(e).then(() => {
                      })
                  }}
            >
                <span className="auth__title h3 text-w500 mb-20">{isAuth ? 'Авторизация' : 'Регистрация'}</span>

                <InputUi name="login"
                         id="login"
                         title="Логин"
                         value={login}
                         setValue={setLogin}
                         required
                         autoComplete="username"
                         onBlur={(e) => onBlur(e.nativeEvent)}
                         onInput={(e) => onInput(e.nativeEvent)}
                         minLength={4}
                         maxLength={15}
                         readOnly={isLoading}
                         isDark
                         className="mb-30"
                />

                <InputUi name="password"
                         id="password"
                         title="Пароль"
                         value={password}
                         setValue={setPassword}
                         onBlur={(e) => onBlur(e.nativeEvent)}
                         onInput={(e) => onInput(e.nativeEvent)}
                         minLength={4}
                         maxLength={15}
                         readOnly={isLoading}
                         isDark
                         className="mb-30"
                />

                {!isAuth && (
                    <InputUi name="name"
                             id="name"
                             title="Имя пользователя"
                             value={name}
                             setValue={setName}
                             onBlur={(e) => onBlur(e.nativeEvent)}
                             onInput={(e) => onInput(e.nativeEvent)}
                             minLength={4}
                             maxLength={15}
                             readOnly={isLoading}
                             required={!isAuth}
                             isDark
                             className="mb-30"
                    />
                )}

                <ButtonUi func={() => {
                }}
                          isSubmit
                          isLoading={isLoading}
                          className="mb-15"
                >
                    {buttonText}
                </ButtonUi>

                <ButtonUi func={goWithoutLogin}>
                    Войти как Гость
                </ButtonUi>
            </form>

            <div className="auth__bottom text-nowrap">
                {isAuth ? (
                    <div className="flex flex-align-center gap-8 fs-14">
                        <span>Ещё не зарегистрированы? </span>
                        <button className="auth__btn"
                                type="button"
                                onClick={() => {
                                    clear()
                                    setIsAuth(false)
                                }}
                                disabled={isLoading}
                        >
                            Регистрация
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-align-center gap-8 fs-14">
                        <span>Уже есть профиль? </span>
                        <button className={`auth__btn hover-color-accent ${isAuth ? 'is-active' : ''}`}
                                type="button"
                                onClick={() => {
                                    clear()
                                    setIsAuth(true)
                                }}
                                disabled={isLoading}
                        >
                            Авторизуйтесь
                        </button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default AuthPage;