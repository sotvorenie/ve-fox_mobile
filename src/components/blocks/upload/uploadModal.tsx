import {useEffect, useState} from "react";

import {BASE_URL} from "@api/url";

import LoadingIcon from "@icons/LoadingIcon";
import EmptyIcon from "@icons/EmptyIcon";

interface Props {
    apiFunc: () => Promise<void>
    changeFunc: (value?: any) => void
    listArr: Array<any>
    activeItem: any
    total: number
    emptyText: string
}

function UploadModal({
                                 apiFunc = async () => {},
                                 changeFunc = () => {},
                                 listArr = [],
                                 activeItem = -1,
                                 total = 0,
                                 emptyText = ''
}: Readonly<Props>) {
    const [name, setName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [filteredArray, setFilteredArray] = useState<any[]>([])

    useEffect(() => {
        setIsLoading(true)
        apiFunc().finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        if (listArr?.length) setFilteredArray(listArr)
    }, [listArr])

    useEffect(() => {
        const handler = setTimeout(() => {
            setFilteredArray(
                listArr.filter(item =>
                    item.name.toLowerCase().includes(name.trim().toLowerCase())
                )
            )
        }, 500)

        return () => clearTimeout(handler)
    }, [name, listArr])

    if (isLoading) return (
        <div className="upload-modal absolute-center recolor-svg">
            <LoadingIcon size={50}/>
        </div>
    )

    return (
        <div className="upload-modal">
            <input
                className="upload-modal__input input__inp w-100 mb-15"
                type="text"
                placeholder="Поиск.."
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <p className="text-w500 mb-15">Всего элементов: {total}</p>

            {filteredArray?.length
                ? (
                    <ul className="upload-modal__list flex flex-column">
                        {filteredArray?.map(item => (
                            <li key={item?.id} className='upload-modal__item'>
                                <button className={
                                    `upload-modal__btn flex flex-align-center w-100 hover-color-accent 
                                        ${activeItem?.id === item?.id ? 'is-active' : ''}`
                                }
                                        type="button"
                                        onClick={() => changeFunc(item.id)}
                                >
                                    {item.avatar_url && (
                                        <div className="upload-modal__img-container img-container radius-50">
                                            <img src={`${BASE_URL}${item.avatar_url}`} alt={item.name}/>
                                        </div>
                                    )}

                                    <p className="upload-modal__name text-w600">{item.name}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                )
                : (<div className="flex flex-column flex-align-center recolor-svg">
                    <EmptyIcon className="mb-10"/>
                    <span className="text-center">{emptyText}</span>
                </div>)
            }
        </div>
    )
}

export default UploadModal;