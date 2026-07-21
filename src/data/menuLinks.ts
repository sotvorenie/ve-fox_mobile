import {Menu} from "@/types/menu";

import HomeIcon from "@icons/HomeIcon";
import HistoryIcon from "@icons/HistoryIcon";
import LikeIcon from "@icons/LikeIcon";
import LaterIcon from "@icons/LaterIcon";
import UserIcon from "@icons/UserIcon";

const menuItems: Menu[] = [
    {
        title: 'Главная',
        icon: HomeIcon,
    },
    {
        title: 'История',
        icon: HistoryIcon,
    },
    {
        title: 'Понравившиеся',
        icon: LikeIcon,
    },
    {
        title: 'Смотреть позже',
        icon: LaterIcon,
    },
    {
        title: 'Пользователь',
        icon: UserIcon,
    },
]

export default menuItems