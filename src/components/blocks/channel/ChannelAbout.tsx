import {formatDate} from "@composables/useFormatDate";

interface Props {
    readonly total: number;
    readonly date: string | undefined;
}

function ChannelAbout({total, date}: Props) {

    return (
        <div className="channel__about">
            <p className="h6 mb-10">Информация о канале</p>

            <ul className="channel__statistic">
                <li className="channel__statistic-item">Всего видео: {total}</li>
                <li className="channel__statistic-item">Дата создания: {formatDate(date || '')}</li>
            </ul>
        </div>
    )
}

export default ChannelAbout;